const mongoose = require('mongoose');
const { Event } = require('../../models/Event');
const { EventRegistration } = require('../../models/EventRegistration');
const { User } = require('../users/user.model');
const { ApiError } = require('../../utils/apiError');
const { cacheGet, cacheSet, cacheDel, cacheGetOrSet, cacheFlushPattern } = require('../../infrastructure/cache/redis');
const { sendEmail } = require('../../utils/emailService');
const { getEventTicketEmailTemplate } = require('../../utils/emailTemplates');

const SITE_URL = process.env.FRONTEND_URL || 'https://www.startupsindia.in';

/**
 * Fire-and-forget confirmation/ticket email after a successful registration.
 * Best-effort - never blocks or fails the registration itself.
 */
function sendRegistrationConfirmation({ event, recipientName, recipientEmail, ticketTypeName, ticketPrice, ticketCode }) {
  if (!recipientEmail) return;
  try {
    const fmtDate = d => {
      try {
        const dt = d ? new Date(d) : null;
        if (!dt || Number.isNaN(dt.valueOf())) return '';
        return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch { return ''; }
    };
    const tpl = getEventTicketEmailTemplate({
      recipientName,
      eventTitle: event.title,
      ticketTypeName,
      ticketCode,
      amountPaidPaise: ticketPrice || 0,
      dateText: fmtDate(event.eventStartDate || event.date),
      timeText: event.time || '',
      venueText: event.venueName || event.city || event.fullAddress || '',
      modeText: event.mode || '',
      meetingLink: event.meetingLink || '',
      postRegistrationMessage: event.postRegistrationMessage || '',
      eventUrl: event.slug ? `${SITE_URL}/events/${event.slug}` : '',
    });
    // Do not await - best-effort; log failures only
    sendEmail({ to: recipientEmail, subject: tpl.subject, html: tpl.html, text: tpl.text })
      .catch(err => console.error(`Registration email failed for ${recipientEmail}:`, err.message));
  } catch (err) {
    console.error('Failed to build registration email:', err.message);
  }
}

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

/**
 * Server-side re-computation of a ticket's effective price (in paise) after
 * applying a coupon. Mirrors the discount logic in payments.createRazorpayOrder
 * so the free-registration path cannot be forged. Returns the base effective
 * price when the coupon is missing or invalid, or null if the ticket isn't found.
 */
function computeCouponEffectivePrice(event, ticketTypeName, couponCode) {
  // Resolve the ticket's base effective price (early-bird aware)
  let basePrice;
  if (ticketTypeName && event.ticketTypes?.length) {
    const ticket = event.ticketTypes.find(t => t.name === ticketTypeName && t.isActive !== false);
    if (!ticket) return null;
    basePrice = ticket.price;
    if (ticket.earlyBirdPrice > 0 && ticket.earlyBirdDeadline && new Date() <= new Date(ticket.earlyBirdDeadline)) {
      basePrice = ticket.earlyBirdPrice;
    }
  } else {
    basePrice = event.isPaid ? (event.price || 0) : 0;
  }

  if (!couponCode) return basePrice;

  const now = new Date();
  const coupon = (event.coupons || []).find(
    c =>
      c.isActive !== false &&
      c.code.toUpperCase() === String(couponCode).toUpperCase() &&
      (c.applicableTickets.length === 0 || c.applicableTickets.includes(ticketTypeName)) &&
      (c.maxUses === 0 || (c.usedCount || 0) < c.maxUses) &&
      (!c.validFrom || now >= new Date(c.validFrom)) &&
      (!c.validUntil || now <= new Date(c.validUntil))
  );
  if (!coupon) return basePrice;

  let discount = 0;
  if (coupon.discountType === 'percent') {
    discount = Math.round((basePrice * coupon.discountValue) / 100);
  } else {
    discount = coupon.discountValue; // flat paise
  }
  return Math.max(0, basePrice - discount);
}

// Populate options reused across queries
const PARTNER_FIELDS  = 'name logo website';
const PARTNER_DETAIL  = 'name logo website description type';

// Maps a populated partner subdoc down to only what the public UI renders.
function publicPartner(p) {
  if (!p) return null;
  return {
    _id: p._id,
    name: p.name,
    logo: p.logo || '',
    website: p.website || '',
    description: p.description || '',
  };
}

// Maps a ticket subdoc down to what the public UI needs.
// Strips internal fields: _id, sold, sortOrder, isActive, earlyBirdDeadline (raw).
function publicTicket(t) {
  const now = new Date();
  const isEarlyBird = t.earlyBirdPrice > 0 && t.earlyBirdDeadline && now <= new Date(t.earlyBirdDeadline);
  return {
    name: t.name,
    description: t.description || '',
    price: t.price,
    originalPrice: t.originalPrice || 0,
    // Only expose the effective early-bird price + whether it's active, not the deadline internals
    earlyBirdPrice: t.earlyBirdPrice || 0,
    earlyBirdDeadline: t.earlyBirdDeadline || null,
    // soldOut is a boolean the client needs; the raw sold count / quota stay server-side
    soldOut: t.quota > 0 && (t.sold || 0) >= t.quota,
  };
}

/**
 * Shapes a full event document into the PUBLIC payload sent to browsers.
 * Whitelists only the fields the event detail page renders - nothing internal
 * (createdBy, registrations, capacity config, __v, meetingLink for non-attendees).
 *
 * @param {object} ev        - plain event object (already .toObject())
 * @param {object} opts       - { isRegistered, hasCoupons, couponTickets }
 */
function toPublicEvent(ev, { isRegistered = false, hasCoupons = false, couponTickets = [] } = {}) {
  return {
    _id: ev._id,
    slug: ev.slug,
    title: ev.title,
    subtitle: ev.subtitle || '',
    description: ev.description || '',
    mode: ev.mode,
    type: ev.type,
    category: ev.category,

    // Schedule
    date: ev.date,
    endDate: ev.endDate || null,
    registrationStartDate: ev.registrationStartDate || null,
    registrationEndDate: ev.registrationEndDate || null,
    eventStartDate: ev.eventStartDate || null,
    eventEndDate: ev.eventEndDate || null,
    time: ev.time || '',
    duration: ev.duration || '',

    // Location (venue only relevant for offline; meetingLink handled below)
    venueName: ev.venueName || '',
    fullAddress: ev.fullAddress || '',
    city: ev.city || '',
    location: ev.location || '',
    locationUrl: ev.locationUrl || '',
    googleMapsLink: ev.googleMapsLink || '',

    // Media
    coverImage: ev.coverImage || '',
    images: ev.images || [],

    // Pricing (public-safe)
    isPaid: ev.isPaid,
    price: ev.price || 0,
    priceLabel: ev.priceLabel || '',
    ticketTypes: (ev.ticketTypes || []).filter(t => t.isActive !== false).map(publicTicket),

    // Coupons - boolean + which tickets, never the codes
    hasCoupons,
    couponTickets,

    // People & partners
    organizer: ev.organizer || '',
    organizedBy: (ev.organizedBy || []).map(publicPartner),
    supportingPartners: (ev.supportingPartners || []).map(publicPartner),
    academicPartners: (ev.academicPartners || []).map(publicPartner),
    sponsors: (ev.sponsors || []).map(publicPartner),
    chiefGuests: (ev.chiefGuests || []).map(publicPartner),
    specialGuests: (ev.specialGuests || []).map(publicPartner),
    speakers: ev.speakers || [],
    artists: ev.artists || [],

    // Content
    highlights: ev.highlights || [],
    outcomes: ev.outcomes || [],
    timeline: ev.timeline || [],
    tags: ev.tags || [],
    ageLimit: ev.ageLimit || '',
    language: ev.language || '',

    // Status
    status: ev.status,
    featured: ev.featured || false,
    registrationType: ev.registrationType || 'user',

    // Per-user
    isRegistered,
    // meetingLink + post-registration message only for registered attendees
    ...(isRegistered && ev.meetingLink ? { meetingLink: ev.meetingLink, meetingPlatform: ev.meetingPlatform } : {}),
    ...(isRegistered && ev.postRegistrationMessage ? { postRegistrationMessage: ev.postRegistrationMessage } : {}),
  };
}

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
      .populate('organizedBy', PARTNER_FIELDS)
      .populate('supportingPartners', PARTNER_FIELDS)
      .populate('academicPartners', PARTNER_FIELDS)
      .populate('sponsors', PARTNER_FIELDS)
      .populate('chiefGuests', PARTNER_FIELDS)
      .populate('specialGuests', PARTNER_FIELDS)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Cache only the public shape + a private registrations id list used
    // solely to compute the per-user isRegistered flag after retrieval.
    const shaped = events.map(ev => {
      const couponTickets = (ev.coupons || []).length
        ? [...new Set(ev.coupons.flatMap(c =>
            c.isActive !== false ? (c.applicableTickets.length > 0 ? c.applicableTickets : ['__all__']) : []))]
        : [];
      return {
        __regIds: (ev.registrations || []).map(r => r.toString()), // private, stripped before send
        ...toPublicEvent(ev, { isRegistered: false, hasCoupons: couponTickets.length > 0, couponTickets }),
      };
    });

    return {
      events: shaped,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  };

  const result = await cacheGetOrSet(cacheKey, LIST_TTL, fetch);

  // Overlay per-user registration flag, then strip the private __regIds helper.
  result.events = result.events.map(({ __regIds, ...ev }) => ({
    ...ev,
    isRegistered: userId ? (__regIds || []).includes(userId.toString()) : false,
  }));

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
    .populate('organizedBy', PARTNER_DETAIL)
    .populate('supportingPartners', PARTNER_DETAIL)
    .populate('academicPartners', PARTNER_DETAIL)
    .populate('sponsors', PARTNER_DETAIL)
    .populate('chiefGuests', PARTNER_DETAIL)
    .populate('specialGuests', PARTNER_DETAIL);

  if (!event) throw new ApiError(404, 'Event not found');

  const raw = event.toObject();

  // Per-user personalisation
  const isRegistered = userId && event.registrations.some(r => r.toString() === userId.toString());

  // Coupons: expose only whether they exist and which tickets they apply to.
  // Never send codes / discountValue / maxUses / usedCount to the public.
  let hasCoupons = false;
  let couponTickets = [];
  if (raw.coupons?.length) {
    couponTickets = [
      ...new Set(
        raw.coupons.flatMap(c =>
          c.isActive !== false
            ? (c.applicableTickets.length > 0 ? c.applicableTickets : ['__all__'])
            : []
        )
      ),
    ];
    hasCoupons = couponTickets.length > 0;
  }

  // Shape into the public whitelist - strips createdBy, registrations, __v,
  // capacity config, raw ticket internals, coupon codes, meetingLink (non-attendees), etc.
  const eventObj = toPublicEvent(raw, { isRegistered, hasCoupons, couponTickets });

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
  return cacheGetOrSet('events:featured', LIST_TTL, async () => {
    const events = await Event.find({ status: { $in: ['upcoming', 'live'] } })
      .sort('-createdAt')
      .limit(limit)
      .populate('organizedBy', PARTNER_FIELDS)
      .lean();
    // Shape to public payload - no createdBy, registrations, capacity config, etc.
    return events.map(ev => toPublicEvent(ev, { isRegistered: false }));
  });
}

