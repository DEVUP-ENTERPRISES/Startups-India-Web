const { EmailTemplate } = require('./crm.models');
const { logger } = require('../../infrastructure/observability/logger');

/**
 * Predefined, ready-to-send email templates.
 *
 * Seeded on boot (idempotent — matched by name) so an admin can pick a list, pick
 * a template, and press Start without writing any HTML. Merge tags ({{name}},
 * {{collegeName}} …) are filled per recipient; the unsubscribe footer and
 * open/click tracking are added automatically by the sender, so they are NOT in
 * the bodies here.
 */

// Shared branded shell so every template looks consistent.
const shell = (bodyHtml, ctaText, ctaUrl) => `
<div style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#e63946,#ff6b6b);padding:26px 30px;text-align:center;">
          <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.3px;">🚀 Startups India</div>
        </td></tr>
        <tr><td style="padding:34px 32px;color:#333;font-size:16px;line-height:1.7;">
          ${bodyHtml}
          ${ctaText ? `
          <div style="text-align:center;margin:30px 0 6px;">
            <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#e63946,#ff6b6b);color:#ffffff;text-decoration:none;padding:14px 34px;border-radius:10px;font-weight:700;font-size:15px;">${ctaText}</a>
          </div>` : ''}
        </td></tr>
        <tr><td style="background:#0e0e0e;padding:22px 30px;text-align:center;">
          <div style="color:#ffffff;font-size:14px;font-weight:800;">STARTUPS<span style="color:#ff6b6b;">INDIA</span></div>
          <div style="color:rgba(255,255,255,0.35);font-size:11px;margin-top:6px;">Empowering India's Entrepreneurial Ecosystem</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

const DEFAULT_TEMPLATES = [
  {
    name: 'Program Invitation',
    subject: '{{name}}, join the Startups India Incubation Program',
    htmlBody: shell(
      `<p style="margin:0 0 16px;">Hi <strong>{{name}}</strong>,</p>
       <p style="margin:0 0 16px;">We'd love to invite you to the <strong>Startups India Incubation Program</strong> — where founders get funding access, expert mentorship, and hands-on support to build and scale their startup.</p>
       <p style="margin:0 0 16px;">Applications are open now, and spots are limited. It only takes a few minutes to apply.</p>`,
      'Apply Now',
      'https://startupsindia.in/programs/incubation'
    ),
  },
  {
    name: 'Campus Outreach',
    subject: 'An opportunity for {{collegeName}} students',
    htmlBody: shell(
      `<p style="margin:0 0 16px;">Hi <strong>{{name}}</strong>,</p>
       <p style="margin:0 0 16px;">We're reaching out to talented students from <strong>{{collegeName}}</strong>. If you've ever thought about building your own startup, this is your chance.</p>
       <p style="margin:0 0 16px;">The Startups India Incubation Program gives student founders mentorship, funding pathways, and a community of builders — while you're still in college.</p>`,
      'Learn More & Apply',
      'https://startupsindia.in/campus-startup'
    ),
  },
  {
    name: 'Event Invitation',
    subject: "You're invited, {{name}} 🎉",
    htmlBody: shell(
      `<p style="margin:0 0 16px;">Hi <strong>{{name}}</strong>,</p>
       <p style="margin:0 0 16px;">You're invited to an exclusive Startups India event — a chance to meet mentors, investors, and fellow founders, and learn what it takes to build a successful startup.</p>
       <p style="margin:0 0 16px;">Seats are limited, so register early to reserve yours.</p>`,
      'Register for the Event',
      'https://startupsindia.in/events'
    ),
  },
  {
    name: 'Follow-up Reminder',
    subject: '{{name}}, did you get a chance to look?',
    htmlBody: shell(
      `<p style="margin:0 0 16px;">Hi <strong>{{name}}</strong>,</p>
       <p style="margin:0 0 16px;">Just following up on our earlier note about the Startups India Incubation Program. We didn't want you to miss the deadline.</p>
       <p style="margin:0 0 16px;">If you're serious about building your startup, this is one of the best ways to get started — with mentorship, funding access, and a strong founder community behind you.</p>`,
      'Apply Before It Closes',
      'https://startupsindia.in/programs/incubation'
    ),
  },
  {
    name: 'Welcome / Thank You',
    subject: 'Welcome aboard, {{name}}!',
    htmlBody: shell(
      `<p style="margin:0 0 16px;">Hi <strong>{{name}}</strong>,</p>
       <p style="margin:0 0 16px;">Thank you for your interest in Startups India! We're excited to have you as part of our growing community of founders and innovators.</p>
       <p style="margin:0 0 16px;">Explore our programs, mentors, and resources whenever you're ready — we're here to help you build.</p>`,
      'Explore Startups India',
      'https://startupsindia.in'
    ),
  },
];

/**
 * Insert any default templates that don't already exist (by name). Safe to run
 * on every boot. Never overwrites a template an admin has edited.
 */
async function seedDefaultTemplates(createdBy = null) {
  let created = 0;
  for (const tpl of DEFAULT_TEMPLATES) {
    const exists = await EmailTemplate.findOne({ name: tpl.name }).lean();
    if (!exists) {
      await EmailTemplate.create({ ...tpl, createdBy });
      created += 1;
    }
  }
  if (created > 0) logger.info('Seeded default CRM templates', { created });
  return { created };
}

module.exports = { seedDefaultTemplates, DEFAULT_TEMPLATES };
