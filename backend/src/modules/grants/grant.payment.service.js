const Razorpay = require('razorpay');
const env = require('../../config/env');
const { ApiError } = require('../../utils/apiError');
const { logger } = require('../../infrastructure/observability/logger');
const { verifyRazorpaySignature } = require('../payments/payments.service');
const { GrantApplication, EvaluationPayment, IdeaEvaluation } = require('./grant.models');
const { STATUS } = require('./grant.status');
const { computeEvaluationFee, getGrantSettings } = require('./grant.settings');
const { addTimelineEntry } = require('./grant.service');
const { notifyStatusChange } = require('./grant.notify');

const razorpay =
  env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
    : null;

/**
 * Idea Evaluation payment.
 *
 * The threat model here is a student who wants a free evaluation. Three rules
 * follow from that, and every one of them is enforced server-side:
 *
 *  1. The AMOUNT is never taken from the client. It is computed from admin
 *     settings and frozen onto the order. A request body saying "amount: 1" is
 *     ignored — there is no amount field to send.
 *  2. The status only moves to Paid when Razorpay's HMAC signature verifies.
 *     No signature, no state change; and an admin cannot set it by hand either
 *     (grant.service refuses that transition explicitly).
 *  3. Capture is idempotent. Razorpay can call back twice, and a user can
 *     replay the same handler response — neither may produce two payments or
 *     double-advance the application.
 */

// Only a Selected / Evaluation-Pending application may pay. Anything else means
// someone is trying to buy their way past a stage they haven't reached.
const PAYABLE_STATUSES = [STATUS.SELECTED, STATUS.EVALUATION_PENDING];

function generateInvoiceNumber(applicationRef) {
  const year = new Date().getFullYear();
  const suffix = applicationRef.split('-').pop();
  return `INV-${year}-${suffix}`;
}

/**
 * Create (or resume) a Razorpay order for the evaluation fee.
 */
async function createEvaluationOrder(userId, applicationDbId) {
  if (!razorpay) throw new ApiError(500, 'Payments are not configured.');

  const settings = await getGrantSettings();
  if (!settings['grant.evaluation.enabled']) {
    throw new ApiError(403, 'Idea Evaluation is currently unavailable.');
  }

  // Ownership enforced in the query.
  const application = await GrantApplication.findOne({ _id: applicationDbId, userId });
  if (!application) throw new ApiError(404, 'Application not found');

  if (!PAYABLE_STATUSES.includes(application.status)) {
    throw new ApiError(
      409,
      'This application is not at the Idea Evaluation stage.'
    );
  }

  // Already paid? Don't take money twice.
  const settled = await EvaluationPayment.findOne({
    applicationId: application._id,
    status: 'paid',
  });
  if (settled) throw new ApiError(409, 'The evaluation fee for this application is already paid.');

  // Reuse an unpaid order rather than littering Razorpay with abandoned ones.
  const existing = await EvaluationPayment.findOne({
    applicationId: application._id,
    status: 'created',
  });
  if (existing) {
    return {
      orderId: existing.orderId,
      keyId: env.RAZORPAY_KEY_ID,
      currency: existing.currency,
      baseAmount: existing.baseAmount,
      gstPercent: existing.gstPercent,
      gstAmount: existing.gstAmount,
      totalAmount: existing.totalAmount,
      applicationRef: application.applicationId,
    };
  }

  // The price is computed here, from settings — never accepted from the client.
  const fee = await computeEvaluationFee();
  if (fee.totalAmount <= 0) throw new ApiError(500, 'Evaluation fee is not configured.');

  const order = await razorpay.orders.create({
    amount: fee.totalAmount, // already in paise
    currency: fee.currency,
    receipt: application.applicationId,
    notes: {
      applicationId: String(application._id),
      applicationRef: application.applicationId,
      purpose: 'idea_evaluation',
    },
  });

  // Snapshot the price. If an admin changes the fee while this checkout is open,
  // the student still settles at the price they were quoted — and we can prove
  // what that price was.
  const payment = await EvaluationPayment.create({
    applicationId: application._id,
    userId,
    provider: 'razorpay',
    orderId: order.id,
    currency: fee.currency,
    baseAmount: fee.baseAmount,
    gstPercent: fee.gstPercent,
    gstAmount: fee.gstAmount,
    totalAmount: fee.totalAmount,
    status: 'created',
  });

  // Move Selected → Evaluation Pending the first time they open checkout, so the
  // admin can see who has been asked to pay and hasn't.
  if (application.status === STATUS.SELECTED) {
    application.status = STATUS.EVALUATION_PENDING;
    await application.save();
    await addTimelineEntry({
      applicationId: application._id,
      event: 'status_changed',
      fromStatus: STATUS.SELECTED,
      toStatus: STATUS.EVALUATION_PENDING,
      message: 'Idea Evaluation payment started.',
      actorId: userId,
      actorRole: 'student',
    });
  }

  logger.info('Grant evaluation order created', {
    orderId: order.id,
    applicationRef: application.applicationId,
  });

  return {
    orderId: order.id,
    keyId: env.RAZORPAY_KEY_ID,
    currency: payment.currency,
    baseAmount: payment.baseAmount,
    gstPercent: payment.gstPercent,
    gstAmount: payment.gstAmount,
    totalAmount: payment.totalAmount,
    applicationRef: application.applicationId,
  };
}

/**
 * Verify Razorpay's signed response and settle the payment.
 *
 * This is the ONLY path to Idea Evaluation Paid.
 */
