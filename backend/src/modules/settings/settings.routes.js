const express = require('express');
const controller = require('./settings.controller');
const { authRequired } = require('../../middlewares/authMiddleware');

const router = express.Router();

/* ── Profile ─────────────────────────────────── */
router.get('/profile', authRequired, controller.getProfile);
router.patch('/profile', authRequired, controller.updateProfile);

/* ── Account / Password ──────────────────────── */
router.patch('/account/password', authRequired, controller.updatePassword);
router.delete('/account', authRequired, controller.deleteAccount);

/* ── Notifications ───────────────────────────── */
router.get('/notifications', authRequired, controller.getNotifications);
router.patch('/notifications/preferences', authRequired, controller.updateNotifications);

/* ── Privacy ─────────────────────────────────── */
router.get('/privacy', authRequired, controller.getPrivacy);
router.patch('/privacy', authRequired, controller.updatePrivacy);

/* ── Per-router error handler ────────────────── */
router.use(controller.settingsErrorHandler);

module.exports = { settingsRouter: router };
