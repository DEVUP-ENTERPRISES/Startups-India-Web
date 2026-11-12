const crypto = require('crypto');
const env = require('../../config/env');
const { CampaignRecipient, EmailCampaign, LeadContact, EmailSuppression } = require('./crm.models');

// Binds a click URL to the email it was sent in, so the tracker cannot be used as an open redirect.
function clickSignature(token, url) {
  return crypto.createHmac('sha256', `crm-click:${env.JWT_ACCESS_SECRET}`).update(`${token}|${url}`).digest('hex').slice(0, 32);
}

function signatureMatches(token, url, sig) {
  const expected = Buffer.from(clickSignature(token, url));
  const given = Buffer.from(String(sig || ''));
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

// 1x1 transparent GIF, served for open tracking.
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

/**
 * Record an open. Called by the tracking pixel embedded in each email.
 * First open flips the recipient to 'opened' and bumps the campaign counter;
 * later opens by the same recipient don't double-count.
 */
async function recordOpen(token) {
  const r = await CampaignRecipient.findOne({ trackingToken: token });
  if (!r) return;
  // Only count the first open, and never downgrade a 'clicked' recipient.
  if (!r.openedAt) {
    r.openedAt = new Date();
    if (r.status === 'sent') r.status = 'opened';
    await r.save();
    await EmailCampaign.updateOne({ _id: r.campaignId }, { $inc: { 'stats.opened': 1 } });
  }
}

/**
 * Record a click and return the original URL to redirect to.
 * A click implies an open, so it also fills openedAt if the pixel never loaded
 * (many clients block images but not clicks).
 */
async function recordClick(token, url, sig) {
  if (!/^https?:\/\//i.test(url)) return null;
  // Unsigned links predate signing and are honoured only for a real recipient token.
  if (sig && !signatureMatches(token, url, sig)) return null;
  const r = await CampaignRecipient.findOne({ trackingToken: token });
  if (!sig && !r) return null;
  if (r) {
    const updates = {};
    if (!r.clickedAt) {
      r.clickedAt = new Date();
      r.status = 'clicked';
      updates.click = true;
    }
    if (!r.openedAt) {
      r.openedAt = new Date();
      updates.open = true;
    }
    if (updates.click || updates.open) {
      await r.save();
      const inc = {};
      if (updates.click) inc['stats.clicked'] = 1;
      if (updates.open) inc['stats.opened'] = 1;
      await EmailCampaign.updateOne({ _id: r.campaignId }, { $inc: inc });
    }
  }
  return url;
}

/**
 * Unsubscribe the recipient behind a token: mark them in the list, add a global
 * suppression so no campaign can reach them again, and count it on the campaign.
 */
async function unsubscribe(token) {
  const r = await CampaignRecipient.findOne({ trackingToken: token });
  if (!r) return { ok: false };

  await LeadContact.updateMany({ email: r.email }, { $set: { unsubscribed: true } });
  await EmailSuppression.updateOne(
    { email: r.email },
    { $setOnInsert: { email: r.email, reason: 'unsubscribed' } },
    { upsert: true }
  );

  if (r.status !== 'unsubscribed') {
    r.status = 'unsubscribed';
    await r.save();
    await EmailCampaign.updateOne({ _id: r.campaignId }, { $inc: { 'stats.unsubscribed': 1 } });
  }
  return { ok: true, email: r.email };
}

module.exports = {
  clickSignature, PIXEL, recordOpen, recordClick, unsubscribe };
