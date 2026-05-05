const express = require('express');
const controller = require('./assessments.controller');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');

const router = express.Router();

/**
 * Assessment Management
 */
router.get('/', authRequired, controller.getAssessments);
router.post('/', authRequired, requireRole('admin', 'instructor'), controller.createAssessment);
router.get('/:id', authRequired, controller.getAssessmentById);
router.patch('/:id', authRequired, requireRole('admin', 'instructor'), controller.updateAssessment);
router.delete('/:id', authRequired, requireRole('admin', 'instructor'), controller.deleteAssessment);

/**
 * Quiz/Exam Attempts
 */
router.post('/:id/attempt', authRequired, controller.startAttempt);
router.post('/:id/submit', authRequired, controller.submitQuiz);
router.post('/:id/start', authRequired, controller.startAttempt); // Alias for exams

/**
 * Assignment Submissions
 */
router.post('/:id/assignment-submit', authRequired, controller.submitAssignment);
router.patch('/submissions/:id/grade', authRequired, requireRole('admin', 'instructor'), controller.gradeSubmission);

/**
 * Results
 */
router.get('/results/all', authRequired, controller.getResults);
router.get('/results/user/:userId', authRequired, controller.getResults);
router.get('/results/assessment/:assessmentId', authRequired, controller.getResults);

module.exports = { assessmentsRouter: router };
