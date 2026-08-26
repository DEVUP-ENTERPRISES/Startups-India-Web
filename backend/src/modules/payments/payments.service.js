const Stripe = require('stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require('../../config/env');
const { Payment } = require('./payment.model');
const { ApiError } = require('../../utils/apiError');
const { jobQueue } = require('../../infrastructure/jobs/jobQueue');

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;
const razorpay =
  env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
    : null;

jobQueue.register('payment.succeeded', async payload => {
  // Ensure consistent enrollment across all providers (Stripe/Razorpay)
  const enrollmentsService = require('../enrollments/enrollments.service');
  const { Payment } = require('./payment.model');

  const payment = await Payment.findById(payload.paymentId).lean();
  if (payment && payment.status === 'succeeded' && payment.courseId && payment.userId) {
    await enrollmentsService.upsertEnrollment(payment.userId, {
      courseId: String(payment.courseId),
      paymentVerified: true,
      paymentStatus: 'completed',
      paymentId: String(payment._id),
      stripePaymentId: payment.paymentIntentId || payment.paymentId || null,
      paymentMethod: payment.provider,
      amountPaid: payment.amount,
    });
  }
  return payload;
});

async function listPaymentsForUser(userId) {
  return Payment.find({ userId }).sort({ createdAt: -1 }).lean();
}

async function createPaymentForUser(userId, input) {
  return Payment.create({
    userId,
    courseId: input.courseId,
    provider: input.provider || 'stripe',
    paymentIntentId: input.paymentIntentId,
    amount: input.amount,
    currency: input.currency || 'INR',
    status: input.status || 'created',
    metadata: input.metadata || {},
  });
}

async function createRazorpayOrder(userId, input) {
  if (!razorpay) {
    throw new ApiError(500, 'Razorpay is not configured');
  }

  let amountInPaise = Math.round(Number(input.amount || 0));
  let ticketTypeName = input.ticketTypeName || null;
  let resolvedCoupon = input.couponCode || null;

  // ── Server-side amount validation for event tickets ───────────────────
  // When an eventId is provided, compute the authoritative price server-side.
  // The client-supplied amount is used as a fallback only for legacy events
  // with no ticketTypes - it is never trusted for multi-ticket events.
  if (input.eventId) {
    const { Event } = require('../../models/Event');
    const event = await Event.findById(input.eventId).lean();
    if (!event) throw new ApiError(404, 'Event not found');

    if (ticketTypeName && event.ticketTypes?.length) {
      // Multi-ticket: find the specific ticket and compute its effective price
      const ticket = (event.ticketTypes || []).find(
        t => t.name === ticketTypeName && t.isActive !== false
      );
      if (!ticket) throw new ApiError(400, `Ticket type "${ticketTypeName}" is not available`);

      // Quota check
      if (ticket.quota > 0 && (ticket.sold || 0) >= ticket.quota) {
        throw new ApiError(400, `Ticket type "${ticketTypeName}" is sold out`);
      }

      // Determine effective price: early bird if deadline hasn't passed
      let effectivePrice = ticket.price;
      if (ticket.earlyBirdPrice > 0 && ticket.earlyBirdDeadline && new Date() <= new Date(ticket.earlyBirdDeadline)) {
        effectivePrice = ticket.earlyBirdPrice;
      }

      // ── Coupon validation against event.coupons[] ────────────────────
      // We validate the coupon here but do NOT increment usedCount yet.
      // usedCount is only incremented after payment is confirmed (C1 fix).
      // We store the coupon code in the Payment metadata so the post-payment
      // handler can apply the increment atomically.
      if (resolvedCoupon) {
        const now = new Date();
        const coupon = (event.coupons || []).find(
          c =>
            c.isActive !== false &&
            c.code.toUpperCase() === resolvedCoupon.toUpperCase() &&
            (c.applicableTickets.length === 0 || c.applicableTickets.includes(ticketTypeName)) &&
            (c.maxUses === 0 || (c.usedCount || 0) < c.maxUses) &&
            (!c.validFrom || now >= new Date(c.validFrom)) &&
            (!c.validUntil || now <= new Date(c.validUntil))
        );

        if (coupon) {
          let discount = 0;
          if (coupon.discountType === 'percent') {
            discount = Math.round((effectivePrice * coupon.discountValue) / 100);
          } else {
            discount = coupon.discountValue; // flat paise
          }
          effectivePrice = Math.max(0, effectivePrice - discount);
          // Keep resolvedCoupon so it's stored in Payment metadata
        } else {
          resolvedCoupon = null; // coupon invalid - don't record it
        }
      }

      amountInPaise = effectivePrice;
    } else if (!ticketTypeName) {
      // Legacy single-price event: use server-stored price, ignore client amount
      if (event.isPaid && event.price > 0) {
        amountInPaise = event.price; // already in paise
      }
    }
  }

  if (!amountInPaise || amountInPaise <= 0) {
    throw new ApiError(400, 'Invalid amount');
  }

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: input.currency || 'INR',
    receipt: input.receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    notes: {
      ...(userId ? { userId: String(userId) } : { isGuest: 'true' }),
      ...(input.courseId ? { courseId: String(input.courseId) } : {}),
      ...(input.eventId ? { eventId: String(input.eventId) } : {}),
      ...(ticketTypeName ? { ticketTypeName } : {}),
      // couponCode intentionally excluded from notes - visible in Razorpay dashboard (L2)
      ...(input.notes || {}),
    },
  });

  // Razorpay echoes back the amount in paise - store it directly (no /100).
  const paymentUpdate = {
    courseId: input.courseId,
    eventId: input.eventId,
    provider: 'razorpay',
    orderId: order.id,
    amount: order.amount, // paise
    currency: order.currency,
    status: 'created',
    metadata: {
      ...(input.metadata || {}),
      receipt: order.receipt,
      razorpayOrderStatus: order.status,
      ...(ticketTypeName ? { ticketTypeName } : {}),
      // couponCode stored in metadata (server-side only, not in Razorpay notes)
      ...(resolvedCoupon ? { couponCode: resolvedCoupon } : {}),
    },
  };
  if (userId) paymentUpdate.userId = userId;

  const payment = await Payment.findOneAndUpdate(
    { orderId: order.id },
    { $set: paymentUpdate },
    { upsert: true, new: true }
  ).lean();

  // keyId intentionally not returned in response body (L1) -
  // client should use NEXT_PUBLIC_RAZORPAY_KEY_ID env var.
  return { order, payment };
}

