const { asyncHandler } = require('../../utils/asyncHandler');
const { authRequired } = require('../../middlewares/authMiddleware');
const { cacheMiddleware } = require('../../middlewares/cache.middleware');
const eventsService = require('./events.service');

async function listEvents(req, res) {
  const { page, limit, category, status, sort } = req.query;
  const data = await eventsService.listEvents({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    category,
    status: status || 'upcoming',
    sort: sort || 'date',
  });
  res.json({ success: true, data });
}

async function getEvent(req, res) {
  const event = await eventsService.getEventById(req.params.id);
  res.json({ success: true, data: event });
}

async function getFeaturedEvents(req, res) {
  const events = await eventsService.getFeaturedEvents();
  res.json({ success: true, data: events });
}

async function registerForEvent(req, res) {
  const data = await eventsService.registerForEvent(req.params.id, req.user.userId);
  res.json({ success: true, data });
}

async function unregisterFromEvent(req, res) {
  const data = await eventsService.unregisterFromEvent(req.params.id, req.user.userId);
  res.json({ success: true, data });
}

async function getUserEvents(req, res) {
  const events = await eventsService.getUserEvents(req.user.userId);
  res.json({ success: true, data: events });
}

module.exports = {
  listEvents: asyncHandler(listEvents),
  getEvent: asyncHandler(getEvent),
  getFeaturedEvents: asyncHandler(getFeaturedEvents),
  registerForEvent: asyncHandler(registerForEvent),
  unregisterFromEvent: asyncHandler(unregisterFromEvent),
  getUserEvents: asyncHandler(getUserEvents),
};
