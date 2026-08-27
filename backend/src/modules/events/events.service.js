const mongoose = require('mongoose');
const { Event } = require('../../models/Event');
const { EventRegistration } = require('../../models/EventRegistration');
const { User } = require('../users/user.model');
const { ApiError } = require('../../utils/apiError');
const { cacheGet, cacheSet, cacheDel, cacheGetOrSet, cacheFlushPattern } = require('../../infrastructure/cache/redis');

// ── Cache key helpers ─────────────────────────────────────────────────────────
// Single event: keyed by slug (canonical) so slug and _id lookups share one entry.
// A secondary _id → slug pointer lets us look up the canonical key by _id alone.
const eventCacheKey   = (slug, userId) => `event:slug:${slug}:${userId || 'anon'}`;
const eventIdPtrKey   = (id)           => `event:idptr:${id}`;   // stores the slug
const EVENT_TTL       = 600;  // 10 minutes - single event (populated, heavy)
const LIST_TTL        = 300;  // 5 minutes  - lists

function buildEventLookup(idOrSlug) {
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug;
  return isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
}

// Populate options reused across queries
const PARTNER_FIELDS  = 'name logo website';
const PARTNER_DETAIL  = 'name logo website description type';

async function listEvents({ page = 1, limit = 20, category, status = 'upcoming', sort = 'date', userId = null }) {
  const query = {};
  if (category) query.category = category;
  if (status) {
    const statuses = status.split(',').map(s => s.trim());
    query.status = { $in: statuses };
  }

  // Cache key encodes every query dimension so different filters get separate entries.
  // userId is excluded - the list never contains sensitive per-user data (meetingLink
  // is stripped inside the loop). Registration flags are added afterwards.
  const cacheKey = `events:list:${JSON.stringify({ category, status, sort, page, limit })}`;

  const fetch = async () => {
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'fullName')
      .populate('organizedBy', PARTNER_FIELDS)
      .populate('supportingPartners', PARTNER_FIELDS)
      .populate('academicPartners', PARTNER_FIELDS)
      .populate('sponsors', PARTNER_FIELDS)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Strip meetingLink before caching - we add per-user registration flag below
    events.forEach(ev => { delete ev.meetingLink; });

    return {
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  };

  const result = await cacheGetOrSet(cacheKey, LIST_TTL, fetch);

  // Overlay per-user registration flag after cache retrieval (never cached)
  if (userId) {
    result.events = result.events.map(ev => ({
      ...ev,
      isRegistered: !!(ev.registrations || []).some(r => r.toString() === userId.toString()),
    }));
  } else {
    result.events = result.events.map(ev => ({ ...ev, isRegistered: false }));
  }

  return result;
}

async function getEventById(id, userId = null) {
  // ── Resolve slug vs ObjectId ──────────────────────────────────────────
  // The `id` param can be either a MongoDB ObjectId string or a slug.
  // We normalise to the event's slug as the canonical cache key so both
  // /events/<slug> and internal _id lookups share the same Redis entry.
  const isObjectId = mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

  // For ObjectId lookups, try the id→slug pointer first to avoid a DB hit
  let slug = null;
  if (isObjectId) {
    slug = await cacheGet(eventIdPtrKey(id));
  }

  // Build the canonical cache key once we know the slug (may still be null)
  const canonicalKey = slug
    ? eventCacheKey(slug, userId)
    : `event:id:${id}:${userId || 'anon'}`;

  // ── Try Redis first ───────────────────────────────────────────────────
  const cached = await cacheGet(canonicalKey);
  if (cached) return cached;

  // ── Cache miss - hit the database ─────────────────────────────────────
  const query = isObjectId ? { _id: id } : { slug: id };
  const event = await Event.findOne(query)
    .select(userId ? {} : '-registrations')
    .populate('createdBy', 'fullName')
    .populate('organizedBy', PARTNER_DETAIL)
    .populate('supportingPartners', PARTNER_DETAIL)
    .populate('academicPartners', PARTNER_DETAIL)
    .populate('sponsors', PARTNER_DETAIL);

  if (!event) throw new ApiError(404, 'Event not found');

  const eventObj = event.toObject();

  // Per-user personalisation (never cached - applied after fetch)
  const isRegistered = userId && event.registrations.some(r => r.toString() === userId.toString());
  eventObj.isRegistered = !!isRegistered;
  if (!isRegistered) delete eventObj.meetingLink;

  // L3 fix: strip full coupon details from the public response.
  // The frontend only needs to know IF coupons exist (boolean) to show the input.
  // Exposing codes lets anyone enumerate valid codes by inspecting network traffic.
  if (eventObj.coupons?.length) {
    eventObj.hasCoupons = true;
    // Keep applicableTickets so the UI knows which tickets have coupons,
    // but strip code, discountValue, maxUses, usedCount - those are server-side only.
    eventObj.couponTickets = [
      ...new Set(
        eventObj.coupons.flatMap(c =>
          c.isActive !== false
            ? (c.applicableTickets.length > 0 ? c.applicableTickets : ['__all__'])
            : []
        )
      ),
    ];
  } else {
    eventObj.hasCoupons = false;
    eventObj.couponTickets = [];
  }
  delete eventObj.coupons; // never send coupon codes to the public

  // ── Write to Redis ─────────────────────────────────────────────────────
  // Cache the populated event under its slug-based key.
  // Also store the _id → slug pointer so future ObjectId lookups are fast.
  if (eventObj.slug) {
    const slugKey = eventCacheKey(eventObj.slug, userId);
    await cacheSet(slugKey, eventObj, EVENT_TTL);
    // If we looked up by _id, store the pointer for next time
    if (isObjectId && eventObj.slug !== id) {
      await cacheSet(eventIdPtrKey(id), eventObj.slug, EVENT_TTL * 2);
    }
  } else {
    // No slug yet - cache under the id-based key
    await cacheSet(canonicalKey, eventObj, EVENT_TTL);
  }

  return eventObj;
}

