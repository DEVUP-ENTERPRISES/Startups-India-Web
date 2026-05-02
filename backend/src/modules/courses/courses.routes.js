const express = require('express');
const { asyncHandler } = require('../../utils/asyncHandler');
const { authRequired } = require('../../middlewares/authMiddleware');
const { cacheMiddleware } = require('../../middlewares/cache.middleware');
const controller = require('./courses.controller');

const router = express.Router();

// GET /api/v1/courses
router.get('/', asyncHandler(controller.listCourses));

// GET /api/v1/courses/wishlist
router.get('/wishlist', authRequired, asyncHandler(controller.getWishlist));

// POST /api/v1/courses/:courseId/wishlist
router.post('/:courseId/wishlist', authRequired, asyncHandler(controller.toggleWishlist));

// POST /api/v1/courses/:courseId/complete
router.post('/:courseId/complete', authRequired, asyncHandler(controller.completeCourse));

// Static routes MUST come before dynamic /:courseId
// GET /api/v1/courses/modules/:moduleId/lessons
router.get(
  '/modules/:moduleId/lessons',
  cacheMiddleware(req => `module:${req.params.moduleId}:lessons`, 300),
  asyncHandler(controller.listLessons)
);

// POST /api/v1/courses/progress (track video progress)
router.post('/progress', authRequired, asyncHandler(controller.trackProgress));

// POST /api/v1/courses/quiz (submit quiz)
router.post('/quiz', authRequired, asyncHandler(controller.submitQuiz));

// GET /api/v1/courses/wishlist
router.get('/wishlist', authRequired, asyncHandler(controller.getWishlist));

// POST /api/v1/courses/:courseId/wishlist
router.post('/:courseId/wishlist', authRequired, asyncHandler(controller.toggleWishlist));

// POST /api/v1/courses/:courseId/complete
router.post('/:courseId/complete', authRequired, asyncHandler(controller.completeCourse));

// Dynamic routes AFTER static ones
// GET /api/v1/courses/:courseId
router.get(
  '/:courseId',
  cacheMiddleware(req => `course:${req.params.courseId}`, 600),
  asyncHandler(controller.getCourseById)
);

// GET /api/v1/courses/:courseId/modules
router.get(
  '/:courseId/modules',
  cacheMiddleware(req => `course:${req.params.courseId}:modules`, 300),
  asyncHandler(controller.listModules)
);

// GET /api/v1/courses/:courseId/materials
router.get('/:courseId/materials', authRequired, asyncHandler(controller.listCourseMaterials));

module.exports = { coursesRouter: router };
