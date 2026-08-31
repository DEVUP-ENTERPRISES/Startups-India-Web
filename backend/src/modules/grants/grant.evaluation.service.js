const { ApiError } = require('../../utils/apiError');
const { GrantApplication, IdeaEvaluation, EvaluationPayment } = require('./grant.models');
const { STATUS } = require('./grant.status');
const { getGrantSettings } = require('./grant.settings');
const { addTimelineEntry, changeStatus } = require('./grant.service');
const { notifyUser } = require('./grant.notify');
const { sendToUser } = require('../push/push.service');

/**
 * Idea Evaluation: scheduling the meeting and recording the reviewer's verdict.
 *
 * Nothing here can run before the fee is settled - scheduling reads the payment
 * record, not an admin's word for it.
 */

const MEETING_MODES = ['google_meet', 'zoom', 'physical'];
const RECOMMENDATIONS = ['reject', 'needs_improvement', 'recommended', 'funding_ready'];

/** The admin queue: paid evaluations, newest first. */
async function listEvaluations({ scheduled, page = 1, limit = 20 } = {}) {
  const query = {};
  if (scheduled === 'pending') query['meeting.scheduledAt'] = null;
  if (scheduled === 'scheduled') query['meeting.scheduledAt'] = { $ne: null };
  if (scheduled === 'completed') query.submittedAt = { $ne: null };

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    IdeaEvaluation.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .populate({
        path: 'applicationId',
        select: 'applicationId startup founder status',
      })
      .populate('reviewerId', 'fullName email')
      .lean(),
    IdeaEvaluation.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit) || 1,
    },
  };
}

async function getEvaluation(applicationDbId) {
  const evaluation = await IdeaEvaluation.findOne({ applicationId: applicationDbId })
    .populate('reviewerId', 'fullName email')
    .lean();
  if (!evaluation) throw new ApiError(404, 'No evaluation exists for this application.');

  const settings = await getGrantSettings();
  return {
    ...evaluation,
    // Idea is scored out of 100; this is the pass mark the admin UI shows.
    maxScore: 100,
    passThreshold: settings['grant.evaluation.passThreshold'],
  };
}

/**
 * Schedule the evaluation meeting.
 * Requires a settled payment - an unpaid student cannot be booked in.
 */
