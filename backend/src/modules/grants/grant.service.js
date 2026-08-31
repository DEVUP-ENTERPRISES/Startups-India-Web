const { ApiError } = require('../../utils/apiError');
const { logActivity } = require('../../utils/activityLogger');
const {
  GrantApplication,
  ApplicationTimeline,
  ApplicationDocument,
  ReviewComment,
  GrantCounter,
  IdeaEvaluation,
} = require('./grant.models');
const { STATUS, STATUS_LABELS, assertTransition, isEditable, isTerminal } = require('./grant.status');
const { getGrantSettings } = require('./grant.settings');
const { notifyStatusChange } = require('./grant.notify');
const { computePhases } = require('./grant.phases');

// ─── APPLICATION ID ─────────────────────────────────────────────────────
/**
 * GRANT-2026-000125
 *
 * Uses an atomic $inc on a per-year counter document. The obvious alternative -
 * countDocuments() + 1 - hands the same number to two people who submit in the
 * same millisecond, and the unique index then rejects one of them at random.
 */
async function generateApplicationId() {
  const year = String(new Date().getFullYear());
  const counter = await GrantCounter.findByIdAndUpdate(
    year,
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return `GRANT-${year}-${String(counter.seq).padStart(6, '0')}`;
}

// ─── TIMELINE ───────────────────────────────────────────────────────────
async function addTimelineEntry({
  applicationId,
  event,
  fromStatus = null,
  toStatus = null,
  message = '',
  reason = '',
  actorId = null,
  actorRole = 'system',
  visibleToStudent = true,
  metadata = {},
}) {
  return ApplicationTimeline.create({
    applicationId,
    event,
    fromStatus,
    toStatus,
    message,
    reason,
    actorId,
    actorRole,
    visibleToStudent,
    metadata,
  });
}

// ─── VALIDATION AGAINST ADMIN SETTINGS ──────────────────────────────────
/**
 * Everything that could block a submission, checked in one place against the
 * live settings - never against a literal.
 */
async function assertCanSubmit(userId, { excludeApplicationId = null } = {}) {
  const s = await getGrantSettings();

  if (!s['grant.applications.enabled']) {
    throw new ApiError(403, 'Grant applications are currently closed.');
  }

  const deadline = s['grant.applications.deadline'];
  if (deadline) {
    const when = new Date(deadline);
    if (!Number.isNaN(when.getTime()) && Date.now() > when.getTime()) {
      throw new ApiError(403, 'The submission deadline for the Startup Grant has passed.');
    }
  }

  // Global capacity. 0 = unlimited.
  const max = s['grant.applications.max'];
  if (max > 0) {
    const total = await GrantApplication.countDocuments({ status: { $ne: STATUS.DRAFT } });
    if (total >= max) {
      throw new ApiError(403, 'The Startup Grant has reached its maximum number of applications.');
    }
  }

  // Duplicate prevention: a submitted (non-draft, non-rejected) application
  // already in flight blocks another one, so a student can't spam the reviewers
  // with ten copies of the same idea.
  const perUser = s['grant.applications.maxPerUser'];
  const query = {
    userId,
    status: { $nin: [STATUS.DRAFT, STATUS.REJECTED] },
  };
  if (excludeApplicationId) query._id = { $ne: excludeApplicationId };

  const active = await GrantApplication.countDocuments(query);
  if (active >= perUser) {
    throw new ApiError(
      409,
      perUser === 1
        ? 'You already have an active Startup Grant application.'
        : `You may only have ${perUser} active applications at a time.`
    );
  }
}

// Stage/category come from admin-editable lists. An exact match is required
// for category, but we also accept a fuzzy match (same logic as the frontend's
// resolveCategory) so that values like "Artificial Intelligence / ML" from a
// user's profile map cleanly to "AI/ML" without a server error.
function resolveToKnownValue(raw, list) {
  if (!raw || !list?.length) return null;
  // 1. Exact
  if (list.includes(raw)) return raw;
  // 2. Case-insensitive exact
  const lower = raw.toLowerCase();
  const exact = list.find(v => v.toLowerCase() === lower);
  if (exact) return exact;
  // 3. Substring
  const substr = list.find(
    v => lower.includes(v.toLowerCase()) || v.toLowerCase().includes(lower)
  );
  if (substr) return substr;
  // 4. Token overlap
  const tokens = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const tokenMatch = list.find(v => {
    const vTokens = v.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    return tokens.some(t => vTokens.some(vt => t.startsWith(vt) || vt.startsWith(t)));
  });
  return tokenMatch || null;
}

async function assertValidTaxonomy(startup) {
  const s = await getGrantSettings();

  const resolvedStage = resolveToKnownValue(startup.stage, s['grant.stages']);
  if (!resolvedStage) {
    throw new ApiError(400, `Invalid startup stage: ${startup.stage}`);
  }

  const resolvedCategory = resolveToKnownValue(startup.category, s['grant.categories']);
  if (!resolvedCategory) {
    throw new ApiError(400, `Invalid startup category: ${startup.category}`);
  }

  // Normalise the values in-place so downstream code (DB, admin view) always
  // sees a canonical value from the settings list, never a raw profile string.
  startup.stage = resolvedStage;
  startup.category = resolvedCategory;
}

// ─── STUDENT: CREATE / UPDATE DRAFT ─────────────────────────────────────
async function saveDraft(userId, input) {
  await assertValidTaxonomy(input.startup);

  const existing = await GrantApplication.findOne({ userId, status: STATUS.DRAFT });

  if (existing) {
    existing.founder = input.founder;
    existing.startup = input.startup;
    await existing.save();
    
    // Sync application details to User & Profile documents
    await syncApplicationToUserProfile(userId, input.founder, input.startup);
    
    return existing;
  }

  // A draft doesn't consume capacity or trip the duplicate rule - only a
  // submission does - but it must still be possible to apply at all.
  const s = await getGrantSettings();
  if (!s['grant.applications.enabled']) {
    throw new ApiError(403, 'Grant applications are currently closed.');
  }

  const application = await GrantApplication.create({
    applicationId: await generateApplicationId(),
    userId,
    founder: input.founder,
    startup: input.startup,
    status: STATUS.DRAFT,
  });

  await addTimelineEntry({
    applicationId: application._id,
    event: 'created',
    toStatus: STATUS.DRAFT,
    message: 'Application draft created.',
    actorId: userId,
    actorRole: 'student',
  });

  // Sync application details to User & Profile documents
  await syncApplicationToUserProfile(userId, input.founder, input.startup);

  return application;
}

// ─── STUDENT: SUBMIT ────────────────────────────────────────────────────
async function submitApplication(userId, applicationDbId, { termsAccepted }) {
  if (!termsAccepted) {
    throw new ApiError(400, 'You must accept the terms and conditions to submit.');
  }

  const application = await GrantApplication.findOne({ _id: applicationDbId, userId });
  if (!application) throw new ApiError(404, 'Application not found');

  // Re-check every gate at submit time. The student may have opened the form
  // before the deadline and pressed Submit after it.
  await assertCanSubmit(userId, { excludeApplicationId: application._id });
  await assertValidTaxonomy(application.startup);

  const from = application.status;
  assertTransition(from, STATUS.SUBMITTED);

  // Phase 1 is a free idea check - no documents required. Business plans, pitch
  // deck and financial models are collected in Phase 2 (Idea Evaluation), which
  // only unlocks after an admin accepts the idea.

  application.status = STATUS.SUBMITTED;
  application.submittedAt = new Date();
  application.termsAcceptedAt = new Date();
  application.revisionAllowed = false; // a fresh submission re-locks the form
  await application.save();

  await addTimelineEntry({
    applicationId: application._id,
    event: 'submitted',
    fromStatus: from,
    toStatus: STATUS.SUBMITTED,
    message: 'Application submitted for review.',
    actorId: userId,
    actorRole: 'student',
  });

  logActivity(userId, 'grant.submitted', 'Submitted a Startup Grant application', {
    applicationRef: application.applicationId,
  }).catch(() => {});

  await notifyStatusChange({ userId, application, status: STATUS.SUBMITTED });

  // Sync application details to User & Profile documents
  await syncApplicationToUserProfile(userId, application.founder, application.startup);

  return application;
}

// ─── STUDENT: READ (own only) ───────────────────────────────────────────
async function listMyApplications(userId) {
  const applications = await GrantApplication.find({ userId }).sort({ createdAt: -1 }).lean();
  if (applications.length === 0) return applications;

  // Attach the 5-phase journey state so the sidebar roadmap can unlock phases
  // (e.g. Idea Evaluation opens only once the idea is accepted) without the
  // frontend having to know which statuses map to which phase.
  const evaluations = await IdeaEvaluation.find({
    applicationId: { $in: applications.map(a => a._id) },
  }).lean();
  const evalByApp = new Map(evaluations.map(e => [String(e.applicationId), e]));

  return applications.map(app => {
    const { currentPhase, passedEvaluation, score, scoreRevealed, unlockedUpTo, phases } =
      computePhases(app, evalByApp.get(String(app._id)) || null);
    return { ...app, currentPhase, passedEvaluation, score, scoreRevealed, unlockedUpTo, phases };
  });
}

/**
 * Ownership is enforced in the QUERY, not by fetching then comparing. A
 * find-by-id followed by an `if (app.userId !== me)` is one early-return away
 * from leaking another founder's pitch.
 */
async function getMyApplication(userId, applicationDbId) {
  const application = await GrantApplication.findOne({ _id: applicationDbId, userId }).lean();
  if (!application) throw new ApiError(404, 'Application not found');

  const [timeline, documents, evaluation] = await Promise.all([
    ApplicationTimeline.find({ applicationId: application._id, visibleToStudent: true })
      .sort({ createdAt: -1 })
      .lean(),
    ApplicationDocument.find({ applicationId: application._id }).lean(),
    IdeaEvaluation.findOne({ applicationId: application._id }).lean(),
  ]);

  const { phases, currentPhase, passedEvaluation, score, scoreRevealed, unlockedUpTo } =
    computePhases(application, evaluation);

  return {
    ...application,
    editable: isEditable(application.status, application.revisionAllowed),
    statusLabel: STATUS_LABELS[application.status],
    phases,
    currentPhase,
    passedEvaluation,
    score,
    scoreRevealed,
    unlockedUpTo,
    timeline,
    documents,
  };
}

// ─── ADMIN: LIST ────────────────────────────────────────────────────────
async function listApplications({
  status,
  stage,
  category,
  search,
  sort = '-createdAt',
  page = 1,
  limit = 20,
} = {}) {
  const query = {};
  if (status) query.status = status;
  if (stage) query['startup.stage'] = stage;
  if (category) query['startup.category'] = category;

  if (search) {
    // Escaped: a founder named "C++ (x)" must not become a regex bomb.
    const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(safe, 'i');
    query.$or = [
      { applicationId: rx },
      { 'startup.name': rx },
      { 'founder.fullName': rx },
      { 'founder.email': rx },
    ];
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    GrantApplication.find(query)
      .sort(sort)
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    GrantApplication.countDocuments(query),
  ]);

  return {
    items: items.map(a => ({ ...a, statusLabel: STATUS_LABELS[a.status] })),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit) || 1,
    },
  };
}

