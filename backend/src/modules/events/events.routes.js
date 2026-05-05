const express = require('express');
const { asyncHandler } = require('../../utils/asyncHandler');
const { authRequired, optionalAuth } = require('../../middlewares/authMiddleware');
const { cacheMiddleware } = require('../../middlewares/cache.middleware');
const controller = require('./events.controller');

const router = express.Router();

// GET /api/v1/events - List all events
router.get('/', cacheMiddleware(req => `events:all:${JSON.stringify(req.query)}`, 300), asyncHandler(controller.listEvents));

// GET /api/v1/events/featured - Get featured events
router.get(
  '/featured',
  cacheMiddleware('events:featured', 300),
  asyncHandler(controller.getFeaturedEvents)
);

// GET /api/v1/events/my-events - Get user's registered events (requires auth)
router.get('/my-events', authRequired, asyncHandler(controller.getUserEvents));

// POST /api/v1/events/:id/register - Register for an event (requires auth)
router.post('/:id/register', authRequired, asyncHandler(controller.registerForEvent));

// DELETE /api/v1/events/:id/register - Unregister from an event (requires auth)
router.delete('/:id/register', authRequired, asyncHandler(controller.unregisterFromEvent));

// GET /api/v1/events/:id - Get single event
router.get(
  '/:id',
  optionalAuth,
  cacheMiddleware(req => `event:${req.params.id}:${req.user?.userId || 'anon'}`, 600),
  asyncHandler(controller.getEvent)
);

module.exports = { eventsRouter: router };
