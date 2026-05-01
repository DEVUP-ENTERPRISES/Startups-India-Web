const { Assessment, Submission } = require('./assessments.model');
const mongoose = require('mongoose');

class AssessmentService {
  /**
   * Assessment Management
   */
  async createAssessment(data) {
    return await Assessment.create(data);
  }

  async getAssessments(query = {}) {
    return await Assessment.find(query).sort({ createdAt: -1 });
  }

  async getAssessmentById(id) {
    return await Assessment.findById(id);
  }

  /**
   * Attempt Logic
   */
  async startAttempt(userId, assessmentId) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');
    if (assessment.status !== 'published') throw new Error('Assessment not published');

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