// ─── ADMIN: STATS ───────────────────────────────────────────────────────
async function getStats() {
  const rows = await GrantApplication.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const byStatus = Object.fromEntries(rows.map(r => [r._id, r.count]));
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return {
    total,
    byStatus,
    // The headline numbers the admin dashboard asks for, derived - never
    // maintained as separate counters that can drift out of sync.
    pending: byStatus[STATUS.SUBMITTED] || 0,
    underReview: byStatus[STATUS.UNDER_REVIEW] || 0,
    shortlisted: byStatus[STATUS.SHORTLISTED] || 0,
    selected: byStatus[STATUS.SELECTED] || 0,
    rejected: byStatus[STATUS.REJECTED] || 0,
    grantApproved: byStatus[STATUS.GRANT_APPROVED] || 0,
  };
}

// ─── ADMIN: DETAIL ──────────────────────────────────────────────────────
async function getApplicationForAdmin(applicationDbId) {
  const application = await GrantApplication.findById(applicationDbId)
    .select('+internalNotes')
    .populate('userId', 'email fullName')
    .populate('reviewerId', 'email fullName')
    .lean();
  if (!application) throw new ApiError(404, 'Application not found');

  const [timeline, documents, comments, userProfile] = await Promise.all([
    ApplicationTimeline.find({ applicationId: application._id })
      .sort({ createdAt: -1 })
      .populate('actorId', 'fullName email')
      .lean(),
    ApplicationDocument.find({ applicationId: application._id }).lean(),
    ReviewComment.find({ applicationId: application._id })
      .sort({ createdAt: -1 })
      .populate('authorId', 'fullName email')
      .lean(),
    (async () => {
      const { Profile } = require('../profiles/profile.model');
      return Profile.findOne({ userId: application.userId?._id || application.userId }).lean();
    })(),
  ]);

  return {
    ...application,
    statusLabel: STATUS_LABELS[application.status],
    timeline,
    documents,
    comments,
    userProfile: userProfile || null,
  };
}