async function createGuestRazorpayOrder(input) {
  const { guest, eventId } = input;
  if (!eventId) throw new ApiError(400, 'eventId is required');
  if (!guest?.fullName?.trim() || !guest?.email?.trim() || !guest?.phoneNumber?.trim()) {
    throw new ApiError(400, 'Name, email, and mobile number are required');
  }

  const { Event } = require('../../models/Event');
  const event = await Event.findById(eventId).lean();
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.registrationType !== 'guest') {
    throw new ApiError(401, 'Login is required to register for this event');
  }

  const { EventRegistration } = require('../../models/EventRegistration');
  const existing = await EventRegistration.findOne({
    event: eventId,
    email: guest.email.trim().toLowerCase(),
    attendanceStatus: { $ne: 'Cancelled' },
  }).lean();
  if (existing) throw new ApiError(400, 'This email is already registered for the event');

  return createRazorpayOrder(null, {
    ...input,
    metadata: {
      ...(input.metadata || {}),
      isGuest: true,
      guest: {
        fullName: guest.fullName.trim(),
        email: guest.email.trim().toLowerCase(),
        phoneNumber: guest.phoneNumber.trim(),
      },
    },
  });
}

function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  if (!env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, 'Razorpay is not configured');
  }
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');
  return expected === signature;
}

