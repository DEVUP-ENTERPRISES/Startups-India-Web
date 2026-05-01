const achievementsService = require('./achievements.service');
const { asyncHandler } = require('../../utils/asyncHandler');

exports.getCertificates = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = await achievementsService.getCertificates(userId);
  res.json({ success: true, data });
});

exports.getBadges = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  await achievementsService.checkAndAssignBadges(userId); // Auto-check on view
  const data = await achievementsService.getBadges(userId);
  res.json({ success: true, data });
});

exports.getAllBadges = asyncHandler(async (req, res) => {
  const data = await achievementsService.getAllBadges();
  res.json({ success: true, data });
});

exports.getLeaderboard = asyncHandler(async (req, res) => {
  const { scope } = req.params;
  const data = await achievementsService.getLeaderboard(scope);
  res.json({ success: true, data });
});

exports.verifyCertificate = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { Certificate } = require('../certificates/certificate.model');
  const cert = await Certificate.findOne({ certificateNumber: code }).populate('userId', 'fullName');
  
  if (!cert) {
    return res.status(404).json({ success: false, message: 'Invalid certificate code' });
  }

  res.json({ success: true, data: cert });
});

exports.seedAchievements = asyncHandler(async (req, res) => {
  await achievementsService.seedBadges();
  res.json({ success: true, message: 'Achievements seeded successfully' });
});