// ─── ADMIN: STATUS TRANSITION ───────────────────────────────────────────
/**
 * The only way an application's status is ever allowed to change.
 *
 * Every path - approve, reject, shortlist, select - funnels through here so that
 * the legality check, the timeline entry, the audit trail and the student
 * notification cannot be forgotten by a new caller.
 */
async function changeStatus({ applicationDbId, toStatus, adminUserId, reason = '', notify = true }) {
  const application = await GrantApplication.findById(applicationDbId);
  if (!application) throw new ApiError(404, 'Application not found');

  const from = application.status;
  assertTransition(from, toStatus);

  // Payment is a fact, not an admin opinion: an admin cannot hand-wave an
  // application into "paid" without a settled payment record.
  if (toStatus === STATUS.EVALUATION_PAID) {
    throw new ApiError(
      409,
      'Idea Evaluation Paid is set by a verified payment, not manually.'
    );
  }

  application.status = toStatus;
  application.lastActionBy = adminUserId;
  application.lastActionAt = new Date();

  // Moving back to "changes requested" is what re-opens the form for the student.
  if (toStatus === STATUS.CHANGES_REQUESTED) application.revisionAllowed = true;

  await application.save();

  await addTimelineEntry({
    applicationId: application._id,
    event: 'status_changed',
    fromStatus: from,
    toStatus,
    message: `Status changed from ${STATUS_LABELS[from]} to ${STATUS_LABELS[toStatus]}.`,
    reason,
    actorId: adminUserId,
    actorRole: 'admin',
  });

  if (notify) {
    await notifyStatusChange({
      userId: application.userId,
      application,
      status: toStatus,
      override: { reason },
    });
  }

  return application;
}