async function verifyGuestRazorpayPayment(input) {
  const isValidSignature = verifyRazorpaySignature({
    orderId: input.orderId,
    paymentId: input.paymentId,
    signature: input.signature,
  });

  if (!isValidSignature) {
    throw new ApiError(400, 'Invalid Razorpay signature');
  }

  const existing = await Payment.findOne({
    orderId: input.orderId,
    userId: { $exists: false },
    'metadata.isGuest': true,
  }).lean();
  if (!existing) {
    throw new ApiError(404, 'Payment order not found');
  }

  if (existing.status === 'succeeded') {
    return existing;
  }

  const updated = await Payment.findOneAndUpdate(
    { orderId: input.orderId, userId: { $exists: false }, status: 'created' },
    {
      $set: {
        paymentId: input.paymentId,
        status: 'succeeded',
        metadata: {
          ...(existing.metadata || {}),
          razorpaySignatureVerifiedAt: new Date().toISOString(),
        },
      },
    },
    { new: true }
  ).lean();

  if (!updated) {
    return Payment.findOne({ orderId: input.orderId }).lean();
  }

  const couponCode = existing.metadata?.couponCode;
  const eventId = existing.eventId;
  if (couponCode && eventId) {
    const { Event } = require('../../models/Event');
    await Event.updateOne(
      { _id: eventId, 'coupons.code': couponCode },
      { $inc: { 'coupons.$.usedCount': 1 } }
    ).catch(err => console.error('Failed to increment coupon usedCount:', err.message));
  }

  jobQueue.enqueue('payment.succeeded', {
    paymentId: String(updated._id),
    provider: 'razorpay',
    orderId: updated.orderId,
    transactionId: updated.paymentId,
    amount: updated.amount,
    currency: updated.currency,
  });

  if (eventId && existing.metadata?.guest) {
    const eventsService = require('../events/events.service');
    try {
      await eventsService.registerGuestForEvent(eventId, existing.metadata.guest, {
        ticketTypeName: existing.metadata?.ticketTypeName || null,
        ticketPrice: updated.amount,
        couponUsed: couponCode || '',
        fromVerifiedPayment: true,
      });
    } catch (e) {
      console.error(`Guest event registration error after payment: ${e.message}`);
    }
  }

  return updated;
}

async function verifyRazorpayPayment(userId, input) {
  const isValidSignature = verifyRazorpaySignature({
    orderId: input.orderId,
    paymentId: input.paymentId,
    signature: input.signature,
  });

  if (!isValidSignature) {
    throw new ApiError(400, 'Invalid Razorpay signature');
  }

  const existing = await Payment.findOne({ orderId: input.orderId, userId }).lean();
  if (!existing) {
    throw new ApiError(404, 'Payment order not found');
  }

  // H2/M5 fix: idempotency - if already succeeded, return without re-processing
  if (existing.status === 'succeeded') {
    return existing;
  }

  // H2 fix: filter on status:'created' so concurrent calls can't both settle
  const updated = await Payment.findOneAndUpdate(
    { orderId: input.orderId, userId, status: 'created' },
    {
      $set: {
        paymentId: input.paymentId,
        status: 'succeeded',
        metadata: {
          ...(existing.metadata || {}),
          razorpaySignatureVerifiedAt: new Date().toISOString(),
        },
      },
    },
    { new: true }
  ).lean();

  // If updated is null, another request already settled it - return existing
  if (!updated) {
    return Payment.findOne({ orderId: input.orderId, userId }).lean();
  }

  // C1 fix: increment coupon usedCount NOW (after payment confirmed), not at order creation
  const couponCode = existing.metadata?.couponCode;
  const eventId    = existing.eventId;
  if (couponCode && eventId) {
    const { Event } = require('../../models/Event');
    await Event.updateOne(
      { _id: eventId, 'coupons.code': couponCode },
      { $inc: { 'coupons.$.usedCount': 1 } }
    ).catch(err => console.error('Failed to increment coupon usedCount:', err.message));
  }

  jobQueue.enqueue('payment.succeeded', {
    paymentId: String(updated._id),
    provider: 'razorpay',
    orderId: updated.orderId,
    transactionId: updated.paymentId,
    amount: updated.amount,
    currency: updated.currency,
  });

  // After successful payment verification, trigger enrollment creation
  const enrollmentsService = require('../enrollments/enrollments.service');
  const courseId = existing.courseId;
  if (courseId) {
    await enrollmentsService.upsertEnrollment(userId, {
      courseId: String(courseId),
      paymentVerified: true,
      paymentStatus: 'completed',
      paymentId: String(updated._id),
      stripePaymentId: updated.paymentId || null,
      paymentMethod: 'razorpay',
      amountPaid: updated.amount,
    });
  }

  if (eventId) {
    const eventsService = require('../events/events.service');
    try {
      await eventsService.registerForEvent(eventId, userId, {
        ticketTypeName: existing.metadata?.ticketTypeName || null,
        ticketPrice: updated.amount,
        couponUsed: couponCode || '',
      });
    } catch (e) {
      console.error(`Event registration error after payment: ${e.message}`);
    }
  }

  return updated;
}

