const mongoose = require('mongoose');

/**
 * CRM bulk-email schema.
 *
 * Design notes:
 * - Imported leads are external contacts (no platform account), so they live in
 *   their own LeadContact collection, NOT the User collection. Push notifications
 *   therefore do not apply to them — they have no device/FCM token — email is the
 *   channel.
 * - Per-recipient rows (CampaignRecipient) are what make sending resumable and
 *   follow-ups possible: the worker drains "queued" rows, and after the fact you
 *   can target "not opened" / "bounced".
 */

// ─── LEAD LIST (a saved, re-selectable import) ──────────────────────────
const leadListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    sourceFileName: { type: String, default: null },
    // How the spreadsheet columns were mapped, kept for audit / re-import.
    columnMapping: { type: mongoose.Schema.Types.Mixed, default: {} },
    contactCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// ─── LEAD CONTACT (each spreadsheet row) ────────────────────────────────
const leadContactSchema = new mongoose.Schema(
  {
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadList', required: true, index: true },
    name: { type: String, default: '', trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    collegeName: { type: String, default: '', trim: true },
    additional1: { type: String, default: '' },
    additional2: { type: String, default: '' },
    additional3: { type: String, default: '' },
    // A contact unsubscribed via a specific list's email; also globally
    // suppressed (see EmailSuppression) so no list can reach them again.
    unsubscribed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// One email appears at most once per list — re-importing the same file dedupes.
leadContactSchema.index({ listId: 1, email: 1 }, { unique: true });

// ─── EMAIL TEMPLATE (merge-tag body) ────────────────────────────────────
const emailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    // HTML with {{name}}, {{collegeName}}, {{email}}, {{additional1}} … tags.
    htmlBody: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// ─── EMAIL CAMPAIGN (a send job) ────────────────────────────────────────
const emailCampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadList', required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', required: true },
    // Frozen snapshot at start so editing the template mid-send can't change
    // what half the recipients get.
    subjectSnapshot: { type: String, default: '' },
    htmlSnapshot: { type: String, default: '' },

    status: {
      type: String,
      enum: ['draft', 'sending', 'paused', 'completed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    // Hard daily ceiling. Defaults to the admin setting; the worker never sends
    // more than this many in a rolling 24h window across the whole system.
    dailyCap: { type: Number, default: 100 },

    stats: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
      bounced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      unsubscribed: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 },
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ─── CAMPAIGN RECIPIENT (per-person send record) ────────────────────────
const campaignRecipientSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailCampaign', required: true, index: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadContact', required: true },
    email: { type: String, required: true, lowercase: true },

    status: {
      type: String,
      enum: ['queued', 'sending', 'sent', 'opened', 'clicked', 'bounced', 'failed', 'skipped', 'unsubscribed'],
      default: 'queued',
      index: true,
    },
    // Opaque token used in tracking + unsubscribe URLs so raw ids never leak.
    trackingToken: { type: String, required: true, unique: true },
    error: { type: String, default: '' },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date, default: null },
    openedAt: { type: Date, default: null },
    clickedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
// The worker claims work with this: oldest queued rows for a campaign.
campaignRecipientSchema.index({ campaignId: 1, status: 1, createdAt: 1 });

// ─── SUPPRESSION (never email again) ────────────────────────────────────
const emailSuppressionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    reason: { type: String, enum: ['unsubscribed', 'hard_bounce', 'complaint', 'manual'], required: true },
  },
  { timestamps: true }
);

// ─── SENT-EMAIL LEDGER (for the rolling daily cap) ──────────────────────
// One row per actual send, with a TTL so it self-cleans. Counting rows in the
// last 24h is how the worker enforces the 100/day ceiling without a cron.
const emailSendLogSchema = new mongoose.Schema({
  sentAt: { type: Date, default: Date.now },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailCampaign' },
});
emailSendLogSchema.index({ sentAt: 1 }, { expireAfterSeconds: 60 * 60 * 48 }); // keep 48h

const LeadList = mongoose.model('LeadList', leadListSchema);
const LeadContact = mongoose.model('LeadContact', leadContactSchema);
const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);
const CampaignRecipient = mongoose.model('CampaignRecipient', campaignRecipientSchema);
const EmailSuppression = mongoose.model('EmailSuppression', emailSuppressionSchema);
const EmailSendLog = mongoose.model('EmailSendLog', emailSendLogSchema);

module.exports = {
  LeadList,
  LeadContact,
  EmailTemplate,
  EmailCampaign,
  CampaignRecipient,
  EmailSuppression,
  EmailSendLog,
};
