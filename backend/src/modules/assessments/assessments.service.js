const { Assessment, Submission } = require('./assessments.model');
const { Enrollment, LessonProgress } = require('../enrollments/enrollment.model');
const { Lesson } = require('../courses/course.model');
const mongoose = require('mongoose');

class AssessmentService {
  /**
   * Assessment Management
   */
  async createAssessment(data) {
    return await Assessment.create(data);
  }

  async getAssessments(query = {}, userId = null, userRole = 'student') {
    let assessments = await Assessment.find(query).sort({ createdAt: -1 }).lean();

    if (userRole === 'admin' || userRole === 'instructor') {
      return assessments.map(a => ({ ...a, isLocked: false, isEnrolled: true }));
    }

    // For students: Filter by enrollment and calculate locking status
    const userEnrollments = await Enrollment.find({ userId }).select('courseId').lean();
    const enrolledCourseIds = userEnrollments.map(e => e.courseId.toString());

    // Filter to only show quizzes from enrolled courses (or global ones if courseId is null)
    assessments = assessments.filter(a => !a.courseId || enrolledCourseIds.includes(a.courseId.toString()));

    // Enhance with lock status
    const enhancedAssessments = await Promise.all(assessments.map(async (assessment) => {
      const { isLocked, lockReason } = await this.isAssessmentLocked(assessment, userId, userRole);
      
      return {
        ...assessment,
        isLocked,
        lockReason,
        isEnrolled: !!(assessment.courseId && enrolledCourseIds.includes(assessment.courseId.toString()))
      };
    }));

    return enhancedAssessments;
  }

  async isAssessmentLocked(assessment, userId, userRole) {
    if (userRole === 'admin' || userRole === 'instructor') {
      return { isLocked: false };
    }

    // 1. Admin Release Check
    if (assessment.status !== 'published') {
      return { isLocked: true, lockReason: 'Not yet released by admin' };
    }

    // 2. Enrollment Check
    if (assessment.courseId) {
      const enrolled = await Enrollment.exists({ userId, courseId: assessment.courseId });
      if (!enrolled) {
        return { isLocked: true, lockReason: 'Enrolment required' };
      }
    }

    // 3. Module Progress Check
    if (assessment.courseId && assessment.moduleId) {
      const mandatoryLessons = await Lesson.find({ 
        moduleId: assessment.moduleId, 
        isMandatory: true 
      }).select('_id').lean();

      if (mandatoryLessons.length > 0) {
        const completedLessons = await LessonProgress.countDocuments({
          userId,
          lessonId: { $in: mandatoryLessons.map(l => l._id) },
          isCompleted: true
        });

        if (completedLessons < mandatoryLessons.length) {
          return { isLocked: true, lockReason: 'Complete module lessons to unlock' };
        }
      }
    }

    return { isLocked: false };
  }

  async getAssessmentById(id) {
    return await Assessment.findById(id);
  }

  async updateAssessment(id, data) {
    return await Assessment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteAssessment(id) {
    return await Assessment.findByIdAndDelete(id);
  }

  /**
   * Attempt Logic
   */
  async startAttempt(userId, assessmentId) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    
    // Check lock status
    const { isLocked, lockReason } = await this.isAssessmentLocked(assessment, userId);
    if (isLocked) throw new Error(`Assessment is locked: ${lockReason}`);

    // Check attempt limits
    const attemptCount = await Submission.countDocuments({ userId, assessmentId });
    if (attemptCount >= assessment.maxAttempts) {
      throw new Error('Maximum attempt limit reached');
    }

    return await Submission.create({
      userId,
      assessmentId,
      status: 'in-progress',
      startedAt: new Date(),
      totalPoints: assessment.questions.reduce((sum, q) => sum + q.points, 0)
    });
  }

  async submitQuiz(userId, submissionId, answers) {
    const submission = await Submission.findOne({ _id: submissionId, userId });
    if (!submission) throw new Error('Submission not found');
    if (submission.status !== 'in-progress') throw new Error('Attempt already submitted');

    const assessment = await Assessment.findById(submission.assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    // Check time limit
    if (assessment.timeLimit) {
      const timeTaken = (new Date() - submission.startedAt) / 60000;
      if (timeTaken > assessment.timeLimit + 1) { // 1 min buffer
         // Auto-submit logic would go here
      }
    }

    // Auto-grading for quizzes/exams
    let score = 0;
    let totalPoints = 0;
    
    const gradedAnswers = answers.map(ans => {
      const question = assessment.questions.id(ans.questionId);
      if (!question) return { ...ans, isCorrect: false };

      totalPoints += question.points;
      
      const correctIndices = question.options
        .map((opt, i) => opt.isCorrect ? i : null)
        .filter(i => i !== null);

      const isCorrect = JSON.stringify(correctIndices.sort()) === JSON.stringify(ans.selectedOptions.sort());
      if (isCorrect) score += question.points;

      return { 
        questionId: ans.questionId,
        selectedOptions: ans.selectedOptions,
        isCorrect,
        // Enriched data for high-fidelity review
        qText: question.text,
        options: question.options.map(o => o.text),
        correctIndex: correctIndices[0], // Simplified for single-choice MCQ UI
        explanation: question.explanation
      };
    });

    const percentage = (score / totalPoints) * 100;
    
    submission.answers = gradedAnswers;
    submission.score = Math.round(percentage);
    submission.totalPoints = totalPoints;
    submission.status = percentage >= 80 ? 'graded' : 'submitted'; // Mark graded if pass, or just submitted for review
    submission.submittedAt = new Date();
    submission.timeTaken = (submission.submittedAt - submission.startedAt) / 1000;

    return await submission.save();

  }

  async submitAssignment(userId, assessmentId, data) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    // Check deadline
    if (assessment.deadline && new Date() > assessment.deadline && !assessment.allowLateSubmission) {
      throw new Error('Deadline has passed');
    }

    return await Submission.findOneAndUpdate(
      { userId, assessmentId },
      { 
        ...data, 
        status: 'submitted', 
        submittedAt: new Date() 
      },
      { upsert: true, new: true }
    );
  }

  /**
   * Grading
   */
  async gradeSubmission(submissionId, graderId, gradeData) {
    return await Submission.findByIdAndUpdate(
      submissionId,
      {
        ...gradeData,
        status: 'graded',
        gradedBy: graderId,
        gradedAt: new Date()
      },
      { new: true }
    );
  }

  async getResults(query = {}) {
    return await Submission.find(query)
      .populate('assessmentId', 'title type')
      .populate('userId', 'fullName email')
      .sort({ submittedAt: -1 });
  }
}

module.exports = new AssessmentService();
