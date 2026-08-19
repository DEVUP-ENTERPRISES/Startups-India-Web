const { ApiError } = require('../../utils/apiError');
const { GrantApplication, IdeaEvaluation, EvaluationPayment } = require('./grant.models');
const { STATUS } = require('./grant.status');
const { getGrantSettings } = require('./grant.settings');
const { addTimelineEntry, changeStatus } = require('./grant.service');
const { notifyUser } = require('./grant.notify');

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
async function submitResult({ applicationDbId, score, feedback, reviewerId }) {
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
  if (application.status !== STATUS.EVALUATION_SCHEDULED) {
    throw new ApiError(409, 'A result can only be recorded once the evaluation meet is scheduled.');
  }

  const evaluation = await IdeaEvaluation.findOneAndUpdate(
    { applicationId: application._id },
    { $set: { score: n, passed, feedback: feedback || '', reviewerId, submittedAt: new Date() } },
    { new: true }
  );

  // Pass → Evaluation Completed (Phase 2 cleared). Fail → Rejected.
  await changeStatus({
    applicationDbId: application._id,
    toStatus: passed ? STATUS.EVALUATION_COMPLETED : STATUS.REJECTED,
    adminUserId: reviewerId,
    reason: passed ? '' : (feedback || ''),
    // changeStatus sends its own notification with the reason; for a pass we send
    // a richer "you're through" message ourselves below.
    notify: !passed,
  });

  await addTimelineEntry({
    applicationId: application._id,
    event: 'evaluation_completed',
    message: passed
      ? `Idea Evaluation cleared - scored ${n}/100.`
      : `Idea Evaluation scored ${n}/100 - below the ${threshold} pass mark.`,
    actorId: reviewerId,
    actorRole: 'admin',
    reason: feedback || '',
    // The raw mark stays internal; the applicant sees the outcome + feedback.
    visibleToStudent: false,
    metadata: { score: n, passed },
  });

  if (passed) {
    await notifyUser({
      userId: application.userId,
      title: '🎉 You cleared the Idea Evaluation!',
      message:
        'Congratulations - your idea passed evaluation by our panel. '
        + 'You are now eligible for the next phases (Pre-Incubation, Incubation and Funding). '
        + 'We will be in touch with the next steps.'
        + (feedback ? `\n\nPanel note: ${feedback}` : ''),
      type: 'success',
      data: { applicationId: String(application._id), applicationRef: application.applicationId },
    });
  }

  return evaluation;
}

module.exports = {
  MEETING_MODES,
  RECOMMENDATIONS,
  listEvaluations,
  getEvaluation,
  scheduleMeeting,
  submitResult,
};
