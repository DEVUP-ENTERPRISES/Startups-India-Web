const express = require('express');
const controller = require('./achievements.controller');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/certificates', authRequired, controller.getCertificates);
router.get('/certificates/verify/:code', controller.verifyCertificate);

router.get('/badges', authRequired, controller.getBadges);
router.get('/badges/catalog', authRequired, controller.getAllBadges);
router.get('/badges/:userId', authRequired, controller.getBadges);

router.get('/leaderboard', authRequired, controller.getLeaderboard);
router.get('/leaderboard/:scope', authRequired, controller.getLeaderboard);

router.post('/seed', authRequired, requireRole('admin'), controller.seedAchievements);

module.exports = { achievementsRouter: router };
