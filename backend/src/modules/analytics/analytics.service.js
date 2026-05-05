const mongoose = require('mongoose');
const { Progress } = require('../learning/learning.model');
const { Submission } = require('../assessments/assessments.model');
const { Video } = require('../learning/learning.model');

class AnalyticsService {
  async getProgressOverview(userId) {
    const objId = new mongoose.Types.ObjectId(userId);

    const totalVideos = await Video.countDocuments();
    const completedVideos = await Progress.countDocuments({ userId: objId, completed: true });

    const courseProgress = await Progress.aggregate([
      { $match: { userId: objId } },
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
          percentage: {
            $multiply: [
              { $divide: ['$completedCount', { $max: [1, '$course.totalLessons'] }] },
              100
            ]
          }
        }
      },
      { $sort: { percentage: -1 } }
    ]);

    return {
      overallCompletion: totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0,
      completedItems: completedVideos,
      totalItems: totalVideos,
      courseBreakdown: courseProgress
    };
  }

  async getPerformanceAnalytics(userId) {
    const objId = new mongoose.Types.ObjectId(userId);

    const submissions = await Submission.aggregate([
      { $match: { userId: objId, status: 'graded' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', { $max: [1, '$totalPoints'] }] } },
          maxScore: { $max: { $divide: ['$score', { $max: [1, '$totalPoints'] }] } },
          totalAttempts: { $sum: 1 }
        }
      }
    ]);

    const trends = await Submission.find({ userId: objId, status: 'graded' })
      .populate('assessmentId', 'title')
      .sort({ submittedAt: 1 })
      .limit(10)
      .lean();

    const subjectBreakdown = await Submission.aggregate([
      { $match: { userId: objId, status: 'graded' } },
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
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$course.title', '$assessment.title'] },
          score: { $avg: { $divide: ['$score', { $max: [1, '$totalPoints'] }] } }
        }
      },
      { $sort: { score: -1 } }
    ]);

    return {
      averageAccuracy: submissions.length > 0 ? submissions[0].avgScore * 100 : 0,
      bestPerformance: submissions.length > 0 ? submissions[0].maxScore * 100 : 0,
      totalEvaluations: submissions.length > 0 ? submissions[0].totalAttempts : 0,
      history: trends.map(s => ({
        date: s.submittedAt,
        accuracy: s.totalPoints > 0 ? (s.score / s.totalPoints) * 100 : 0,
        title: s.assessmentId?.title || 'Assessment'
      })),
      subjects: subjectBreakdown.map(s => ({
        name: s._id || 'General',
        score: Math.round(s.score * 100)
      }))
    };
  }

  async getLearningTime(userId) {
    const objId = new mongoose.Types.ObjectId(userId);

    const timeData = await Progress.aggregate([
      { $match: { userId: objId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          seconds: { $sum: '$watchedSeconds' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalSeconds = timeData.reduce((acc, curr) => acc + curr.seconds, 0);

    // Calculate streak from consecutive active days
    const activeDaySet = new Set(timeData.filter(d => d.seconds > 0).map(d => d._id));
    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const startOffset = activeDaySet.has(todayStr) ? 0 : 1;
    for (let i = startOffset; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (activeDaySet.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    // Average daily hours across active days only
    const activeDayCount = activeDaySet.size;
    const avgDailyHours = activeDayCount > 0
      ? (totalSeconds / 3600 / activeDayCount).toFixed(1)
      : '0.0';

    // Peak hour from progress activity timestamps
    let peakHours = 'Analyzing...';
    const peakHourData = await Progress.aggregate([
      { $match: { userId: objId, watchedSeconds: { $gt: 0 } } },
      { $project: { hour: { $hour: '$updatedAt' } } },
      { $group: { _id: '$hour', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (peakHourData.length > 0) {
      const h = peakHourData[0]._id;
      const hEnd = (h + 2) % 24;
      const fmt = (n) => {
        const ampm = n >= 12 ? 'PM' : 'AM';
        const h12 = n % 12 === 0 ? 12 : n % 12;
        return `${h12} ${ampm}`;
      };
      peakHours = `${fmt(h)} – ${fmt(hEnd)}`;
    }

    return {
      totalHours: (totalSeconds / 3600).toFixed(1),
      dailyBreakdown: timeData.map(d => ({
        date: d._id,
        minutes: Math.round(d.seconds / 60)
      })),
      streak,
      avgDailyHours,
      peakHours
    };
  }

  async getSkillGraph(userId) {
    const objId = new mongoose.Types.ObjectId(userId);

    const submissions = await Submission.aggregate([
      { $match: { userId: objId, status: 'graded' } },
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
          avgAccuracy: { $avg: { $divide: ['$score', { $max: [1, '$totalPoints'] }] } },
          avgSpeed: {
            $avg: {
              $cond: [
                { $gt: ['$assessment.timeLimit', 0] },
                { $divide: [{ $divide: ['$timeTaken', 60] }, '$assessment.timeLimit'] },
                0.5
              ]
            }
          }
        }
      }
    ]);

    const subjects = await this.getPerformanceAnalytics(userId);

    const accuracy = submissions.length > 0 ? submissions[0].avgAccuracy * 100 : 0;
    const speed = submissions.length > 0
      ? (1 - Math.min(submissions[0].avgSpeed, 1)) * 100
      : 0;

    return {
      radar: [
        { label: 'Problem Solving', score: Math.min(100, Math.round(accuracy * 1.05)) },
        { label: 'Concept Mastery', score: Math.min(100, Math.round(accuracy)) },
        { label: 'Speed', score: Math.min(100, Math.round(speed)) },
        { label: 'Accuracy', score: Math.min(100, Math.round(accuracy)) },
        { label: 'Memory Retention', score: Math.min(100, Math.round(accuracy * 0.95)) }
      ],
      proficiency: subjects.subjects
    };
  }
}

module.exports = new AnalyticsService();