/**
 * Invalidate all Redis entries for an event.
 * Call on any write that changes event data (update, register, unregister).
 */
async function invalidateEventCache(eventId, slug = null) {
  // Flush all per-user variants for this event
  if (slug) {
    await cacheFlushPattern(`event:slug:${slug}:*`);
  }
  await cacheFlushPattern(`event:id:${eventId}:*`);
  await cacheDel(eventIdPtrKey(eventId));
  // Also flush list/featured caches since counts may have changed
  await cacheFlushPattern('events:list:*');
  await cacheDel('events:featured');
}

async function getFeaturedEvents(limit = 6) {
  return cacheGetOrSet('events:featured', LIST_TTL, () =>
    Event.find({ status: { $in: ['upcoming', 'live'] } })
      .sort('-createdAt')
      .limit(limit)
      .populate('createdBy', 'fullName')
      .populate('organizedBy', PARTNER_FIELDS)
      .lean()
  );
}

async function registerForEvent(eventId, userId, ticketInfo = {}) {
  const { ticketTypeName, ticketPrice = 0, couponUsed = '' } = ticketInfo;
  const resolvedTicketName  = ticketTypeName || 'General';
  const resolvedTicketPrice = ticketPrice;

  // ── Step 1: look up the event and find the ticket index (needed for atomic update) ──
  const event = await Event.findById(eventId).lean();
  if (!event) throw new ApiError(404, 'Event not found');

  // ── Step 2: build one atomic update that enforces ALL constraints at once ──
  // C2 fix: $addToSet prevents duplicates atomically
  // C3 fix: quota is enforced inside the filter - if quota is reached the update returns null

  let ticketIdx = -1;
  const updateFilter = { _id: eventId };
  const updateOp     = {};

  if (ticketTypeName && event.ticketTypes?.length) {
    ticketIdx = event.ticketTypes.findIndex(
      t => t.name === ticketTypeName && t.isActive !== false
    );
    if (ticketIdx === -1) {
      throw new ApiError(400, `Ticket type "${ticketTypeName}" is not available`);
    }
    const ticket = event.ticketTypes[ticketIdx];

    if (ticket.quota > 0) {
      // Filter ensures sold < quota at write time - no TOCTOU gap
      updateFilter[`ticketTypes.${ticketIdx}.sold`] = { $lt: ticket.quota };
    }
    // Increment sold atomically in the same operation
    updateOp.$inc = { [`ticketTypes.${ticketIdx}.sold`]: 1 };
  }

  // maxAttendees cap enforced in filter
  if (event.maxAttendees > 0) {
    updateFilter[`$expr`] = {
      $lt: [{ $size: '$registrations' }, event.maxAttendees],
    };
  }

  // C2 fix: $addToSet is idempotent - silently no-ops if userId already present,
  // but we detect it below via the modifiedCount check
  updateOp.$addToSet = { registrations: userId };

  const result = await Event.updateOne(updateFilter, updateOp);

  if (result.matchedCount === 0) {
    // Filter didn't match - either quota full, maxAttendees full, or event not found
    // Re-read to give a specific error message
    const fresh = await Event.findById(eventId).lean();
    if (!fresh) throw new ApiError(404, 'Event not found');
    if (event.maxAttendees > 0 && fresh.registrations.length >= event.maxAttendees) {
      throw new ApiError(400, 'Event is full');
    }
    if (ticketIdx !== -1) {
      const t = fresh.ticketTypes[ticketIdx];
      if (t && t.quota > 0 && t.sold >= t.quota) {
        throw new ApiError(400, `Ticket type "${ticketTypeName}" is sold out`);
      }
    }
    throw new ApiError(400, 'Could not complete registration');
  }

  if (result.modifiedCount === 0) {
    // $addToSet was a no-op - userId was already in registrations
    throw new ApiError(400, 'Already registered for this event');
  }

  // ── Step 3: create the EventRegistration record (non-blocking) ──
  try {
    const user = await User.findById(userId).select('fullName email phoneNumber');
    if (user) {
      await EventRegistration.create({
        event: eventId,
        user: userId,
        fullName: user.fullName || 'Unknown User',
        email: user.email || 'unknown@user.com',
        phoneNumber: user.phoneNumber || '',
        paymentStatus: event.isPaid ? 'Completed' : 'Free',
        ticketType: resolvedTicketName,
        ticketTypeName: resolvedTicketName,
        ticketPrice: resolvedTicketPrice,
        couponUsed,
        attendanceStatus: 'Registered',
      });
    }
  } catch (err) {
    console.error('Failed to create EventRegistration document:', err.message);
    // Non-blocking - registrations array is the source of truth
  }

  // ── Step 4: invalidate caches ──
  await invalidateEventCache(String(event._id), event.slug || null);

  return { message: 'Successfully registered for event' };
}

