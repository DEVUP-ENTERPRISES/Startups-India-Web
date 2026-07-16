const mongoose = require('mongoose');
const { ALL_STATUSES, STATUS } = require('./grant.status');

/**
 * Grant workflow schema.
 *
 * Deliberately NOT one fat document: the timeline, documents, evaluation and
 * payment each grow independently and are queried on their own, so they get their
 * own collections linked by applicationId. Embedding the timeline would make every
 * list query drag an ever-growing array along with it.
 *
 * Notifications and audit logs are NOT redefined here — the platform already has
 * Notification and AuditLog/Activity, and forking them would leave the bell icon
 * reading one collection while grants wrote to another.
 */

// ─── GRANT APPLICATION ────────────────────────────────────────────────
const grantApplicationSchema = new mongoose.Schema(
  {
    // Human-facing reference, e.g. GRANT-2026-000125. Unique + immutable.
    applicationId: { type: String, required: true, unique: true, trim: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // ── Founder details ──
    founder: {
      fullName: { type: String, required: true, trim: true, maxlength: 120 },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      collegeName: { type: String, trim: true, maxlength: 200 },
      university: { type: String, trim: true, maxlength: 200 },
      city: { type: String, trim: true, maxlength: 100 },
      state: { type: String, trim: true, maxlength: 100 },
    },

    // ── Startup details ──
    startup: {
      name: { type: String, required: true, trim: true, maxlength: 160 },
      // Free strings, validated at the service boundary against the admin-editable
      // grant.stages / grant.categories lists — an enum here would mean a code
      // change every time the admin adds a category.
      stage: { type: String, required: true, trim: true },
      category: { type: String, required: true, trim: true },
      teamSize: { type: Number, min: 1, max: 10000 },
      problemStatement: { type: String, required: true, trim: true, maxlength: 5000 },
      solution: { type: String, required: true, trim: true, maxlength: 5000 },
      targetAudience: { type: String, trim: true, maxlength: 2000 },
      businessModel: { type: String, trim: true, maxlength: 3000 },
      traction: { type: String, trim: true, maxlength: 3000 },
      fundingRaised: { type: String, trim: true, maxlength: 200 },
      website: { type: String, trim: true, maxlength: 500 },
      linkedin: { type: String, trim: true, maxlength: 500 },
      demoVideoUrl: { type: String, trim: true, maxlength: 500 },
    },

    status: { type: String, enum: ALL_STATUSES, default: STATUS.DRAFT, index: true },

    // Admin can unlock a single application for edits without unlocking everyone.
    revisionAllowed: { type: Boolean, default: false },

    termsAcceptedAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },

    // Denormalised for admin list sorting/filtering without a join.
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    lastActionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    lastActionAt: { type: Date, default: null },

    // Free-form admin-only notes. Never exposed on any student-facing route.
    internalNotes: { type: String, default: '', maxlength: 10000, select: false },
  },
  { timestamps: true }
);

// Admin dashboard: filter by status, newest first.
grantApplicationSchema.index({ status: 1, createdAt: -1 });
// Student dashboard: "my applications".
grantApplicationSchema.index({ userId: 1, createdAt: -1 });
// Free-text search across the admin list.
grantApplicationSchema.index({ 'startup.name': 'text', 'founder.fullName': 'text', applicationId: 'text' });

// ─── TIMELINE ─────────────────────────────────────────────────────────
// Append-only. Every status change, note, payment and meeting lands here, which
// is what makes the "complete timeline" in the spec truthful rather than derived.
const applicationTimelineSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'GrantApplication', required: true, index: true,
    },
    // e.g. 'status_changed', 'submitted', 'payment_completed', 'meeting_scheduled'
    event: { type: String, required: true },
    fromStatus: { type: String, default: null },
    toStatus: { type: String, default: null },
    message: { type: String, default: '', maxlength: 2000 },
    reason: { type: String, default: '', maxlength: 2000 },
    // Null for system-generated entries.
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    actorRole: { type: String, default: 'system' },
    // Entries the student must never see (internal review chatter).
    visibleToStudent: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