async function verifyPaymentIntent(paymentIntentId) {
  if (!stripe) {
    throw new ApiError(500, 'Stripe is not configured');
  }
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

async function processWebhook(rawBody, signature) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    throw new ApiError(500, 'Stripe webhook is not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    throw new ApiError(400, 'Invalid webhook signature', { reason: error.message });
  }

  const intent = event.data?.object;
  if (!intent?.id) {
    return { received: true, ignored: true };
  }

  const nextStatus =
    event.type === 'payment_intent.succeeded'
      ? 'succeeded'
      : event.type === 'payment_intent.payment_failed'
        ? 'failed'
        : null;

  if (!nextStatus) {
    return { received: true, ignored: true };
  }

  const updated = await Payment.findOneAndUpdate(
    { paymentIntentId: intent.id },
    {
      $set: {
        status: nextStatus,
        // Stripe amounts come back in paise - store directly (no /100).
        amount: intent.amount_received || intent.amount || 0,
        currency: (intent.currency || 'inr').toUpperCase(),
        metadata: {
          ...(intent.metadata || {}),
          lastWebhookType: event.type,
          lastWebhookAt: new Date().toISOString(),
        },
      },
      $setOnInsert: {
        provider: 'stripe',
      },
    },
    { upsert: true, new: true }
  ).lean();

  if (nextStatus === 'succeeded') {
    jobQueue.enqueue('payment.succeeded', {
      paymentId: String(updated._id),
      paymentIntentId: intent.id,
      amount: updated.amount,
      currency: updated.currency,
    });
  }

  return { received: true, payment: updated };
}

function verifyRazorpayWebhookSignature(rawBody, signature) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    throw new ApiError(500, 'Razorpay webhook is not configured');
  }

  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return expected === signature;
}

