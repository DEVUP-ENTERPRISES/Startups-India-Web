const { Enrollment, LessonProgress, ModuleQuizAttempt } = require('./enrollment.model');
const { ApiError } = require('../../utils/apiError');
const { cacheGet, cacheSet, cacheDel } = require('../../infrastructure/cache/redis');
const { logger } = require('../../infrastructure/observability/logger');

async function listEnrollments(userId, courseId, status) {
  if (courseId && !status) {
    // Check cache for specific enrollment
    const cacheKey = `enrollment:${userId}:${courseId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
  }

  const query = { userId };
  if (courseId) {
    query.courseId = courseId;
  }
  if (status) {
    query.status = status;
  }
  const result = await Enrollment.find(query).sort({ lastAccessedAt: -1, createdAt: -1 }).lean();

  // Cache specific enrollment lookup
  if (courseId && result.length > 0) {
    cacheSet(`enrollment:${userId}:${courseId}`, result, 300).catch(() => {});
  }

  return result;
}

async function upsertEnrollment(userId, input) {
  const { Course } = require('../courses/course.model');

  // Allow free courses without payment verification
  if (!input.paymentVerified) {
    const course = await Course.findById(input.courseId).select('priceInr').lean();
    if (!course) throw new ApiError(404, 'Course not found');
    // priceInr is stored in paise; 0 means free regardless of unit.
    if (course.priceInr > 0) {
      throw new ApiError(403, 'Payment not verified. Enrollment not allowed.');
    }
  }

  // Idempotency: Prevent duplicate enrollments
  const existing = await Enrollment.findOne({ userId, courseId: input.courseId });
  if (existing) {
    return existing;
  }

  const isFree = !input.paymentVerified;
  const payload = {
    userId,
    courseId: input.courseId,
    paymentId: input.paymentId || null,
    paymentStatus: isFree ? 'free' : input.paymentStatus || 'completed',
    status: 'enrolled',
    stripePaymentId: input.stripePaymentId || null,
    paymentMethod: input.paymentMethod || null,
    amountPaid: input.amountPaid || 0,
    lastAccessedAt: new Date(),
  };

  const enrollment = await Enrollment.create(payload);

  // Increment enrolledCount on Course
  await Course.updateOne({ _id: input.courseId }, { $inc: { enrolledCount: 1 } });

  // Invalidate enrollment cache and dashboard stats
  cacheDel(`enrollment:${userId}:${input.courseId}`, 'dashboard:stats').catch(() => {});

  return enrollment;
}

async function upsertLessonProgress(userId, input) {
  const result = await LessonProgress.findOneAndUpdate(
    { userId, courseId: input.courseId, lessonId: input.lessonId },
    {
      $set: {
        lessonTitle: input.lessonTitle || null,
        isCompleted: input.isCompleted,
        completedAt: input.isCompleted ? new Date() : null,
      },
    },
    { upsert: true, new: true }
  ).lean();

  // Invalidate user progress cache
  if (input.isCompleted) {
    cacheDel(`progress:${userId}:${input.courseId}`).catch(() => {});
  }

  return result;
}

// On startup: find succeeded payments that have no matching enrollment and
// create those enrollments. Guards against crashes between payment.succeeded
// and the job queue handler running.
async function reconcileOrphanedPayments() {
  try {
    const { Payment } = require('../payments/payment.model');
    // One round-trip; the correlated lookup hits the unique {userId, courseId} enrollment index.
    const orphaned = await Payment.aggregate([
      { $match: { status: 'succeeded', courseId: { $ne: null } } },
      {
        $lookup: {
          from: Enrollment.collection.name,
          let: { u: '$userId', c: '$courseId' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$userId', '$$u'] }, { $eq: ['$courseId', '$$c'] }] } } },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: 'enrollment',
        },
      },
      { $match: { enrollment: { $size: 0 } } },
      { $project: { userId: 1, courseId: 1, provider: 1, amount: 1, paymentIntentId: 1, paymentId: 1 } },
    ]);

    if (orphaned.length === 0) return;

    for (const payment of orphaned) {
      await upsertEnrollment(payment.userId, {
        courseId: String(payment.courseId),
        paymentVerified: true,
        paymentStatus: 'completed',
        paymentId: String(payment._id),
        stripePaymentId: payment.paymentIntentId || payment.paymentId || null,
        paymentMethod: payment.provider,
        amountPaid: payment.amount,
      });
    }

    logger.info('Reconciled orphaned payment enrollments on startup', { fixed: orphaned.length });
  } catch (err) {
    logger.error('Payment reconciliation failed', { error: err.message });
  }
}

module.exports = {
  listEnrollments,
  upsertEnrollment,
  upsertLessonProgress,
  reconcileOrphanedPayments,
};
