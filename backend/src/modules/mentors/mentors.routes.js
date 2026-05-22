const express = require('express');
const router = express.Router();
const mentorsController = require('./mentors.controller');
const { authRequired } = require('../../middlewares/authMiddleware');

// Public routes
router.post('/apply', mentorsController.applyMentor);

// Protected routes
router.post('/find', authRequired, mentorsController.findMentor);

// Admin routes
router.get('/applications', authRequired, mentorsController.getApplications);
router.get('/requests', authRequired, mentorsController.getRequests);

// Keep existing route for backward compatibility if needed
router.post('/welcome', mentorsController.sendWelcomeEmail);

module.exports = router;
