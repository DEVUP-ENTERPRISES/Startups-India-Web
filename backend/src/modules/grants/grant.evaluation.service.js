const { ApiError } = require('../../utils/apiError');
const { GrantApplication, IdeaEvaluation, EvaluationPayment } = require('./grant.models');
const { STATUS } = require('./grant.status');
const { getGrantSettings } = require('./grant.settings');
const { addTimelineEntry, changeStatus } = require('./grant.service');
const { notifyUser } = require('./grant.notify');

/**
 * Idea Evaluation: scheduling the meeting and recording the reviewer's verdict.
 *
 * Nothing here can run before the fee is settled — scheduling reads the payment
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
    // The reviewer form is rendered from the admin's criteria list, so adding a
    // criterion needs no code change and no migration.
    criteria: settings['grant.evaluation.criteria'],
    maxScorePerCriterion: settings['grant.evaluation.maxScore'],
  };
}

/**
 * Schedule the evaluation meeting.
 * Requires a settled payment — an unpaid student cannot be booked in.
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
 * Reviewer submits the scorecard.
 *
 * Scores are validated against the admin's criteria list: an unknown criterion,
 * or one scored above the configured maximum, is rejected rather than quietly
 * skewing the total.
 */
async function submitResult({ applicationDbId, scores, comments, recommendation, reviewerId }) {
  if (!RECOMMENDATIONS.includes(recommendation)) {
    throw new ApiError(400, `Invalid recommendation: ${recommendation}`);
  }

  const settings = await getGrantSettings();
  const criteria = settings['grant.evaluation.criteria'];
  const maxPer = settings['grant.evaluation.maxScore'];

  const given = Object.keys(scores || {});
  const missing = criteria.filter(c => !given.includes(c));
  if (missing.length) {
    throw new ApiError(400, `Missing scores for: ${missing.join(', ')}`);
  }

  const unknown = given.filter(c => !criteria.includes(c));
  if (unknown.length) {
    throw new ApiError(400, `Unknown criteria: ${unknown.join(', ')}`);
  }

  let total = 0;
  for (const c of criteria) {
    const n = Number(scores[c]);
    if (!Number.isFinite(n) || n < 0 || n > maxPer) {
      throw new ApiError(400, `${c} must be a score between 0 and ${maxPer}.`);
    }
    total += n;
  }

  const application = await GrantApplication.findById(applicationDbId);
  if (!application) throw new ApiError(404, 'Application not found');

  if (application.status !== STATUS.EVALUATION_SCHEDULED) {
    throw new ApiError(
      409,
      'An evaluation result can only be recorded for a scheduled evaluation.'
    );
  }

  const evaluation = await IdeaEvaluation.findOneAndUpdate(
    { applicationId: application._id },
    {
      $set: {
        scores,
        totalScore: total,
        maxScore: criteria.length * maxPer,
        comments: comments || '',
        recommendation,
        reviewerId,
        submittedAt: new Date(),
      },
    },
    { new: true }
  );

  await changeStatus({
    applicationDbId: application._id,
    toStatus: STATUS.EVALUATION_COMPLETED,
    adminUserId: reviewerId,
  });

  await addTimelineEntry({
    applicationId: application._id,
    event: 'evaluation_completed',
    message: `Evaluation completed — scored ${total}/${criteria.length * maxPer}.`,
    actorId: reviewerId,
    actorRole: 'admin',
    // The scorecard itself stays internal; the student is told the outcome, not
    // shown the reviewer's raw marks and candid comments.
    visibleToStudent: false,
    metadata: { totalScore: total, recommendation },
  });

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