applicationTimelineSchema.index({ applicationId: 1, createdAt: -1 });

// ─── DOCUMENTS ────────────────────────────────────────────────────────
// Only S3 keys/URLs live here — the platform never stores file bytes in Mongo.
const applicationDocumentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'GrantApplication', required: true, index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kind: {
      type: String,
      enum: ['pitch_deck', 'business_plan', 'product_image', 'demo_video'],
      required: true,
    },
    fileName: { type: String, required: true, trim: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    // S3 object key. The URL is signed on demand rather than stored, so a leaked
    // DB row does not hand out permanent public access to a founder's pitch deck.
    key: { type: String, required: true },
    url: { type: String, default: null },
  },
  { timestamps: true }
);

applicationDocumentSchema.index({ applicationId: 1, kind: 1 });

// ─── IDEA EVALUATION ──────────────────────────────────────────────────
const ideaEvaluationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'GrantApplication', required: true, unique: true,
    },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },

    // ── Meeting ──
    meeting: {
      mode: { type: String, enum: ['google_meet', 'zoom', 'physical', null], default: null },
      scheduledAt: { type: Date, default: null },
      link: { type: String, default: null, trim: true },
      location: { type: String, default: null, trim: true },
      scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },

    // ── Result ──
    // Criteria are admin-configurable, so scores are a map rather than fixed
    // columns: adding "Team" as a criterion must not require a migration.
    scores: { type: Map, of: Number, default: undefined },
    totalScore: { type: Number, default: null },
    maxScore: { type: Number, default: null },
    comments: { type: String, default: '', maxlength: 5000 },
    recommendation: {
      type: String,
      enum: ['reject', 'needs_improvement', 'recommended', 'funding_ready', null],
      default: null,
    },
    submittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ─── EVALUATION PAYMENT ───────────────────────────────────────────────
// The fee actually charged is frozen here at order time. If an admin changes the
// fee mid-flight, an in-progress checkout must still settle at the price the
// student was shown — and we must be able to prove what that price was.
const evaluationPaymentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'GrantApplication', required: true, index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    provider: { type: String, enum: ['razorpay'], default: 'razorpay' },
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, default: null },
    signature: { type: String, default: null },

    // Minor units (paise). Never floats.
    currency: { type: String, required: true },
    baseAmount: { type: Number, required: true },
    gstPercent: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
      index: true,
    },
    invoiceNumber: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// A given Razorpay order can only ever be captured once.
evaluationPaymentSchema.index({ orderId: 1, status: 1 });

// ─── REVIEW COMMENTS ──────────────────────────────────────────────────
const reviewCommentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'GrantApplication', required: true, index: true,
    },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true, trim: true, maxlength: 5000 },
    // Internal by default: a reviewer's candid note is not student-facing unless
    // someone deliberately shares it.
    visibleToStudent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewCommentSchema.index({ applicationId: 1, createdAt: -1 });

// ─── COUNTER (for GRANT-YYYY-NNNNNN) ──────────────────────────────────
// A dedicated atomic counter per year. Deriving the next number from
// count()+1 would hand two concurrent submissions the same ID.
const grantCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // the year, e.g. "2026"
  seq: { type: Number, default: 0 },
});

const GrantApplication = mongoose.model('GrantApplication', grantApplicationSchema);
const ApplicationTimeline = mongoose.model('ApplicationTimeline', applicationTimelineSchema);
const ApplicationDocument = mongoose.model('ApplicationDocument', applicationDocumentSchema);
const IdeaEvaluation = mongoose.model('IdeaEvaluation', ideaEvaluationSchema);
const EvaluationPayment = mongoose.model('EvaluationPayment', evaluationPaymentSchema);
const ReviewComment = mongoose.model('ReviewComment', reviewCommentSchema);
const GrantCounter = mongoose.model('GrantCounter', grantCounterSchema);

module.exports = {
  GrantApplication,
  ApplicationTimeline,
  ApplicationDocument,
  IdeaEvaluation,
  EvaluationPayment,
  ReviewComment,
  GrantCounter,
};
