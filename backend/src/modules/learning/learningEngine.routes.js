const express = require('express');
const { authRequired } = require('../../middlewares/authMiddleware');
const { enrollmentRequired } = require('../../middlewares/enrollmentMiddleware');
const { asyncHandler } = require('../../utils/asyncHandler');
const ctrl = require('./learningEngine.controller');

const router = express.Router();

// GET /api/v1/learn/:courseId - Main course dashboard (enrollment + cohort check)
router.get('/:courseId', authRequired, asyncHandler(ctrl.getCourseDashboard));

// GET /api/v1/learn/:courseId/lesson/:lessonId - Lesson detail with signed video URL
router.get(
  '/:courseId/lesson/:lessonId',
  authRequired,
  enrollmentRequired,
  asyncHandler(ctrl.getLessonDetail)
);

// POST /api/v1/learn/:courseId/lesson/:lessonId/complete - Mark lesson as complete
router.post(
  '/:courseId/lesson/:lessonId/complete',
  authRequired,
  enrollmentRequired,
  asyncHandler(ctrl.markLessonComplete)
);

// GET /api/v1/learn/:courseId/module/:moduleId/quiz - Get module quiz (no answers)
router.get(
  '/:courseId/module/:moduleId/quiz',
  authRequired,
  enrollmentRequired,
  asyncHandler(ctrl.getModuleQuiz)
);

// POST /api/v1/learn/:courseId/module/:moduleId/quiz - Submit module quiz
router.post(
  '/:courseId/module/:moduleId/quiz',
  authRequired,
  enrollmentRequired,
  asyncHandler(ctrl.submitModuleQuiz)
);

module.exports = { learnRouter: router };
