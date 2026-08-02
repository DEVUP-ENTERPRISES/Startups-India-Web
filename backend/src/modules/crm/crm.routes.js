const express = require('express');
const { z } = require('zod');
const { asyncHandler } = require('../../utils/asyncHandler');
const { validateBody } = require('../../middlewares/validateBody');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');
const importService = require('./crm.import.service');
const templateService = require('./crm.template.service');
const campaignService = require('./crm.campaign.service');
const trackingService = require('./crm.tracking.service');
const { LeadList, LeadContact, CampaignRecipient } = require('./crm.models');
const { ApiError } = require('../../utils/apiError');

const router = express.Router();

// ─── PUBLIC TRACKING (no auth - hit by recipients' email clients) ───────
// Open pixel. Always returns the 1x1 gif, even on a bad token, so a broken
// link never shows a broken image in someone's inbox.
router.get('/track/open/:token.png', asyncHandler(async (req, res) => {
  await trackingService.recordOpen(req.params.token).catch(() => {});
  res.set('Content-Type', 'image/gif');
  res.set('Cache-Control', 'no-store, must-revalidate');
  res.send(trackingService.PIXEL);
}));
// Some clients strip the ".png"; accept the bare token too.
router.get('/track/open/:token', asyncHandler(async (req, res) => {
  await trackingService.recordOpen(req.params.token.replace(/\.png$/, '')).catch(() => {});
  res.set('Content-Type', 'image/gif');
  res.set('Cache-Control', 'no-store, must-revalidate');
  res.send(trackingService.PIXEL);
}));

// Click redirect.
router.get('/track/click/:token', asyncHandler(async (req, res) => {
  const url = await trackingService.recordClick(req.params.token, req.query.u || '');
  if (!url) return res.status(400).send('Invalid link');
  res.redirect(url);
}));

// Unsubscribe (GET so it works straight from an email link).
router.get('/unsubscribe/:token', asyncHandler(async (req, res) => {
  const result = await trackingService.unsubscribe(req.params.token);
  res.set('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head>
    <body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;color:#333;">
      <h2>${result.ok ? "You've been unsubscribed" : 'Link not recognised'}</h2>
      <p style="color:#666;">${result.ok ? "You won't receive further emails from us." : 'This unsubscribe link is invalid or has expired.'}</p>
    </body></html>`);
}));

// ─── ADMIN (everything below requires an admin) ─────────────────────────
router.use(authRequired, requireRole('admin'));

// Large JSON bodies: an imported list of 7,000 rows is a few MB.
const bigJson = express.json({ limit: '25mb' });

// ── Lead lists ──
router.get('/lists', asyncHandler(async (req, res) => {
  const lists = await LeadList.find({}).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: lists });
}));

router.get('/lists/:id', asyncHandler(async (req, res) => {
  const list = await LeadList.findById(req.params.id).lean();
  if (!list) throw new ApiError(404, 'List not found');
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
  const [contacts, total] = await Promise.all([
    LeadContact.find({ listId: list._id }).skip((page - 1) * limit).limit(limit).lean(),
    LeadContact.countDocuments({ listId: list._id }),
  ]);
  res.json({ success: true, data: { list, contacts, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } } });
}));

// Preview: client sends parsed headers + sample rows, gets a suggested mapping.
router.post('/lists/suggest-mapping', bigJson, validateBody(z.object({ headers: z.array(z.string()) })),
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: { mapping: importService.suggestMapping(req.body.headers), fields: importService.MAPPABLE_FIELDS } });
  }));

// Create a list from client-parsed rows + a column mapping.
router.post('/lists', bigJson, validateBody(z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(500).optional().default(''),
  sourceFileName: z.string().max(260).optional().default(''),
  mapping: z.record(z.string()),
  rows: z.array(z.record(z.any())).min(1),
})), asyncHandler(async (req, res) => {
  const result = await importService.createListFromRows({ ...req.body, createdBy: req.user.userId });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/lists/:id', asyncHandler(async (req, res) => {
  const list = await LeadList.findByIdAndDelete(req.params.id);
  if (!list) throw new ApiError(404, 'List not found');
  await LeadContact.deleteMany({ listId: list._id });
  res.json({ success: true, data: { deleted: true } });
}));

// ── Templates ──
router.get('/templates', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await templateService.listTemplates() });
}));
router.get('/templates/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await templateService.getTemplate(req.params.id) });
}));
router.post('/templates', validateBody(z.object({
  name: z.string().min(1).max(160), subject: z.string().min(1).max(300), htmlBody: z.string().min(1),
})), asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await templateService.createTemplate({ ...req.body, createdBy: req.user.userId }) });
}));
router.put('/templates/:id', validateBody(z.object({
  name: z.string().min(1).max(160).optional(), subject: z.string().min(1).max(300).optional(), htmlBody: z.string().min(1).optional(),
})), asyncHandler(async (req, res) => {
  res.json({ success: true, data: await templateService.updateTemplate(req.params.id, req.body) });
}));
router.delete('/templates/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await templateService.deleteTemplate(req.params.id) });
}));
router.post('/templates/preview', validateBody(z.object({
  subject: z.string(), htmlBody: z.string(),
})), asyncHandler(async (req, res) => {
  res.json({ success: true, data: templateService.preview({ subject: req.body.subject, htmlBody: req.body.htmlBody }) });
}));
// Restore the predefined starter templates (any that were deleted).
router.post('/templates/seed-defaults', asyncHandler(async (req, res) => {
  const { seedDefaultTemplates } = require('./crm.templates.seed');
  const result = await seedDefaultTemplates(req.user.userId);
  res.json({ success: true, data: result });
}));

// ── Campaigns ──
router.get('/campaigns', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await campaignService.listCampaigns() });
}));
router.get('/campaigns/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await campaignService.getCampaign(req.params.id) });
}));
router.post('/campaigns', validateBody(z.object({
  name: z.string().min(1).max(160),
  listId: z.string().regex(/^[a-f\d]{24}$/i),
  templateId: z.string().regex(/^[a-f\d]{24}$/i),
  dailyCap: z.coerce.number().int().positive().optional(),
})), asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await campaignService.createCampaign({ ...req.body, createdBy: req.user.userId }) });
}));
router.post('/campaigns/:id/start', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await campaignService.startCampaign(req.params.id) });
}));
router.post('/campaigns/:id/pause', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await campaignService.pauseCampaign(req.params.id) });
}));
router.post('/campaigns/:id/cancel', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await campaignService.cancelCampaign(req.params.id) });
}));

module.exports = { crmRouter: router };
