const mongoose = require('mongoose');
const { Progress } = require('../learning/learning.model');
const { Submission } = require('../assessments/assessments.model');
const { Video } = require('../learning/learning.model');

class AnalyticsService {
  /**
   * Progress Overview Aggregation
   */
  async getProgressOverview(userId) {
    const totalVideos = await Video.countDocuments();
    const completedVideos = await Progress.countDocuments({ userId, completed: true });
    
    // Aggregation by course
    const courseProgress = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'videos',
          localField: 'videoId',
          foreignField: '_id',
          as: 'video'
        }
      },
      { $unwind: '$video' },
      {
        $group: {
          _id: '$video.courseId',
          completedCount: { $sum: { $cond: ['$completed', 1, 0] } },
          totalWatchedSeconds: { $sum: '$watchedSeconds' }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          courseTitle: '$course.title',
          completedCount: 1,
          totalWatchedSeconds: 1,
          percentage: { $multiply: [{ $divide: ['$completedCount', { $max: [1, '$course.totalLessons'] }] }, 100] }
        }
      }
    ]);

    return {
      overallCompletion: totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0,
      completedItems: completedVideos,
      totalItems: totalVideos,
      courseBreakdown: courseProgress
    };
  }

  /**
   * Performance Analytics Aggregation
   */
  async getPerformanceAnalytics(userId) {
    const submissions = await Submission.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'graded' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', '$totalPoints'] } },
          maxScore: { $max: { $divide: ['$score', '$totalPoints'] } },
          totalAttempts: { $sum: 1 },
          avgTimeTaken: { $avg: '$timeTaken' }
        }
      }
    ]);

    const trends = await Submission.find({ userId, status: 'graded' })
      .populate('assessmentId')
      .sort({ submittedAt: 1 })
      .limit(10);

    const subjectBreakdown = await Submission.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'graded' } },
      {
        $lookup: {
          from: 'assessments',
          localField: 'assessmentId',
          foreignField: '_id',
          as: 'assessment'
        }
      },
      { $unwind: '$assessment' },
      {
        $lookup: {
          from: 'courses',
          localField: 'assessment.courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: '$course.title',
          score: { $avg: { $divide: ['$score', '$totalPoints'] } }
        }
      }
    ]);

    return {
      averageAccuracy: submissions.length > 0 ? submissions[0].avgScore * 100 : 0,
      bestPerformance: submissions.length > 0 ? submissions[0].maxScore * 100 : 0,
      totalEvaluations: submissions.length > 0 ? submissions[0].totalAttempts : 0,
      history: trends.map(s => ({
        date: s.submittedAt,
        accuracy: (s.score / s.totalPoints) * 100,
        title: s.assessmentId?.title
      })),
      subjects: subjectBreakdown.map(s => ({
        name: s._id,
        score: Math.round(s.score * 100)
      }))
    };
  }

  /**
   * Learning Time Aggregation
   */
  async getLearningTime(userId) {
    const timeData = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          seconds: { $sum: "$watchedSeconds" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalSeconds = timeData.reduce((acc, curr) => acc + curr.seconds, 0);

    return {
      totalHours: (totalSeconds / 3600).toFixed(1),
      dailyBreakdown: timeData.map(d => ({
        date: d._id,
        minutes: Math.round(d.seconds / 60)
      })),
      streak: 8, // Mock for now, would need a complex aggregation for real streaks
      peakHours: '09:00 PM - 11:00 PM'
    };
  }

  /**
   * Skill Graph Aggregation (Cognitive Traits)
   */
  async getSkillGraph(userId) {
    const submissions = await Submission.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'graded' } },
      {
        $lookup: {
          from: 'assessments',
          localField: 'assessmentId',
          foreignField: '_id',
          as: 'assessment'
        }
      },
      { $unwind: '$assessment' },
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: { $divide: ['$score', '$totalPoints'] } },
          avgSpeed: { 
            $avg: { 
              $cond: [
                { $gt: ['$assessment.timeLimit', 0] },
                { $divide: [{ $divide: ['$timeTaken', 60] }, '$assessment.timeLimit'] },
                0.5 // default if no time limit
              ]
            } 
          }
        }
      }
    ]);

    const subjects = await this.getPerformanceAnalytics(userId);

    const accuracy = submissions.length > 0 ? submissions[0].avgAccuracy * 100 : 0;
    const speed = submissions.length > 0 ? (1 - Math.min(submissions[0].avgSpeed, 1)) * 100 : 0;

    return {
      radar: [
        { label: 'Problem Solving', score: Math.round(accuracy * 1.05) },
        { label: 'Concept Mastery', score: Math.round(accuracy) },
        { label: 'Speed', score: Math.round(speed) },
        { label: 'Accuracy', score: Math.round(accuracy) },
        { label: 'Memory Retention', score: Math.round(accuracy * 0.95) }
      ],
      proficiency: subjects.subjects
    };
  }
}

module.exports = new AnalyticsService();
