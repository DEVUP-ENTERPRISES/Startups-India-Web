const express = require('express');
const mongoose = require('mongoose');
const { asyncHandler } = require('../../utils/asyncHandler');
const { authRequired, optionalAuth } = require('../../middlewares/authMiddleware');
const { cacheMiddleware } = require('../../middlewares/cache.middleware');
const { redisRateLimit } = require('../../middlewares/rateLimit.middleware');
const controller = require('./events.controller');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// H1 fix: ALL static routes must be declared BEFORE /:slugOrId to prevent
// Express matching e.g. GET /partners or GET /featured as event slug lookups.
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/events - List all events
router.get('/', cacheMiddleware(req => `events:all:${JSON.stringify(req.query)}`, 300), asyncHandler(controller.listEvents));

// GET /api/v1/events/featured - Get featured events
router.get('/featured', cacheMiddleware('events:featured', 300), asyncHandler(controller.getFeaturedEvents));

// GET /api/v1/events/my-events - Get user's registered events (requires auth)
router.get('/my-events', authRequired, asyncHandler(controller.getUserEvents));

// GET /api/v1/events/partners - Public list of event partner library
router.get('/partners', asyncHandler(async (req, res) => {
  const { EventPartner } = require('../../models/EventPartner');
  const { type } = req.query;
  const query = { isActive: true };
  if (type) query.type = type;
  const data = await EventPartner.find(query).sort({ name: 1 }).lean();
  res.json({ success: true, data });
}));

// POST /api/v1/events/:id/register
router.post('/:id/register', optionalAuth, asyncHandler(controller.registerForEvent));

// POST /api/v1/events/:id/guest-status - check if a guest email is registered (guest events only)
const guestStatusRateLimit = redisRateLimit({
  windowSeconds: 15 * 60,
  max: 20,
  prefix: 'rl:guest-status',
  keyGenerator: req => `${req.ip}:${req.params.id}`,
});

router.post('/:id/guest-status', guestStatusRateLimit, asyncHandler(controller.getGuestRegistrationStatus));

// DELETE /api/v1/events/:id/register
router.delete('/:id/register', authRequired, asyncHandler(controller.unregisterFromEvent));

// POST /api/v1/events/:id/validate-coupon
// H5 fix: resolves slug OR ObjectId for event lookup.
// M1 fix: returns a single generic message for invalid/expired/wrong-ticket - prevents enumeration.
// M2 fix: rate-limited per user - 10 attempts per 15 minutes.
const couponRateLimit = redisRateLimit({
  windowSeconds: 15 * 60,
  max: 10,
  prefix: 'rl:coupon',
  keyGenerator: req => `${req.user?.userId || req.ip}:${req.params.id}`,
});

router.post('/:id/validate-coupon', optionalAuth, couponRateLimit, asyncHandler(async (req, res) => {
  const { Event } = require('../../models/Event');
  const { code, ticketTypeName } = req.body;

  if (!code || !ticketTypeName) {
    return res.status(400).json({ success: false, message: 'code and ticketTypeName are required' });
  }

  // H5 fix: accept slug or ObjectId
  const paramId    = req.params.id;
  const isObjectId = mongoose.Types.ObjectId.isValid(paramId) && String(new mongoose.Types.ObjectId(paramId)) === paramId;
  const query      = isObjectId ? { _id: paramId } : { slug: paramId };
  const event      = await Event.findOne(query).lean();

  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

  const ticket = (event.ticketTypes || []).find(
    t => t.name === ticketTypeName && t.isActive !== false
  );
  if (!ticket) {
    // M1: generic message - don't reveal which ticket names exist
    return res.json({ success: true, valid: false, message: 'Invalid or expired coupon code.' });
  }

  // Effective base price (after early bird)
  let basePrice = ticket.price;
  const now = new Date();
  if (ticket.earlyBirdPrice > 0 && ticket.earlyBirdDeadline && now <= new Date(ticket.earlyBirdDeadline)) {
    basePrice = ticket.earlyBirdPrice;
  }

  // Find coupon and validate all conditions
  const coupon = (event.coupons || []).find(
    c => c.isActive !== false && c.code.toUpperCase() === code.toUpperCase()
  );

  // M1 fix: collapse all failure reasons into one generic message to prevent
  // attackers from determining whether a code exists, which ticket it applies to,
  // whether it's exhausted, or whether it's date-gated.
  const INVALID_MSG = 'Invalid or expired coupon code.';

  if (!coupon) return res.json({ success: true, valid: false, message: INVALID_MSG });

  if (coupon.applicableTickets.length > 0 && !coupon.applicableTickets.includes(ticketTypeName)) {
    return res.json({ success: true, valid: false, message: INVALID_MSG });
  }

  if (coupon.maxUses > 0 && (coupon.usedCount || 0) >= coupon.maxUses) {
    return res.json({ success: true, valid: false, message: INVALID_MSG });
  }

  if (coupon.validFrom && now < new Date(coupon.validFrom)) {
    return res.json({ success: true, valid: false, message: INVALID_MSG });
  }

  if (coupon.validUntil && now > new Date(coupon.validUntil)) {
    return res.json({ success: true, valid: false, message: INVALID_MSG });
  }

  // Compute discount
  let discount = 0;
  if (coupon.discountType === 'percent') {
    discount = Math.round((basePrice * coupon.discountValue) / 100);
  } else {
    discount = coupon.discountValue;
  }
  const discountedPrice = Math.max(0, basePrice - discount);

  return res.json({
    success: true,
    valid: true,
    // Only surface the saving amount and final price - never expose code internals
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    originalPrice: basePrice,
    discountAmount: discount,
    discountedPrice,
    message: coupon.discountType === 'percent'
      ? `${coupon.discountValue}% off applied`
      : `₹${(discount / 100).toLocaleString('en-IN')} off applied`,
  });
}));

// GET /api/v1/events/:slugOrId - Get single event (slug or ObjectId)
// H1 fix: declared LAST so static routes above are never shadowed.
// Caching is handled inside eventsService.getEventById via Redis directly.
router.get('/:slugOrId', optionalAuth, asyncHandler(controller.getEvent));

module.exports = { eventsRouter: router };