async function registerForEvent(eventId, userId, ticketInfo = {}) {
  const { ticketTypeName, ticketPrice = 0, couponUsed = '' } = ticketInfo;
  const resolvedTicketName  = ticketTypeName || 'General';
  let   resolvedTicketPrice = ticketPrice;

  // ── Step 1: look up the event and find the ticket index (needed for atomic update) ──
  const event = await Event.findById(eventId).lean();
  if (!event) throw new ApiError(404, 'Event not found');

  // ── Guard: a paid event may only be registered for free when payment is
  // verified, or a valid coupon brings the effective price to ₹0. This is
  // re-validated server-side so the free endpoint can't bypass payment.
  const isPaidEvent = event.isPaid || event.ticketTypes?.some(t => t.isActive !== false && t.price > 0);
  let freeByCoupon = false;
  if (isPaidEvent && !ticketInfo.fromVerifiedPayment) {
    const effective = computeCouponEffectivePrice(event, ticketTypeName, couponUsed);
    if (effective === 0) {
      freeByCoupon = true;
      resolvedTicketPrice = 0;
    } else {
      throw new ApiError(400, 'Payment is required to register for this event');
    }
  }

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

  const paymentOrderId = ticketInfo.paymentOrderId || null;

  // Idempotency: this exact paid order already registered (webhook/verify/reconcile race).
  if (paymentOrderId) {
    const alreadyByOrder = await EventRegistration.findOne({ paymentOrderId }).lean();
    if (alreadyByOrder) return { message: 'Successfully registered for event', alreadyRegistered: true };
  }

  const result = await Event.updateOne(updateFilter, updateOp);

  if (result.matchedCount === 0) {
    // For a verified payment, never block over a seat-counter race - the money is
    // already taken. Force the user into the registrations array and continue.
    if (ticketInfo.fromVerifiedPayment) {
      await Event.updateOne({ _id: eventId }, { $addToSet: { registrations: userId } }).catch(() => {});
    } else {
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
  }

  if (result.modifiedCount === 0 && !ticketInfo.fromVerifiedPayment) {
    // $addToSet was a no-op - userId was already in registrations (only an error
    // for the free path; a verified payment is idempotent success).
    throw new ApiError(400, 'Already registered for this event');
  }

  // ── Step 3: create the EventRegistration record (non-blocking, idempotent) ──
  try {
    // Skip if this user already has a (non-cancelled) registration row for the
    // event - prevents duplicate rows across verify/webhook/reconcile.
    const existingRow = await EventRegistration.findOne({
      event: eventId,
      user: userId,
      attendanceStatus: { $ne: 'Cancelled' },
    }).lean();

    const user = await User.findById(userId).select('fullName email phoneNumber');
    if (user && !existingRow) {
      const reg = await EventRegistration.create({
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
        ...(paymentOrderId ? { paymentOrderId } : {}),
      });

      // Send confirmation / ticket email (best-effort)
      sendRegistrationConfirmation({
        event,
        recipientName: user.fullName,
        recipientEmail: user.email,
        ticketTypeName: resolvedTicketName,
        ticketPrice: resolvedTicketPrice,
        ticketCode: String(reg._id).slice(-8).toUpperCase(),
      });
    }
  } catch (err) {
    // Duplicate key (paymentOrderId) means a concurrent path already created it.
    if (err.code !== 11000) {
      console.error('Failed to create EventRegistration document:', err.message);
    }
    // Non-blocking - registrations array is the source of truth
  }

  // ── Step 4: invalidate caches ──
  await invalidateEventCache(String(event._id), event.slug || null);

  return { message: 'Successfully registered for event' };
}

async function registerGuestForEvent(eventId, guestInfo = {}, ticketInfo = {}) {
  const { fullName, email, phoneNumber, collegeCompany } = guestInfo || {};
  if (!fullName?.trim() || !email?.trim() || !phoneNumber?.trim()) {
    throw new ApiError(400, 'Name, email, and mobile number are required');
  }

  const event = await Event.findOne(buildEventLookup(eventId)).lean();
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.registrationType !== 'guest') throw new ApiError(401, 'Login is required to register for this event');

  const isPaidEvent = event.isPaid || event.ticketTypes?.some(t => t.isActive !== false && t.price > 0);
  let ticketPrice = ticketInfo.ticketPrice || 0;

  // A paid event can only be registered for free when either:
  //   (a) the payment was already verified (ticketInfo.fromVerifiedPayment), or
  //   (b) a valid coupon brings the selected ticket's effective price to ₹0.
  // We re-validate the coupon SERVER-SIDE here so the client can't forge a free
  // registration for a paid event by calling the free endpoint directly.
  let freeByCoupon = false;
  if (isPaidEvent && !ticketInfo.fromVerifiedPayment) {
    const effective = computeCouponEffectivePrice(event, ticketInfo.ticketTypeName, ticketInfo.couponUsed);
    if (effective === 0) {
      freeByCoupon = true;
      ticketPrice = 0;
    } else {
      throw new ApiError(400, 'Payment is required to register for this event');
    }
  }

  const eventObjectId = event._id;
  const paymentOrderId = ticketInfo.paymentOrderId || null;

  // Idempotency: if this exact paid order was already registered (by the webhook,
  // a prior verify, or reconcile), return success without re-incrementing seats.
  if (paymentOrderId) {
    const alreadyByOrder = await EventRegistration.findOne({ paymentOrderId }).lean();
    if (alreadyByOrder) return { message: 'Successfully registered for event', alreadyRegistered: true };
  }

  const existing = await EventRegistration.findOne({ event: eventObjectId, email: email.trim().toLowerCase(), attendanceStatus: { $ne: 'Cancelled' } }).lean();
  if (existing) {
    // Same email already registered. For a verified payment this means another
    // path won the race - treat as success (idempotent) rather than erroring.
    if (ticketInfo.fromVerifiedPayment) return { message: 'Successfully registered for event', alreadyRegistered: true };
    throw new ApiError(400, 'This email is already registered for the event');
  }

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
  if (result.matchedCount === 0) {
    // For a verified payment, never block the attendee over a seat-counter race:
    // the payment is already taken, so honour the registration.
    if (!ticketInfo.fromVerifiedPayment) {
      throw new ApiError(400, 'Event or selected ticket is full');
    }
    // Still bump the guest counter so totals stay consistent.
    await Event.updateOne({ _id: eventObjectId }, { $inc: { guestRegistrations: 1 } }).catch(() => {});
  }

  let reg;
  try {
    reg = await EventRegistration.create({
      event: eventObjectId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      collegeCompany: collegeCompany?.trim() || '',
      paymentStatus: ticketPrice > 0 ? 'Completed' : 'Free',
      ticketType: ticketInfo.ticketTypeName || 'General',
      ticketTypeName: ticketInfo.ticketTypeName || 'General',
      ticketPrice,
      couponUsed: ticketInfo.couponUsed || '',
      attendanceStatus: 'Registered',
      ...(paymentOrderId ? { paymentOrderId } : {}),
    });
  } catch (err) {
    // Duplicate key on paymentOrderId => another path registered this order
    // first (race). That is success, not failure.
    if (err.code === 11000 && paymentOrderId) {
      return { message: 'Successfully registered for event', alreadyRegistered: true };
    }
    throw err;
  }

  // If this was a free-by-coupon registration, increment the coupon usedCount
  // (the paid path does this after payment verification instead).
  if (freeByCoupon && ticketInfo.couponUsed) {
    await Event.updateOne(
      { _id: eventObjectId, 'coupons.code': ticketInfo.couponUsed },
      { $inc: { 'coupons.$.usedCount': 1 } }
    ).catch(err => console.error('Failed to increment coupon usedCount (free reg):', err.message));
  }

  // Send confirmation / ticket email to the guest (best-effort)
  sendRegistrationConfirmation({
    event,
    recipientName: fullName.trim(),
    recipientEmail: email.trim().toLowerCase(),
    ticketTypeName: ticketInfo.ticketTypeName || 'General',
    ticketPrice,
    ticketCode: String(reg._id).slice(-8).toUpperCase(),
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
