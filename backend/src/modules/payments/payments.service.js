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

function normalizeAmountToPaise(amountInInr) {
  return Math.round(Number(amountInInr || 0) * 100);
}

async function createRazorpayOrder(userId, input) {
  if (!razorpay) {
    throw new ApiError(500, 'Razorpay is not configured');
  }

  const amountInPaise = normalizeAmountToPaise(input.amount);
  if (!amountInPaise || amountInPaise <= 0) {
    throw new ApiError(400, 'Invalid amount');
  }

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: input.currency || 'INR',
    receipt: input.receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    notes: {
      userId: String(userId),
      courseId: String(input.courseId),
      ...(input.notes || {}),
    },
  });

  const payment = await Payment.findOneAndUpdate(
    { orderId: order.id },
    {
      $set: {
        userId,
        courseId: input.courseId,
        provider: 'razorpay',
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        status: 'created',
        metadata: {
          ...(input.metadata || {}),
          receipt: order.receipt,
          razorpayOrderStatus: order.status,
        },
      },
    },
    { upsert: true, new: true }
  ).lean();

  return { order, payment };
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

  if (existing.status === 'succeeded' && existing.paymentId === input.paymentId) {
    return existing;
  }

  const updated = await Payment.findOneAndUpdate(
    { orderId: input.orderId, userId },
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
        amount: (intent.amount_received || intent.amount || 0) / 100,
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
  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    throw new ApiError(400, 'Invalid Razorpay webhook signature');
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch (error) {
    throw new ApiError(400, 'Invalid webhook payload');
  }

  const paymentEntity = event?.payload?.payment?.entity;
  if (!paymentEntity) {
    return { received: true, ignored: true };
  }

  const orderId = paymentEntity.order_id;
  const paymentId = paymentEntity.id;
  const isSuccessEvent = event.event === 'payment.captured';
  const isFailureEvent = event.event === 'payment.failed';

  if (!isSuccessEvent && !isFailureEvent) {
    return { received: true, ignored: true };
  }

  const nextStatus = isSuccessEvent ? 'succeeded' : 'failed';

  const existing = await Payment.findOne({ orderId }).lean();

  if (!existing && (!paymentEntity.notes?.userId || !paymentEntity.notes?.courseId)) {
    return { received: true, ignored: true };
  }

  const updated = await Payment.findOneAndUpdate(
    { orderId },
    {
      $set: {
        provider: 'razorpay',
        paymentId,
        amount: (paymentEntity.amount || 0) / 100,
        currency: (paymentEntity.currency || 'INR').toUpperCase(),
        status: nextStatus,
        metadata: {
          ...(existing?.metadata || {}),
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpayEvent: event.event,
          webhookCapturedAt: new Date().toISOString(),
        },
      },
      $setOnInsert: {
        userId: paymentEntity.notes.userId,
        courseId: paymentEntity.notes.courseId,
        orderId,
      },
    },
    { upsert: true, new: true }
  ).lean();

  if (nextStatus === 'succeeded') {
    jobQueue.enqueue('payment.succeeded', {
      paymentId: String(updated._id),
      provider: 'razorpay',
      orderId: updated.orderId,
      transactionId: updated.paymentId,
      amount: updated.amount,
      currency: updated.currency,
    });
    // On payment.captured event, verify payment and create enrollment if not already exists
    if (paymentEntity.notes?.userId && paymentEntity.notes?.courseId) {
      const enrollmentsService = require('../enrollments/enrollments.service');
      await enrollmentsService.upsertEnrollment(paymentEntity.notes.userId, {
        courseId: paymentEntity.notes.courseId,
        paymentVerified: true,
        paymentStatus: 'completed',
        paymentId: String(updated._id),
        stripePaymentId: updated.paymentId,
        paymentMethod: 'razorpay',
        amountPaid: updated.amount,
      });
    }
  }

  return { received: true, payment: updated };
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
  verifyRazorpayPayment,
  processRazorpayWebhook,
  listPurchasesForUser,
  listBillingHistory,
  getSubscriptions,
  cancelSubscription,
};