// ─── ADMIN: REVIEWER + NOTES ────────────────────────────────────────────
async function assignReviewer({ applicationDbId, reviewerId, adminUserId }) {
  const application = await GrantApplication.findByIdAndUpdate(
    applicationDbId,
    { $set: { reviewerId, lastActionBy: adminUserId, lastActionAt: new Date() } },
    { new: true }
  );
  if (!application) throw new ApiError(404, 'Application not found');

  await addTimelineEntry({
    applicationId: application._id,
    event: 'reviewer_assigned',
    message: 'A reviewer was assigned to this application.',
    actorId: adminUserId,
    actorRole: 'admin',
    // Who is reviewing is internal - the student sees only that review is underway.
    visibleToStudent: false,
    metadata: { reviewerId: String(reviewerId) },
  });

  return application;
}

async function addComment({ applicationDbId, authorId, comment, visibleToStudent = false }) {
  const application = await GrantApplication.findById(applicationDbId).select('_id');
  if (!application) throw new ApiError(404, 'Application not found');

  const created = await ReviewComment.create({
    applicationId: application._id,
    authorId,
    comment,
    visibleToStudent,
  });

  await addTimelineEntry({
    applicationId: application._id,
    event: 'comment_added',
    message: visibleToStudent ? comment : 'An internal note was added.',
    actorId: authorId,
    actorRole: 'admin',
    visibleToStudent,
  });

  return created;
}

async function setInternalNotes({ applicationDbId, notes, adminUserId }) {
  const application = await GrantApplication.findByIdAndUpdate(
    applicationDbId,
    { $set: { internalNotes: notes, lastActionBy: adminUserId, lastActionAt: new Date() } },
    { new: true }
  ).select('+internalNotes');
  if (!application) throw new ApiError(404, 'Application not found');
  return application;
}

/** Let a student edit a specific submitted application again. */
async function setRevisionAllowed({ applicationDbId, allowed, adminUserId }) {
  const application = await GrantApplication.findById(applicationDbId);
  if (!application) throw new ApiError(404, 'Application not found');
  if (isTerminal(application.status)) {
    throw new ApiError(409, `A ${STATUS_LABELS[application.status]} application cannot be reopened.`);
  }

  application.revisionAllowed = Boolean(allowed);
  application.lastActionBy = adminUserId;
  application.lastActionAt = new Date();
  await application.save();

  await addTimelineEntry({
    applicationId: application._id,
    event: allowed ? 'revision_enabled' : 'revision_disabled',
    message: allowed
      ? 'The applicant was allowed to revise this application.'
      : 'Revision access was withdrawn.',
    actorId: adminUserId,
    actorRole: 'admin',
  });

  return application;
}

