const crypto = require('crypto');
const env = require('../../config/env');
const { ApiError } = require('../../utils/apiError');
const { logger } = require('../../infrastructure/observability/logger');
const { sendEmail } = require('../../utils/emailService');
const templateService = require('./crm.template.service');
const { wrap } = require('../../utils/emailTemplates');
const {
  LeadList, LeadContact, EmailTemplate, EmailCampaign, CampaignRecipient,
  EmailSuppression, EmailSendLog,
} = require('./crm.models');

/**
 * Campaign engine + a Mongo-backed drain worker.
 *
 * Sending is NOT done in the request that starts a campaign — 100 emails (or a
 * resumed campaign after a restart) can't run inside one HTTP call. Instead we
 * write one queued CampaignRecipient per contact and a background worker drains
 * them, so the whole thing survives restarts and respects a hard daily cap.
 */

const BATCH = 10;            // recipients claimed per tick
const SEND_GAP_MS = 400;     // gentle pause between individual sends
const TICK_MS = env.NODE_ENV === 'test' ? 250 : 8000;

// ─── TRACKING INJECTION ─────────────────────────────────────────────────
function trackingUrls(token) {
  const base = `${env.API_PUBLIC_URL}/api/v1/crm/track`;
  return {
    open: `${base}/open/${token}.png`,
    clickBase: `${base}/click/${token}`,
    unsubscribe: `${env.API_PUBLIC_URL}/api/v1/crm/unsubscribe/${token}`,
  };
}

// Rewrites every http(s) link to route through our click tracker, appends a 1px
// open pixel, and adds a plain-text unsubscribe footer. Recipients' opens/clicks
// then land on our API and update their status — the basis for follow-ups.
function withTracking(html, token, subject = 'From Startups India') {
  const t = trackingUrls(token);

  const rewritten = html.replace(/href\s*=\s*"(https?:\/\/[^"]+)"/gi, (m, url) => {
    // Never rewrite the unsubscribe link itself.
    if (url.includes('/crm/unsubscribe/')) return m;
    return `href="${t.clickBase}?u=${encodeURIComponent(url)}"`;
  });

  const pixel = `<img src="${t.open}" width="1" height="1" alt="" style="display:none" />`;
  
  const innerHtml = `
    <tr>
      <td style="padding:36px 32px 28px; font-family: sans-serif; font-size: 15px; color: #444; line-height: 1.85;">
        ${rewritten}
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,0,0,0.07),transparent);"></div>
      </td>
    </tr>
  `;

  const finalHtml = wrap(
    subject, // Preheader
    'Startups India Campaign', // Top Bar Text
    innerHtml,
    t.unsubscribe // Unsubscribe URL
  );

  return `${finalHtml}${pixel}`;
}

// ─── DAILY CAP ──────────────────────────────────────────────────────────
async function sentInLast24h() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return EmailSendLog.countDocuments({ sentAt: { $gte: since } });
}

// ─── CREATE / START / CONTROL ───────────────────────────────────────────
async function listCampaigns() {
  return EmailCampaign.find({})
    .populate('listId', 'name contactCount')
    .populate('templateId', 'name')
    .sort({ createdAt: -1 })
    .lean();
}

async function getCampaign(id) {
  const c = await EmailCampaign.findById(id)
    .populate('listId', 'name contactCount')
    .populate('templateId', 'name')
    .lean();
  if (!c) throw new ApiError(404, 'Campaign not found');
  return c;
}

async function createCampaign({ name, listId, templateId, dailyCap, createdBy }) {
  if (!name?.trim()) throw new ApiError(400, 'Campaign name is required.');
  const list = await LeadList.findById(listId);
  if (!list) throw new ApiError(404, 'Lead list not found');
  const template = await EmailTemplate.findById(templateId);
  if (!template) throw new ApiError(404, 'Template not found');

  return EmailCampaign.create({
    name: name.trim(),
    listId,
    templateId,
    dailyCap: dailyCap && dailyCap > 0 ? dailyCap : env.CRM_DAILY_CAP,
    stats: { total: 0 },
    createdBy,
  });
}

/**
 * Move a draft to 'sending': snapshot the template, and enqueue one recipient
 * per eligible contact (skipping unsubscribed + globally suppressed emails).
 */
async function startCampaign(id) {
  const campaign = await EmailCampaign.findById(id);
  if (!campaign) throw new ApiError(404, 'Campaign not found');
  if (campaign.status === 'sending') throw new ApiError(409, 'Campaign is already sending.');
  if (['completed', 'cancelled'].includes(campaign.status)) {
    throw new ApiError(409, `Campaign is ${campaign.status} and cannot be restarted.`);
  }

  const template = await EmailTemplate.findById(campaign.templateId).lean();
  if (!template) throw new ApiError(404, 'Template not found');

  // Only enqueue once (a paused→resume must not duplicate recipients).
  const already = await CampaignRecipient.countDocuments({ campaignId: campaign._id });
  if (already === 0) {
    const contacts = await LeadContact.find({ listId: campaign.listId }).lean();
    const suppressed = new Set(
      (await EmailSuppression.find({}, 'email').lean()).map(s => s.email)
    );

    let skipped = 0;
    const recipients = [];
    for (const c of contacts) {
      if (c.unsubscribed || suppressed.has(c.email)) { skipped += 1; continue; }
      recipients.push({
        campaignId: campaign._id,
        contactId: c._id,
        email: c.email,
        status: 'queued',
        trackingToken: crypto.randomBytes(16).toString('hex'),
      });
    }
    if (recipients.length) await CampaignRecipient.insertMany(recipients, { ordered: false }).catch(() => {});

    campaign.subjectSnapshot = template.subject;
    campaign.htmlSnapshot = template.htmlBody;
    campaign.stats.total = recipients.length;
    campaign.stats.skipped = skipped;
  }

  campaign.status = 'sending';
  campaign.startedAt = campaign.startedAt || new Date();
  await campaign.save();

  kickWorker();
  return campaign;
}

