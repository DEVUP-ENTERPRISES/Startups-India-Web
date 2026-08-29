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
    userId: req.user?.userId
  });
  res.json({ success: true, data });
}

async function getEvent(req, res) {
  // Accept both slug and ObjectId - service resolves either
  const id = req.params.slugOrId || req.params.id;
  const event = await eventsService.getEventById(id, req.user?.userId);
  res.json({ success: true, data: event });
}

async function getFeaturedEvents(req, res) {
  const events = await eventsService.getFeaturedEvents();
  res.json({ success: true, data: events });
}

async function registerForEvent(req, res) {
  const { ticketTypeName, couponCode, guest } = req.body || {};
  if (!req.user?.userId) {
    const data = await eventsService.registerGuestForEvent(req.params.id, guest, {
      ticketTypeName: ticketTypeName || null,
      ticketPrice: 0,
      couponUsed: couponCode || '',
    });
    return res.json({ success: true, data });
  }
  const data = await eventsService.registerForEvent(req.params.id, req.user.userId, {
    ticketTypeName: ticketTypeName || null,
    ticketPrice: 0, // free path - no payment
    couponUsed: couponCode || '',
  });
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

async function getGuestRegistrationStatus(req, res) {
  const { email } = req.body || {};
  const data = await eventsService.getGuestRegistrationStatus(req.params.id, email);
  res.json({ success: true, data });
}

module.exports = {
  listEvents: asyncHandler(listEvents),
  getEvent: asyncHandler(getEvent),
  getFeaturedEvents: asyncHandler(getFeaturedEvents),
  registerForEvent: asyncHandler(registerForEvent),
  unregisterFromEvent: asyncHandler(unregisterFromEvent),
  getUserEvents: asyncHandler(getUserEvents),
  getGuestRegistrationStatus: asyncHandler(getGuestRegistrationStatus),
};
