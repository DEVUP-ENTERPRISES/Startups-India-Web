const mongoose = require('mongoose');
const { Badge, UserBadge } = require('./achievements.model');
const { Certificate } = require('../certificates/certificate.model');
const { Submission } = require('../assessments/assessments.model');
const { Progress } = require('../learning/learning.model');
const { User } = require('../users/user.model');

class AchievementsService {
  async getCertificates(userId) {
    return await Certificate.find({ userId }).sort({ completionDate: -1 });
  }

  async getBadges(userId) {
    const userBadges = await UserBadge.find({ userId }).populate('badgeId');
    return userBadges.map(ub => ({
      ...ub.badgeId._doc,
      earnedAt: ub.earnedAt
    }));
  }

  async getAllBadges() {
    return await Badge.find({});
  }

  async getLeaderboard(scope = 'global') {
    const matchStage = { status: 'graded' };
    
    if (scope === 'monthly') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      matchStage.createdAt = { $gte: startOfMonth };
    }

    // Ranking criteria: Total scores / total possible * weight + certificates * weight
    return await Submission.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalPoints: { $sum: '$totalPoints' },
          attempts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'certificates',
          localField: '_id',
          foreignField: 'userId',
          as: 'certificates'
        }
      },
      {
        $project: {
          fullName: '$user.fullName',
          avatarUrl: '$user.avatarUrl',
          score: { $multiply: [{ $divide: ['$totalScore', { $max: [1, '$totalPoints'] }] }, 1000] },
          certCount: { $size: '$certificates' },
          rankValue: { 
            $add: [
              { $multiply: [{ $divide: ['$totalScore', { $max: [1, '$totalPoints'] }] }, 1000] },
              { $multiply: [{ $size: '$certificates' }, 100] }
            ]
          }
        }
      },
      { $sort: { rankValue: -1 } },
      { $limit: 50 }
    ]);
  }

  async checkAndAssignBadges(userId) {
    // 1. Check for "First Certificate" badge
    const certCount = await Certificate.countDocuments({ userId });
    if (certCount >= 1) {
      await this.assignBadgeByName(userId, 'Certification Milestone');
    }

    // 2. Check for "Perfect Score" badge
    const perfectScore = await Submission.findOne({ userId, score: { $gte: 100 } });
    if (perfectScore) {
      await this.assignBadgeByName(userId, 'Perfect Accuracy');
    }

    // 3. Check for "Consistent Learner" (5+ videos)
    const videoCount = await Progress.countDocuments({ userId, completed: true });
    if (videoCount >= 5) {
      await this.assignBadgeByName(userId, 'Consistent Learner');
    }
  }

  async assignBadgeByName(userId, badgeName) {
    const badge = await Badge.findOne({ name: badgeName });
    if (!badge) return;

    try {
      await UserBadge.create({ userId, badgeId: badge._id });
    } catch (err) {
      // Duplicate badge assignment ignored due to unique index
    }
  }

  async seedBadges() {
    const defaultBadges = [
      { name: 'Certification Milestone', description: 'Awarded for your first formal certification.', icon: 'award', type: 'milestone' },
      { name: 'Perfect Accuracy', description: 'Achieved a score of 100% on any assessment.', icon: 'star', type: 'score' },
      { name: 'Consistent Learner', description: 'Completed 5 or more curriculum modules.', icon: 'flame', type: 'streak' },
      { name: 'Founder of the Month', description: 'Ranked #1 on the global leaderboard.', icon: 'crown', type: 'milestone' }
    ];

    for (const b of defaultBadges) {
      await Badge.updateOne({ name: b.name }, { $set: b }, { upsert: true });
    }
  }
}

module.exports = new AchievementsService();