async function registerGuestForEvent(eventId, guestInfo = {}, ticketInfo = {}) {
  const { fullName, email, phoneNumber } = guestInfo || {};
  if (!fullName?.trim() || !email?.trim() || !phoneNumber?.trim()) {
    throw new ApiError(400, 'Name, email, and mobile number are required');
  }

  const event = await Event.findOne(buildEventLookup(eventId)).lean();
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.registrationType !== 'guest') throw new ApiError(401, 'Login is required to register for this event');

  const isPaidEvent = event.isPaid || event.ticketTypes?.some(t => t.isActive !== false && t.price > 0);
  const ticketPrice = ticketInfo.ticketPrice || 0;
  if (isPaidEvent && !ticketInfo.fromVerifiedPayment) {
    throw new ApiError(400, 'Payment is required to register for this event');
  }

  const eventObjectId = event._id;
  const existing = await EventRegistration.findOne({ event: eventObjectId, email: email.trim().toLowerCase(), attendanceStatus: { $ne: 'Cancelled' } }).lean();
  if (existing) throw new ApiError(400, 'This email is already registered for the event');

  const updateFilter = { _id: eventObjectId };
  const updateOp = { $inc: { guestRegistrations: 1 } };
  let ticketIdx = -1;
  if (ticketInfo.ticketTypeName && event.ticketTypes?.length) {
    ticketIdx = event.ticketTypes.findIndex(t => t.name === ticketInfo.ticketTypeName && t.isActive !== false);
    if (ticketIdx === -1) throw new ApiError(400, 'Selected ticket type is not available');
    const ticket = event.ticketTypes[ticketIdx];
    if (ticket.quota > 0) updateFilter[`ticketTypes.${ticketIdx}.sold`] = { $lt: ticket.quota };
    updateOp.$inc[`ticketTypes.${ticketIdx}.sold`] = 1;
  }
  if (event.maxAttendees > 0) {
    updateFilter.$expr = { $lt: [{ $add: [{ $size: '$registrations' }, '$guestRegistrations'] }, event.maxAttendees] };
  }

  const result = await Event.updateOne(updateFilter, updateOp);
  if (result.matchedCount === 0) throw new ApiError(400, 'Event or selected ticket is full');

  await EventRegistration.create({
    event: eventObjectId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phoneNumber: phoneNumber.trim(),
    paymentStatus: ticketPrice > 0 ? 'Completed' : 'Free',
    ticketType: ticketInfo.ticketTypeName || 'General',
    ticketTypeName: ticketInfo.ticketTypeName || 'General',
    ticketPrice,
    couponUsed: ticketInfo.couponUsed || '',
    attendanceStatus: 'Registered',
  });
  await invalidateEventCache(String(event._id), event.slug || null);
  return { message: 'Successfully registered for event' };
}

async function getGuestRegistrationStatus(idOrSlug, email) {
  if (!email?.trim()) throw new ApiError(400, 'Email is required');

  const event = await Event.findOne(buildEventLookup(idOrSlug))
    .select('_id registrationType')
    .lean();
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.registrationType !== 'guest') {
    throw new ApiError(400, 'Guest registration status is not available for this event');
  }

  const registration = await EventRegistration.findOne({
    event: event._id,
    email: email.trim().toLowerCase(),
    attendanceStatus: { $ne: 'Cancelled' },
  })
    .select('_id')
    .lean();

  return { isRegistered: !!registration };
}

async function unregisterFromEvent(eventId, userId) {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const index = event.registrations.indexOf(userId);
  if (index === -1) {
    throw new ApiError(400, 'Not registered for this event');
  }

  event.registrations.splice(index, 1);
  await event.save();

  await invalidateEventCache(String(event._id), event.slug || null);

  return { message: 'Successfully unregistered from event' };
}

async function getUserEvents(userId) {
  return Event.find({
    registrations: userId,
    status: { $in: ['upcoming', 'live'] },
  })
    .sort('date')
    .populate('createdBy', 'fullName')
    .lean();
}

module.exports = {
  listEvents,
  getEventById,
  getFeaturedEvents,
  registerForEvent,
  registerGuestForEvent,
  getGuestRegistrationStatus,
  unregisterFromEvent,
  getUserEvents,
  invalidateEventCache,
};
