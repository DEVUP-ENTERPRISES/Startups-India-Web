const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const investorsController = require('./investors.controller');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');

// Public + unauthenticated photo presign — capped so it can't spam S3.
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many upload requests, please try again later.' },
});

// ─── PUBLIC ─────────────────────────────────────────────────────────
router.post('/apply', investorsController.applyInvestor);
router.post('/application-photo-url', uploadLimiter, investorsController.getApplicationPhotoUploadUrl);

// ─── PROTECTED (any logged-in user) ─────────────────────────────────
router.post('/request', authRequired, investorsController.submitRequest);
router.post('/explore', authRequired, investorsController.exploreRequest);

// ─── ADMIN ──────────────────────────────────────────────────────────
router.get('/applications', authRequired, requireRole('admin'), investorsController.getApplications);
router.patch('/applications/:id/approve', authRequired, requireRole('admin'), investorsController.approveApplication);
router.patch('/applications/:id/reject', authRequired, requireRole('admin'), investorsController.rejectApplication);
router.delete('/applications/:id', authRequired, requireRole('admin'), investorsController.deleteApplication);

// ─── INVESTOR SELF-SERVICE ──────────────────────────────────────────
router.get('/me/dashboard', authRequired, requireRole('investor', 'admin'), investorsController.getInvestorDashboard);
router.get('/me/profile', authRequired, requireRole('investor', 'admin'), investorsController.getInvestorProfile);
router.patch('/me/profile', authRequired, requireRole('investor', 'admin'), investorsController.updateInvestorProfile);

module.exports = router;