/**
 * Syncs details from a Startup Grant/Incubation Application into the User and Profile models.
 * This guarantees that when a user registers/applies, all their detailed information
 * is saved dynamically and displayed in the Admin panel profile views.
 */
async function syncApplicationToUserProfile(userId, founder, startup) {
  try {
    const { Profile } = require('../profiles/profile.model');
    const { User } = require('../users/user.model');

    // 1. Update basic information on User collection
    const user = await User.findById(userId);
    if (user) {
      let userUpdated = false;
      if (founder?.fullName && user.fullName !== founder.fullName) {
        user.fullName = founder.fullName;
        userUpdated = true;
      }
      if (founder?.phone && user.phone !== founder.phone) {
        user.phone = founder.phone;
        // Keep phoneE164 aligned
        const { normalizePhone } = require('../../utils/phone');
        if (normalizePhone) {
          const parsed = normalizePhone(founder.phone);
          if (parsed.ok) {
            user.phoneE164 = parsed.e164;
          }
        }
        userUpdated = true;
      }
      if (founder?.city && user.city !== founder.city) {
        user.city = founder.city;
        userUpdated = true;
      }
      if (founder?.state && user.state !== founder.state) {
        user.state = founder.state;
        userUpdated = true;
      }
      if (userUpdated) {
        await user.save();
      }
    }

    // 2. Update role-specific metadata inside Profile collection
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({
        userId,
        role: user ? user.role : 'startup',
        dynamicProfileData: {},
      });
    }

    if (!profile.dynamicProfileData) {
      profile.dynamicProfileData = {};
    }

    // Merge founder details into dynamicProfileData
    if (founder) {
      if (founder.collegeName) profile.dynamicProfileData.collegeName = founder.collegeName;
      if (founder.university) profile.dynamicProfileData.university = founder.university;
      if (founder.city) profile.dynamicProfileData.city = founder.city;
      if (founder.state) profile.dynamicProfileData.state = founder.state;
    }

    // Merge startup details into dynamicProfileData.
    //
    // IMPORTANT: we deliberately do NOT sync startup.category → industry or
    // startup.stage → startupStage back into the profile. Those grant fields are
    // NORMALISED to the admin's grant taxonomy (e.g. a real industry of
    // "Logistics" resolves to the grant category "Other"). Writing them back would
    // silently clobber the user's own profile values. The profile is the source of
    // truth for industry/stage; the grant application only consumes them.
    if (startup) {
      if (startup.name) profile.dynamicProfileData.startupName = startup.name;
      if (startup.teamSize) profile.dynamicProfileData.teamSize = startup.teamSize;
      if (startup.problemStatement) profile.dynamicProfileData.problemStatement = startup.problemStatement;
      if (startup.solution) profile.dynamicProfileData.description = startup.solution;
      if (startup.targetAudience) profile.dynamicProfileData.targetAudience = startup.targetAudience;
      if (startup.businessModel) profile.dynamicProfileData.businessModel = startup.businessModel;
      if (startup.traction) profile.dynamicProfileData.traction = startup.traction;
      if (startup.fundingRaised) profile.dynamicProfileData.fundingStage = startup.fundingRaised;
      if (startup.website) profile.dynamicProfileData.website = startup.website;
      if (startup.linkedin) profile.dynamicProfileData.linkedin = startup.linkedin;
      if (startup.demoVideoUrl) profile.dynamicProfileData.demoVideoUrl = startup.demoVideoUrl;
    }

    profile.markModified('dynamicProfileData');
    await profile.save();
  } catch (err) {
    console.error('[Sync] Failed to sync grant application to user profile:', err);
  }
}

module.exports = {
  generateApplicationId,
  addTimelineEntry,
  assertCanSubmit,
  saveDraft,
  submitApplication,
  listMyApplications,
  getMyApplication,
  listApplications,
  getStats,
  getApplicationForAdmin,
  changeStatus,
  assignReviewer,
  addComment,
  setInternalNotes,
  setRevisionAllowed,
  syncApplicationToUserProfile,
};