async function scheduleMeeting({ applicationDbId, mode, scheduledAt, link, location, adminUserId }) {
  if (!MEETING_MODES.includes(mode)) {
    throw new ApiError(400, `Invalid meeting mode: ${mode}`);
  }

  const when = new Date(scheduledAt);
  if (Number.isNaN(when.getTime())) throw new ApiError(400, 'Invalid meeting date/time.');
  if (when.getTime() < Date.now()) {
    throw new ApiError(400, 'The meeting cannot be scheduled in the past.');
  }

  // A remote meeting without a link is a meeting nobody can attend.
  if (mode !== 'physical' && !link) {
    throw new ApiError(400, 'A meeting link is required for online meetings.');
  }
  if (mode === 'physical' && !location) {
    throw new ApiError(400, 'A location is required for a physical meeting.');
  }

  const application = await GrantApplication.findById(applicationDbId);
  if (!application) throw new ApiError(404, 'Application not found');

  // The money is the gate, not the status field.
  const paid = await EvaluationPayment.exists({
    applicationId: application._id,
    status: 'paid',
  });
  if (!paid) {
    throw new ApiError(409, 'The evaluation fee has not been paid for this application.');
  }

  const evaluation = await IdeaEvaluation.findOneAndUpdate(
    { applicationId: application._id },
    {
      $set: {
        'meeting.mode': mode,
        'meeting.scheduledAt': when,
        'meeting.link': mode === 'physical' ? null : link,
        'meeting.location': mode === 'physical' ? location : null,
        'meeting.scheduledBy': adminUserId,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Only advance if we're coming from Paid; re-scheduling an already-scheduled
  // meeting must not throw an illegal-transition error at the admin.
  if (application.status === STATUS.EVALUATION_PAID) {
    await changeStatus({
      applicationDbId: application._id,
      toStatus: STATUS.EVALUATION_SCHEDULED,
      adminUserId,
      notify: false, // the richer meeting-details notification goes out below
    });
  }

  await addTimelineEntry({
    applicationId: application._id,
    event: 'meeting_scheduled',
    message: `Evaluation meeting scheduled for ${when.toLocaleString('en-IN')}.`,
    actorId: adminUserId,
    actorRole: 'admin',
    metadata: { mode, scheduledAt: when.toISOString() },
  });

  const modeLabel =
    mode === 'google_meet' ? 'Google Meet' : mode === 'zoom' ? 'Zoom' : 'In person';

  await notifyUser({
    userId: application.userId,
    title: 'Your Idea Evaluation is scheduled',
    message:
      `Your evaluation is scheduled for ${when.toLocaleString('en-IN')} (${modeLabel}).\n` +
      (mode === 'physical' ? `Location: ${location}` : `Join here: ${link}`),
    type: 'info',
    data: {
      applicationId: String(application._id),
      applicationRef: application.applicationId,
    },
  });

  return evaluation;
}

/**
 * Record the evaluation result: a single 0–100 mark plus feedback, allocated
 * after the offline evaluation meet.
 *
 * The mark decides the outcome automatically:
 *   >= passThreshold → cleared Phase 2, advances toward the next phases.
 *   <  passThreshold → not selected; the feedback is shown as improvement
 *                      suggestions.
 * The pass/fail decision is frozen onto the evaluation, so a later change to the
 * threshold can't retroactively flip an outcome the applicant was already told.
 */
/**
 * Canonical scoring action (score-first model).
 *
 * The admin scores the application. This does NOT reveal the report. Instead the
 * applicant is told to book their 1:1 slot - the report (score, pass/fail,
 * feedback, downloadable file) only unlocks 2 hours before that booked slot
 * (see isReportUnlocked + the report-unlock job).
 *
 * Both admin scoring endpoints funnel through here so there is a single source
 * of truth for scoring behaviour, messaging and status transitions.
 */
async function scoreApplication({ applicationDbId, score, feedback, reviewerId }) {
  const n = Number(score);
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    throw new ApiError(400, 'Score must be a number between 0 and 100.');
  }

  const settings = await getGrantSettings();
  const threshold = settings['grant.evaluation.passThreshold'];
  const passed = n >= threshold;

  if (!passed && !String(feedback || '').trim()) {
    throw new ApiError(400, 'Please give feedback / suggestions when the applicant does not pass.');
  }

  const application = await GrantApplication.findById(applicationDbId);
  if (!application) throw new ApiError(404, 'Application not found');

  const evaluation = await IdeaEvaluation.findOneAndUpdate(
    { applicationId: application._id },
    {
      $set: { score: n, passed, feedback: feedback || '', reviewerId, submittedAt: new Date() },
      // A fresh score re-locks the report; it must be re-earned via the slot.
      $unset: { 'report.unlockedAt': '', 'report.emailSentAt': '' },
    },
    { upsert: true, new: true }
  );

  // Pass → advance so the next phases unlock (existing behaviour). Fail → Rejected.
  // Status is set directly (score-first flow doesn't require a prior scheduled
  // meet); the report reveal is gated separately by isReportUnlocked, NOT status.
  const nextStatus = passed ? STATUS.PRE_INCUBATION : STATUS.REJECTED;
  const from = application.status;
  application.status = nextStatus;
  application.lastActionBy = reviewerId;
  application.lastActionAt = new Date();
  await application.save();

  await addTimelineEntry({
    applicationId: application._id,
    event: 'scored',
    fromStatus: from,
    toStatus: nextStatus,
    message: passed
      ? `Idea Evaluation scored ${n}/100 - cleared the ${threshold} pass mark.`
      : `Idea Evaluation scored ${n}/100 - below the ${threshold} pass mark.`,
    actorId: reviewerId,
    actorRole: 'admin',
    reason: feedback || '',
    // The raw mark stays internal; the applicant unlocks it via their slot.
    visibleToStudent: false,
    metadata: { score: n, passed, nextStatus },
  });

  const env = require('../../config/env');
  const ideaValidationUrl = `${env.FRONTEND_URL}/dashboard/journey/idea-validation`;

  if (passed) {
    // IMPORTANT: do NOT tell them the report is ready. It is locked until they
    // book a 1:1 slot and reach the 2-hours-before window.
    await notifyUser({
      userId: application.userId,
      title: '✅ Your Idea Has Been Evaluated',
      message:
        'Our expert panel has evaluated your idea. To unlock your evaluation report, '
        + 'book your 1:1 session on the Idea Validation page. Your report unlocks 2 hours '
        + 'before your booked slot.',
      type: 'success',
      data: {
        applicationId: String(application._id),
        applicationRef: application.applicationId,
        ctaUrl: ideaValidationUrl,
        ctaText: 'Book Your 1:1 Slot',
      },
    });

    await sendToUser(application.userId, {
      title: '✅ Your Idea Has Been Evaluated',
      body: 'Book your 1:1 session to unlock your evaluation report. It unlocks 2 hours before your slot.',
      data: {
        type: 'idea_scored',
        applicationId: String(application._id),
        clickUrl: ideaValidationUrl,
      },
    }).catch(() => {});
  } else {
    await notifyUser({
      userId: application.userId,
      title: 'Application Update',
      message: feedback || 'Thank you for applying. Unfortunately your idea did not clear evaluation this time.',
      type: 'info',
      data: {
        applicationId: String(application._id),
        applicationRef: application.applicationId,
        ctaUrl: ideaValidationUrl,
        ctaText: 'View Feedback',
      },
    });

    await sendToUser(application.userId, {
      title: 'Evaluation Result Available',
      body: 'Your idea evaluation result is in. Check your dashboard for feedback and next steps.',
      data: {
        type: 'idea_evaluated',
        applicationId: String(application._id),
        clickUrl: ideaValidationUrl,
      },
    }).catch(() => {});
  }

  return evaluation;
}

/**
 * Student report download. Enforces the unlock gate server-side: the report is
 * only served once it is unlocked (scored + slot booked + within 2h of the slot,
 * or already stamped by the unlock job). Ownership is enforced in the query.
 *
 * Returns a presigned download URL when a report file was attached; otherwise
 * signals that the on-page score/feedback IS the report (no file to download).
 */
async function getReportDownload(userId, applicationDbId) {
  const { isReportUnlocked } = require('./grant.phases');

  const application = await GrantApplication.findOne({ _id: applicationDbId, userId })
    .select('_id applicationId')
    .lean();
  if (!application) throw new ApiError(404, 'Application not found');

  const evaluation = await IdeaEvaluation.findOne({ applicationId: application._id }).lean();
  if (!evaluation?.submittedAt) {
    throw new ApiError(409, 'Your evaluation has not been completed yet.');
  }

  if (!isReportUnlocked(evaluation)) {
    // Locked: tell them exactly why (book a slot vs wait for the 2h window).
    if (!evaluation?.meeting?.scheduledAt) {
      throw new ApiError(423, 'Book your 1:1 session to unlock your report.');
    }
    throw new ApiError(423, 'Your report unlocks 2 hours before your booked session.');
  }

  // Unlocked. If a downloadable file was attached, sign it. Otherwise the report
  // is the on-page score/feedback (returned by getEvaluationSummary).
  if (evaluation.report?.fileKey) {
    const { generateDownloadUrl } = require('../../utils/s3');
    const url = await generateDownloadUrl(evaluation.report.fileKey, 300);
    return { hasFile: true, url, fileName: `Evaluation-Report-${application.applicationId}.pdf` };
  }
  if (evaluation.report?.fileUrl) {
    return { hasFile: true, url: evaluation.report.fileUrl, fileName: `Evaluation-Report-${application.applicationId}.pdf` };
  }

  return {
    hasFile: false,
    // The report is the on-page result. Return it so the client can render/print.
    result: {
      score: evaluation.score,
      maxScore: 100,
      passed: evaluation.passed,
      feedback: evaluation.feedback || '',
    },
  };
}

/**
 * Admin attaches (or replaces) a downloadable report file for an application's
 * evaluation. Stores the S3 key/url on IdeaEvaluation.report - unlock timing is
 * unchanged (still gated by isReportUnlocked).
 */
async function attachReportFile({ applicationDbId, fileKey = null, fileUrl = null }) {
  if (!fileKey && !fileUrl) throw new ApiError(400, 'A report fileKey or fileUrl is required.');
  const evaluation = await IdeaEvaluation.findOneAndUpdate(
    { applicationId: applicationDbId },
    { $set: { 'report.fileKey': fileKey, 'report.fileUrl': fileUrl } },
    { new: true }
  );
  if (!evaluation) throw new ApiError(404, 'Evaluation not found for this application.');
  return { attached: true };
}

module.exports = {
  MEETING_MODES,
  RECOMMENDATIONS,
  scoreApplication,
  // Back-compat alias: the /evaluation/result route now funnels into the single
  // canonical scoring path so both endpoints behave identically.
  submitResult: scoreApplication,
  listEvaluations,
  getEvaluation,
  scheduleMeeting,
  getReportDownload,
  attachReportFile,
};
