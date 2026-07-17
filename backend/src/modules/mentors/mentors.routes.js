const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const mentorsController = require('./mentors.controller');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');

// Public + unauthenticated, and it mints S3 upload URLs — cap it so it can't be
// turned into a bucket-spamming faucet.
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many upload requests, please try again later.' },
});

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────
router.post('/apply', mentorsController.applyMentor);
router.post('/application-photo-url', uploadLimiter, mentorsController.getApplicationPhotoUploadUrl);
router.post('/welcome', mentorsController.sendWelcomeEmail);

// ─── PROTECTED ROUTES (any logged-in user) ──────────────────────────
router.post('/find', authRequired, mentorsController.findMentor);

// ─── ADMIN ROUTES ───────────────────────────────────────────────────
router.get('/applications', authRequired, requireRole('admin'), mentorsController.getApplications);
router.get('/applications/:id', authRequired, requireRole('admin'), mentorsController.getApplicationDetails);
router.patch('/applications/:id/approve', authRequired, requireRole('admin'), mentorsController.approveApplication);
router.patch('/applications/:id/reject', authRequired, requireRole('admin'), mentorsController.rejectApplication);
router.delete('/applications/:id', authRequired, requireRole('admin'), mentorsController.deleteApplication);
router.get('/requests', authRequired, requireRole('admin'), mentorsController.getRequests);

// ─── MENTOR SELF-SERVICE ROUTES ─────────────────────────────────────
router.get('/me/dashboard', authRequired, requireRole('mentor', 'admin'), mentorsController.getMentorDashboard);
router.get('/me/profile', authRequired, requireRole('mentor', 'admin'), mentorsController.getMentorProfile);
router.patch('/me/profile', authRequired, requireRole('mentor', 'admin'), mentorsController.updateMentorProfile);
router.get('/me/requests', authRequired, requireRole('mentor', 'admin'), mentorsController.getMentorRequests);

module.exports = router;
