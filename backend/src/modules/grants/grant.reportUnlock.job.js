'use strict';

const { logger } = require('../../infrastructure/observability/logger');
const { IdeaEvaluation } = require('./grant.models');
const { TWO_HOURS_MS } = require('./grant.phases');

const POLL_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes
const FRONTEND_PATH = '/dashboard/journey/idea-validation';

/**
 * Report-unlock job.
 *
 * Runs periodically and, for every scored evaluation whose booked 1:1 slot is
 * within the next 2 hours (and hasn't been unlocked yet), it:
 *   1. Atomically CLAIMS the evaluation (sets report.emailSentAt) so exactly one
 *      worker acts on it - safe under PM2 clustering and across restarts because
 *      the marker is persisted, not held in memory.
 *   2. Stamps report.unlockedAt so the report becomes downloadable.
 *   3. Sends the "your report is here" email + dashboard notification + FCM push.
 *
 * Catch-up: the query matches any qualifying slot up to now+2h that still lacks
 * emailSentAt, so a missed poll cycle or a server that was down simply picks the
 * item up on the next run rather than losing the notification forever.
 */
async function runOnce() {
  const now = new Date();
  const unlockThreshold = new Date(now.getTime() + TWO_HOURS_MS); // now + 2h

  // Scored evaluations whose slot is at or before "now + 2h" and not yet
  // unlocked/emailed. Includes anything that slipped past the window (catch-up).
  const candidates = await IdeaEvaluation.find({
    'meeting.scheduledAt': { $ne: null, $lte: unlockThreshold },
    submittedAt: { $ne: null },
    $or: [
      { 'report.emailSentAt': { $exists: false } },
      { 'report.emailSentAt': null },
    ],
  })
    .populate({ path: 'applicationId', select: 'userId applicationId' })
    .lean();

  if (!candidates.length) return 0;

  // Lazy requires to avoid any load-order coupling with the notify/push stack.
  const { notifyUser } = require('./grant.notify');
  const { sendToUser } = require('../push/push.service');

  let unlocked = 0;

  for (const ev of candidates) {
    // Atomic claim: only the worker that flips emailSentAt from unset → now wins.
    const claimed = await IdeaEvaluation.findOneAndUpdate(
      {
        _id: ev._id,
        $or: [
          { 'report.emailSentAt': { $exists: false } },
          { 'report.emailSentAt': null },
        ],
      },
      { $set: { 'report.unlockedAt': now, 'report.emailSentAt': now } },
      { new: true }
    );
    if (!claimed) continue; // someone else claimed it first

    const userId = ev.applicationId?.userId;
    const applicationId = ev.applicationId?._id;
    if (!userId) continue;

    // Email + dashboard bell + activity feed (notifyUser fans out to all).
    await notifyUser({
      userId,
      title: '📋 Your Evaluation Report is Ready!',
      message:
        'Your 1:1 session is coming up in about 2 hours, and your evaluation report is now '
        + 'unlocked. Head to the Idea Validation page to view your score, feedback, and download '
        + 'your report.',
      type: 'success',
      data: {
        applicationId: String(applicationId || ''),
        applicationRef: ev.applicationId?.applicationId,
        ctaUrl: `${process.env.FRONTEND_URL || ''}${FRONTEND_PATH}`,
        ctaText: 'View Your Report',
      },
    }).catch(err => logger.warn('Report-ready email failed', { evalId: String(ev._id), message: err.message }));

    // FCM push (fires even if the tab is closed).
    await sendToUser(userId, {
      title: '📋 Your Evaluation Report is Ready!',
      body: 'Your 1:1 session is in ~2 hours. Your report is unlocked - tap to view it.',
      data: {
        type: 'report_ready',
        applicationId: String(applicationId || ''),
        clickUrl: FRONTEND_PATH,
      },
    }).catch(() => {});

    unlocked += 1;
    logger.info('Evaluation report unlocked + notified', {
      evalId: String(ev._id),
      userId: String(userId),
    });
  }

  return unlocked;
}

let timer = null;

/** Start the periodic poller. Idempotent - a second call is a no-op. */
function start() {
  if (timer) return;
  // Kick once shortly after boot (catch-up for anything due while we were down),
  // then poll on the interval.
  setTimeout(() => runOnce().catch(err => logger.warn('Report-unlock initial run error', { message: err.message })), 15 * 1000);
  timer = setInterval(() => {
    runOnce().catch(err => logger.warn('Report-unlock poll error', { message: err.message }));
  }, POLL_INTERVAL_MS);
  // Don't keep the event loop alive solely for this timer.
  if (typeof timer.unref === 'function') timer.unref();
  logger.info('Report-unlock job started', { intervalMs: POLL_INTERVAL_MS });
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

module.exports = { start, stop, runOnce };