async function pauseCampaign(id) {
  const c = await EmailCampaign.findById(id);
  if (!c) throw new ApiError(404, 'Campaign not found');
  if (c.status !== 'sending') throw new ApiError(409, 'Only a sending campaign can be paused.');
  c.status = 'paused';
  await c.save();
  return c;
}

async function cancelCampaign(id) {
  const c = await EmailCampaign.findById(id);
  if (!c) throw new ApiError(404, 'Campaign not found');
  if (['completed', 'cancelled'].includes(c.status)) throw new ApiError(409, `Already ${c.status}.`);
  c.status = 'cancelled';
  c.completedAt = new Date();
  await c.save();
  return c;
}

// ─── THE WORKER ─────────────────────────────────────────────────────────
let ticking = false;

async function processCampaign(campaign, budgetLeft) {
  if (budgetLeft <= 0) return 0;

  let sentThisRun = 0;
  for (let i = 0; i < BATCH && sentThisRun < budgetLeft; i += 1) {
    // Atomically claim the oldest queued recipient so no two ticks send it.
    const recipient = await CampaignRecipient.findOneAndUpdate(
      { campaignId: campaign._id, status: 'queued' },
      { $set: { status: 'sending' }, $inc: { attempts: 1 } },
      { sort: { createdAt: 1 }, new: true }
    );
    if (!recipient) break; // nothing left queued

    // Last-second suppression check (someone may have unsubscribed since enqueue).
    const suppressed = await EmailSuppression.exists({ email: recipient.email });
    if (suppressed) {
      recipient.status = 'unsubscribed';
      await recipient.save();
      await EmailCampaign.updateOne({ _id: campaign._id }, { $inc: { 'stats.unsubscribed': 1 } });
      continue;
    }

    const contact = await LeadContact.findById(recipient.contactId).lean();
    const subject = templateService.render(campaign.subjectSnapshot, contact, { escape: false });
    const bodyHtml = templateService.render(campaign.htmlSnapshot, contact);
    const html = withTracking(bodyHtml, recipient.trackingToken, subject);

    try {
      const result = await sendEmail({ to: recipient.email, subject, html });
      if (result && result.skipped) {
        // SMTP not configured — treat as failed rather than silently "sent".
        recipient.status = 'failed';
        recipient.error = 'Email transport not configured';
        await recipient.save();
        await EmailCampaign.updateOne({ _id: campaign._id }, { $inc: { 'stats.failed': 1 } });
      } else {
        recipient.status = 'sent';
        recipient.sentAt = new Date();
        await recipient.save();
        await EmailSendLog.create({ campaignId: campaign._id });
        await EmailCampaign.updateOne({ _id: campaign._id }, { $inc: { 'stats.sent': 1 } });
        sentThisRun += 1;
      }
    } catch (err) {
      recipient.status = 'failed';
      recipient.error = err.message?.slice(0, 300) || 'send failed';
      await recipient.save();
      await EmailCampaign.updateOne({ _id: campaign._id }, { $inc: { 'stats.failed': 1 } });
    }

    if (SEND_GAP_MS) await new Promise(r => setTimeout(r, SEND_GAP_MS));
  }

  // Completed when nothing is queued or sending anymore.
  const remaining = await CampaignRecipient.countDocuments({
    campaignId: campaign._id, status: { $in: ['queued', 'sending'] },
  });
  if (remaining === 0) {
    await EmailCampaign.updateOne(
      { _id: campaign._id, status: 'sending' },
      { $set: { status: 'completed', completedAt: new Date() } }
    );
  }

  return sentThisRun;
}

async function tick() {
  if (ticking) return;
  ticking = true;
  try {
    const campaigns = await EmailCampaign.find({ status: 'sending' }).sort({ startedAt: 1 });
    if (campaigns.length === 0) return;

    const cap = campaigns[0].dailyCap || env.CRM_DAILY_CAP;
    let budget = cap - (await sentInLast24h());
    if (budget <= 0) {
      // Cap reached for the day — do nothing this tick; it'll free up as the
      // rolling window advances.
      return;
    }

    for (const campaign of campaigns) {
      if (budget <= 0) break;
      const sent = await processCampaign(campaign, budget);
      budget -= sent;
    }
  } catch (err) {
    logger.error('CRM worker tick failed', { error: err.message });
  } finally {
    ticking = false;
  }
}

let interval = null;
function kickWorker() {
  // Fire one tick promptly when a campaign starts, without waiting for the timer.
  setImmediate(() => tick().catch(() => {}));
}

async function startWorker() {
  // Recover recipients stuck mid-send by a restart.
  await CampaignRecipient.updateMany({ status: 'sending' }, { $set: { status: 'queued' } }).catch(() => {});
  if (interval) clearInterval(interval);
  interval = setInterval(() => tick().catch(() => {}), TICK_MS);
  if (interval.unref) interval.unref();
  logger.info('CRM email worker started', { tickMs: TICK_MS, dailyCap: env.CRM_DAILY_CAP });
}

function stopWorker() {
  if (interval) clearInterval(interval);
  interval = null;
}

module.exports = {
  withTracking,
  sentInLast24h,
  listCampaigns,
  getCampaign,
  createCampaign,
  startCampaign,
  pauseCampaign,
  cancelCampaign,
  startWorker,
  stopWorker,
  tick, // exported for tests
};
