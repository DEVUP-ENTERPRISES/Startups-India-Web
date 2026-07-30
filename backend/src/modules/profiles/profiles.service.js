const { Mentor } = require('./mentor.model');
const { Investor } = require('./investor.model');
const { Profile } = require('./profile.model');

async function listMentors() {
  return Mentor.find({ status: 'approved', isActive: true }).lean();
}

async function createMentor(input) {
  return Mentor.create(input);
}

async function listInvestors() {
  return Investor.find({ status: 'approved', isVerified: true }).lean();
}

async function createInvestor(input) {
  return Investor.create(input);
}

async function updateMentorStatus(id, status) {
  return Mentor.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
}

async function updateInvestorStatus(id, input) {
  return Investor.findByIdAndUpdate(
    id,
    {
      $set: {
        status: input.status,
        isVerified: input.isVerified ?? input.status === 'approved',
        approvedAt: input.status === 'approved' ? new Date() : null,
      },
    },
    { new: true }
  ).lean();
}

async function upsertUserProfile(userId, role, dynamicProfileData, status = 'approved') {
  return Profile.findOneAndUpdate(
    { userId },
    {
      $set: {
        userId,
        role,
        dynamicProfileData,
        profileCompleted: true,
        status,
      },
    },
    { upsert: true, new: true, runValidators: true }
  ).lean();
}

async function getUserProfile(userId) {
  return Profile.findOne({ userId }).lean();
}

module.exports = {
  listMentors,
  createMentor,
  listInvestors,
  createInvestor,
  updateMentorStatus,
  updateInvestorStatus,
  upsertUserProfile,
  getUserProfile,
};