async function verifyEvaluationPayment(userId, { orderId, paymentId, signature }) {
  const payment = await EvaluationPayment.findOne({ orderId, userId });
  if (!payment) throw new ApiError(404, 'Payment order not found');

  // Idempotent: a replayed callback returns the original result instead of
  // charging, advancing, or invoicing a second time.
  if (payment.status === 'paid') {
    return { alreadyPaid: true, payment };
  }

  const valid = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!valid) {
    payment.status = 'failed';
    await payment.save();
    logger.warn('Grant evaluation payment signature INVALID', { orderId, userId: String(userId) });
    throw new ApiError(400, 'Payment could not be verified.');
  }

  // Atomic settle: whoever flips 'created' → 'paid' first wins, so two
  // simultaneous callbacks cannot both advance the application.
  const settled = await EvaluationPayment.findOneAndUpdate(
    { _id: payment._id, status: 'created' },
    {
      $set: {
        status: 'paid',
        paymentId,
        signature,
        paidAt: new Date(),
      },
    },
    { new: true }
  );

  if (!settled) {
    // Someone else settled it in between — treat as success, not an error.
    const current = await EvaluationPayment.findById(payment._id);
    return { alreadyPaid: true, payment: current };
  }

  const application = await GrantApplication.findById(settled.applicationId);

  settled.invoiceNumber = generateInvoiceNumber(application.applicationId);
  await settled.save();

  // Advance the application. Guarded rather than assumed: if it somehow isn't in
  // a payable state, the money is still recorded and we shout, rather than
  // silently corrupting the lifecycle.
  if (PAYABLE_STATUSES.includes(application.status)) {
    const from = application.status;
    application.status = STATUS.EVALUATION_PAID;
    await application.save();

    await addTimelineEntry({
      applicationId: application._id,
      event: 'payment_completed',
      fromStatus: from,
      toStatus: STATUS.EVALUATION_PAID,
      message: 'Idea Evaluation fee paid.',
      actorId: userId,
      actorRole: 'student',
      metadata: {
        invoiceNumber: settled.invoiceNumber,
        totalAmount: settled.totalAmount,
        currency: settled.currency,
      },
    });

    // The evaluation record is created now so admins immediately see it in the
    // "paid, awaiting scheduling" queue.
    await IdeaEvaluation.findOneAndUpdate(
      { applicationId: application._id },
      { $setOnInsert: { applicationId: application._id } },
      { upsert: true, new: true }
    );

    await notifyStatusChange({
      userId,
      application,
      status: STATUS.EVALUATION_PAID,
    });
  } else {
    logger.error('Evaluation paid for an application in an unexpected state', {
      applicationRef: application.applicationId,
      status: application.status,
    });
  }

  return { alreadyPaid: false, payment: settled };
}

/** Invoice for a settled payment. Owner or admin only. */
async function getInvoice({ applicationDbId, userId = null, isAdmin = false }) {
  const query = { applicationId: applicationDbId, status: 'paid' };
  if (!isAdmin) query.userId = userId;

  const payment = await EvaluationPayment.findOne(query).lean();
  if (!payment) throw new ApiError(404, 'No paid invoice found for this application.');

  const application = await GrantApplication.findById(applicationDbId)
    .select('applicationId founder startup')
    .lean();

  return {
    invoiceNumber: payment.invoiceNumber,
    paidAt: payment.paidAt,
    paymentId: payment.paymentId,
    orderId: payment.orderId,
    currency: payment.currency,
    baseAmount: payment.baseAmount,
    gstPercent: payment.gstPercent,
    gstAmount: payment.gstAmount,
    totalAmount: payment.totalAmount,
    applicationRef: application?.applicationId,
    billedTo: {
      name: application?.founder?.fullName,
      email: application?.founder?.email,
      startup: application?.startup?.name,
    },
  };
}

/** What the student's evaluation page needs to render. */
async function getEvaluationSummary(userId, applicationDbId) {
  const application = await GrantApplication.findOne({ _id: applicationDbId, userId }).lean();
  if (!application) throw new ApiError(404, 'Application not found');

  const [payment, evaluation, fee] = await Promise.all([
    EvaluationPayment.findOne({ applicationId: application._id, status: 'paid' }).lean(),
    IdeaEvaluation.findOne({ applicationId: application._id }).lean(),
    computeEvaluationFee(),
  ]);

  return {
    applicationRef: application.applicationId,
    status: application.status,
    payable: PAYABLE_STATUSES.includes(application.status),
    paid: Boolean(payment),
    // Quote the frozen price if one exists, else the live one.
    fee: payment
      ? {
        currency: payment.currency,
        baseAmount: payment.baseAmount,
        gstPercent: payment.gstPercent,
        gstAmount: payment.gstAmount,
        totalAmount: payment.totalAmount,
      }
      : fee,
    invoiceNumber: payment?.invoiceNumber || null,
    meeting: evaluation?.meeting?.scheduledAt ? evaluation.meeting : null,
    // The reviewer's scores/comments are internal until an admin completes the
    // evaluation — a student must not read their own scorecard mid-review.
    result:
      evaluation?.submittedAt && application.status !== STATUS.EVALUATION_SCHEDULED
        ? {
          totalScore: evaluation.totalScore,
          maxScore: evaluation.maxScore,
          recommendation: evaluation.recommendation,
        }
        : null,
  };
}

module.exports = {
  createEvaluationOrder,
  verifyEvaluationPayment,
  getInvoice,
  getEvaluationSummary,
  PAYABLE_STATUSES,
};
