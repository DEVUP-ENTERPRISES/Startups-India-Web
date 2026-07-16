const { Notification } = require('../../models/Notification');
const { User } = require('../users/user.model');
const { logger } = require('../../infrastructure/observability/logger');
const { sendEmail } = require('../../utils/emailService');
const { getBroadcastEmailTemplate } = require('../../utils/emailTemplates');
const pushService = require('../push/push.service');
const { logActivity } = require('../../utils/activityLogger');
const { STATUS, STATUS_LABELS } = require('./grant.status');

/**
 * One fan-out point for every grant notification: dashboard bell, email, push,
 * and the user's activity feed.
 *
 * Every channel is best-effort and independently guarded. A dead SMTP server or
 * an expired FCM token must never roll back a status change that already
 * happened — the application's state is the source of truth, and the notification
 * is a side effect of it, not a precondition for it.
 *
 * SMS is intentionally left as a seam (see `sms` below): the 2FA work already
 * added a real MSG91 driver, but grant notices are non-urgent bulk traffic and
 * every one costs money, so it stays off until an admin explicitly wants it.
 */

// Copy for each status the student can land on. Admin-editable templates can
// override these later; this is the fallback so a new status can never ship with
// an empty notification.
const STATUS_MESSAGES = {
  [STATUS.SUBMITTED]: {
    title: 'Application submitted',
    message: 'We have received your Startup Grant application. Our team will review it shortly.',
    type: 'success',
  },
  [STATUS.UNDER_REVIEW]: {
    title: 'Application under review',
    message: 'Your application is now being reviewed by our team.',
    type: 'info',
  },
  [STATUS.CHANGES_REQUESTED]: {
    title: 'Changes requested',
    message: 'Our team has asked for some changes to your application. Please review and resubmit.',
    type: 'warning',
  },
  [STATUS.SHORTLISTED]: {
    title: 'You have been shortlisted!',
    message: 'Congratulations — your startup has been shortlisted for the Startup Grant.',
    type: 'success',
  },
  [STATUS.REJECTED]: {
    title: 'Application update',
    message: 'Unfortunately your application was not taken forward this time. Thank you for applying.',
    type: 'error',
  },
  [STATUS.SELECTED]: {
    title: 'Congratulations — you have been selected!',
    message: 'You have been selected for the Startup Grant. Please proceed with your Idea Evaluation.',
    type: 'success',
  },
  [STATUS.EVALUATION_PENDING]: {
    title: 'Idea Evaluation pending',
    message: 'Please complete your Idea Evaluation payment to continue.',
    type: 'warning',
  },
  [STATUS.EVALUATION_PAID]: {
    title: 'Payment received',
    message: 'Your Idea Evaluation payment was successful. We will schedule your evaluation shortly.',
    type: 'success',
  },
  [STATUS.EVALUATION_SCHEDULED]: {
    title: 'Evaluation scheduled',
    message: 'Your Idea Evaluation has been scheduled. Check your dashboard for the details.',
    type: 'info',
  },
  [STATUS.EVALUATION_COMPLETED]: {
    title: 'Evaluation completed',
    message: 'Your Idea Evaluation is complete. Results will be shared with you shortly.',
    type: 'info',
  },
  [STATUS.FUNDING_STARTED]: {
    title: 'Funding process started',
    message: 'Great news — the funding process for your startup has begun.',
    type: 'success',
  },
  [STATUS.GRANT_APPROVED]: {
    title: 'Grant approved!',
    message: 'Congratulations — your Startup Grant has been approved.',
    type: 'success',
  },
  [STATUS.COMPLETED]: {
    title: 'Grant process complete',
    message: 'Your Startup Grant process is now complete. All the best!',
    type: 'success',
  },
};

/**
 * @param {object} opts
 * @param {ObjectId} opts.userId
 * @param {string} opts.title
 * @param {string} opts.message
 * @param {string} [opts.type]  info | success | warning | error
 * @param {object} [opts.data]  deep-link payload (applicationId etc.)
 */
async function notifyUser({ userId, title, message, type = 'info', data = {} }) {
  // 1. Dashboard bell — the only channel we care enough about to await, since it
  //    is the durable record the student will actually come back and look at.
  try {
    await Notification.create({
      title,
      message,
      type,
      target: 'specific',
      recipients: [userId],
    });
  } catch (err) {
    logger.error('Grant notification (dashboard) failed', { userId: String(userId), error: err.message });
  }

  // 2. Activity feed.
  logActivity(userId, 'grant.notification', title, data).catch(() => {});

  // 3. Email + push — fire and forget.
  (async () => {
    try {
      const user = await User.findById(userId).select('email fullName notificationPrefs').lean();
      if (!user) return;

      const tpl = getBroadcastEmailTemplate({
        subject: title,
        body: message,
        ctaUrl: data.ctaUrl || null,
        ctaText: data.ctaText || 'View Application',
      });
      sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(
        () => {}
      );
    } catch (err) {
      logger.warn('Grant notification (email) failed', { error: err.message });
    }
  })();

  pushService
    .sendToUser(userId, { title, body: message, data: { ...data, kind: 'grant' } })
    .catch(() => {});
}

/**
 * Notify a student that their application reached `status`.
 * `override` lets a caller supply richer copy (e.g. a rejection reason) without
 * losing the default.
 */
async function notifyStatusChange({ userId, application, status, override = {} }) {
  const base = STATUS_MESSAGES[status];
  if (!base) {
    logger.warn('No notification copy for grant status', { status });
    return;
  }

  const message = override.reason
    ? `${base.message}\n\nNote from the review team: ${override.reason}`
    : base.message;

  await notifyUser({
    userId,
    title: override.title || base.title,
    message: override.message || message,
    type: base.type,
    data: {
      applicationId: String(application._id),
      applicationRef: application.applicationId,
      status,
      statusLabel: STATUS_LABELS[status],
    },
  });
}

module.exports = { notifyUser, notifyStatusChange, STATUS_MESSAGES };