async function processRazorpayWebhook(rawBody, signature) {
  // M4 fix: wrap everything so we always return 200 to Razorpay - prevents retry storms
  try {
    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      // Return 200 with error flag - don't throw, or Razorpay will retry forever
      return { received: true, error: 'invalid_signature' };
    }

    let event;
    try {
      event = JSON.parse(rawBody.toString());
    } catch {
      return { received: true, error: 'invalid_payload' };
    }

    const paymentEntity = event?.payload?.payment?.entity;
    if (!paymentEntity) return { received: true, ignored: true };

    const orderId   = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const isSuccessEvent = event.event === 'payment.captured';
    const isFailureEvent = event.event === 'payment.failed';

    if (!isSuccessEvent && !isFailureEvent) return { received: true, ignored: true };

    const nextStatus = isSuccessEvent ? 'succeeded' : 'failed';

    // H3 fix: ONLY update an existing Payment document.
    // Never upsert with userId/courseId from notes - those are user-controlled.
    const existing = await Payment.findOne({ orderId }).lean();
    if (!existing) {
      // No Payment record means this order wasn't created through our system
      return { received: true, ignored: true };
    }

    // H2 fix: only settle if currently 'created' - prevents double-settlement
    if (existing.status === 'succeeded' || existing.status === 'failed') {
      return { received: true, ignored: true, reason: 'already_settled' };
    }

    const updated = await Payment.findOneAndUpdate(
      { orderId, status: 'created' },
      {
        $set: {
          provider: 'razorpay',
          paymentId,
          // Razorpay webhook sends amount in paise - store directly (no /100).
          amount: paymentEntity.amount || 0,
          currency: (paymentEntity.currency || 'INR').toUpperCase(),
          status: nextStatus,
          metadata: {
            ...(existing.metadata || {}),
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpayEvent: event.event,
            webhookCapturedAt: new Date().toISOString(),
          },
        },
      },
      { new: true }
    ).lean();

    if (!updated) {
      // Another handler (client verify) already settled it - safe to ignore
      return { received: true, ignored: true, reason: 'race_settled' };
    }

    if (nextStatus === 'succeeded') {
      // C1 fix: increment coupon usedCount after confirmed payment
      const couponCode = existing.metadata?.couponCode;
      if (couponCode && existing.eventId) {
        const { Event } = require('../../models/Event');
        await Event.updateOne(
          { _id: existing.eventId, 'coupons.code': couponCode },
          { $inc: { 'coupons.$.usedCount': 1 } }
        ).catch(err => console.error('Webhook coupon increment failed:', err.message));
      }

      jobQueue.enqueue('payment.succeeded', {
        paymentId: String(updated._id),
        provider: 'razorpay',
        orderId: updated.orderId,
        transactionId: updated.paymentId,
        amount: updated.amount,
        currency: updated.currency,
      });

      // Use existing.userId/_id (from our own Payment record, not from webhook notes)
      const uid = existing.userId;
      if (uid) {
        if (existing.courseId) {
          const enrollmentsService = require('../enrollments/enrollments.service');
          await enrollmentsService.upsertEnrollment(uid, {
            courseId: String(existing.courseId),
            paymentVerified: true,
            paymentStatus: 'completed',
            paymentId: String(updated._id),
            stripePaymentId: updated.paymentId,
            paymentMethod: 'razorpay',
            amountPaid: updated.amount,
          }).catch(err => console.error('Webhook enrollment error:', err.message));
        }
        if (existing.eventId) {
          const eventsService = require('../events/events.service');
          await eventsService.registerForEvent(existing.eventId, uid, {
            ticketTypeName: existing.metadata?.ticketTypeName || null,
            ticketPrice: updated.amount,
            couponUsed: existing.metadata?.couponCode || '',
          }).catch(e => console.error(`Webhook event registration error: ${e.message}`));
        }
      } else if (existing.eventId && existing.metadata?.isGuest && existing.metadata?.guest) {
        const eventsService = require('../events/events.service');
        await eventsService.registerGuestForEvent(existing.eventId, existing.metadata.guest, {
          ticketTypeName: existing.metadata?.ticketTypeName || null,
          ticketPrice: updated.amount,
          couponUsed: existing.metadata?.couponCode || '',
          fromVerifiedPayment: true,
        }).catch(e => console.error(`Webhook guest event registration error: ${e.message}`));
      }
    }

    return { received: true, payment: updated };
  } catch (err) {
    // M4: never let an uncaught error cause a non-200 - Razorpay would retry infinitely
    console.error('processRazorpayWebhook unexpected error:', err.message);
    return { received: true, error: 'internal_error' };
  }
}

const { Subscription } = require('./subscription.model');

async function listPurchasesForUser(userId) {
  return Payment.find({ userId, status: 'succeeded' })
    .populate('courseId', 'title')
    .sort({ createdAt: -1 })
    .lean();
}

async function listBillingHistory(userId) {
  return Payment.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
}

async function getSubscriptions(userId) {
  return Subscription.find({ userId }).sort({ createdAt: -1 }).lean();
}

async function cancelSubscription(subscriptionId, userId) {
  return Subscription.findOneAndUpdate(
    { _id: subscriptionId, userId },
    { status: 'cancelled', autoRenew: false },
    { new: true }
  );
}

module.exports = {
  listPaymentsForUser,
  createPaymentForUser,
  verifyPaymentIntent,
  processWebhook,
  createRazorpayOrder,
  createGuestRazorpayOrder,
  verifyRazorpayPayment,
  verifyGuestRazorpayPayment,
  // Exported so the grant module can verify its own orders without duplicating
  // the HMAC - signature checking is the one thing that must not be re-implemented.
  verifyRazorpaySignature,
  processRazorpayWebhook,
  listPurchasesForUser,
  listBillingHistory,
  getSubscriptions,
  cancelSubscription,
};
