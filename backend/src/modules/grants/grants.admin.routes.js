const express = require('express');
const { z } = require('zod');
const { asyncHandler } = require('../../utils/asyncHandler');
const { validateBody } = require('../../middlewares/validateBody');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');
const grantService = require('./grant.service');
const documentsService = require('./grant.documents.service');
const evaluationService = require('./grant.evaluation.service');
const paymentService = require('./grant.payment.service');
const { getGrantSettings, updateGrantSettings, SCHEMA } = require('./grant.settings');
const { ALL_STATUSES, STATUS_LABELS, TRANSITIONS } = require('./grant.status');

const router = express.Router();

// Admin-only, and mounted under the secret admin slug by the caller. Two
// independent gates: knowing the URL is not authorisation.
router.use(authRequired, requireRole('admin'));

// ─── DASHBOARD ──────────────────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await grantService.getStats() });
  })
);

router.get(
  '/applications',
  asyncHandler(async (req, res) => {
    const data = await grantService.listApplications({
      status: req.query.status,
      stage: req.query.stage,
      category: req.query.category,
      search: req.query.search,
      sort: req.query.sort,
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json({ success: true, data });
  })
);

router.get(
  '/applications/:id',
  asyncHandler(async (req, res) => {
    const data = await grantService.getApplicationForAdmin(req.params.id);
    res.json({ success: true, data });
  })
);

// The UI renders its action buttons from this rather than hardcoding which
// buttons are legal in which state — so the machine stays the single authority.
router.get(
  '/status-machine',
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: { statuses: ALL_STATUSES, labels: STATUS_LABELS, transitions: TRANSITIONS },
    });
  })
);

// ─── ACTIONS ────────────────────────────────────────────────────────────
// Approve / reject / shortlist / select / under-review are all the same
// operation: a guarded status transition. One endpoint, one code path, one
// timeline entry, one notification — instead of five near-identical handlers
// that each forget a different thing.
router.post(
  '/applications/:id/status',
  validateBody(
    z.object({
      status: z.enum(ALL_STATUSES),
      reason: z.string().max(2000).optional().default(''),
      notify: z.boolean().optional().default(true),
    })
  ),
  asyncHandler(async (req, res) => {
    const application = await grantService.changeStatus({
      applicationDbId: req.params.id,
      toStatus: req.body.status,
      adminUserId: req.user.userId,
      reason: req.body.reason,
      notify: req.body.notify,
    });
    res.json({ success: true, data: application });
  })
);

router.post(
  '/applications/:id/reviewer',
  validateBody(z.object({ reviewerId: z.string().regex(/^[a-f\d]{24}$/i) })),
  asyncHandler(async (req, res) => {
    const application = await grantService.assignReviewer({
      applicationDbId: req.params.id,
      reviewerId: req.body.reviewerId,
      adminUserId: req.user.userId,
    });
    res.json({ success: true, data: application });
  })
);

router.post(
  '/applications/:id/comments',
  validateBody(
    z.object({
      comment: z.string().min(1).max(5000),
      visibleToStudent: z.boolean().optional().default(false),
    })
  ),
  asyncHandler(async (req, res) => {
    const created = await grantService.addComment({
      applicationDbId: req.params.id,
      authorId: req.user.userId,
      comment: req.body.comment,
      visibleToStudent: req.body.visibleToStudent,
    });
    res.status(201).json({ success: true, data: created });
  })
);

router.put(
  '/applications/:id/internal-notes',
  validateBody(z.object({ notes: z.string().max(10000) })),
  asyncHandler(async (req, res) => {
    const application = await grantService.setInternalNotes({
      applicationDbId: req.params.id,
      notes: req.body.notes,
      adminUserId: req.user.userId,
    });
    res.json({ success: true, data: { internalNotes: application.internalNotes } });
  })
);

router.post(
  '/applications/:id/revision',
  validateBody(z.object({ allowed: z.boolean() })),
  asyncHandler(async (req, res) => {
    const application = await grantService.setRevisionAllowed({
      applicationDbId: req.params.id,
      allowed: req.body.allowed,
      adminUserId: req.user.userId,
    });
    res.json({ success: true, data: application });
  })
);

// Admins can pull any application's documents.
router.get(
  '/documents/:documentId/url',
  asyncHandler(async (req, res) => {
    const data = await documentsService.getSignedUrl({
      documentId: req.params.documentId,
      isAdmin: true,
    });
    res.json({ success: true, data });
  })
);

// ─── IDEA EVALUATION ────────────────────────────────────────────────────
router.get(
  '/evaluations',
  asyncHandler(async (req, res) => {
    const data = await evaluationService.listEvaluations({
      scheduled: req.query.scheduled,
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json({ success: true, data });
  })
);

router.get(
  '/applications/:id/evaluation',
  asyncHandler(async (req, res) => {
    const data = await evaluationService.getEvaluation(req.params.id);
    res.json({ success: true, data });
  })
);

router.post(
  '/applications/:id/evaluation/schedule',
  validateBody(
    z.object({
      mode: z.enum(evaluationService.MEETING_MODES),
      scheduledAt: z.string().min(1),
      link: z.string().url().optional().or(z.literal('')).default(''),
      location: z.string().max(300).optional().default(''),
    })
  ),
  asyncHandler(async (req, res) => {
    const data = await evaluationService.scheduleMeeting({
      applicationDbId: req.params.id,
      ...req.body,
      adminUserId: req.user.userId,
    });
    res.json({ success: true, data });
  })
);

router.post(
  '/applications/:id/evaluation/result',
  validateBody(
    z.object({
      // A single 0–100 mark plus feedback. Pass/fail is decided server-side
      // against the admin-configured threshold.
      score: z.coerce.number().min(0).max(100),
      feedback: z.string().max(5000).optional().default(''),
    })
  ),
  asyncHandler(async (req, res) => {
    const data = await evaluationService.submitResult({
      applicationDbId: req.params.id,
      ...req.body,
      reviewerId: req.user.userId,
    });
    res.json({ success: true, data });
  })
);

router.get(
  '/applications/:id/invoice',
  asyncHandler(async (req, res) => {
    const data = await paymentService.getInvoice({
      applicationDbId: req.params.id,
      isAdmin: true,
    });
    res.json({ success: true, data });
  })
);

// ─── SETTINGS ───────────────────────────────────────────────────────────
router.get(
  '/settings',
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        values: await getGrantSettings(),
        // The schema drives the settings form, so a new tunable appears in the
        // admin UI automatically.
        schema: SCHEMA,
      },
    });
  })
);

router.put(
  '/settings',
  // Keys are validated against SCHEMA inside the service; anything unknown is
  // rejected rather than silently written.
  validateBody(z.record(z.any())),
  asyncHandler(async (req, res) => {
    const values = await updateGrantSettings(req.body, req.user.userId);
    res.json({ success: true, data: { values } });
  })
);

module.exports = { grantsAdminRouter: router };
