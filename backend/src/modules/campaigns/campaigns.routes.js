const { Router } = require('express');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utils/asyncHandler');
const { auditLogMiddleware } = require('../../middlewares/auditLog.middleware');
const ctrl = require('./campaigns.controller');

// ─── Admin-only campaign management routes ───────────────────────────────────
// Mounted under /api/v1/{ADMIN_SLUG}/campaigns in routes/index.js
const campaignsAdminRouter = Router();

campaignsAdminRouter.use(authRequired, requireRole('admin'), auditLogMiddleware);

// Campaigns CRUD
campaignsAdminRouter.get('/', asyncHandler(ctrl.listCampaigns));
campaignsAdminRouter.get('/:id', asyncHandler(ctrl.getCampaign));
campaignsAdminRouter.post('/', asyncHandler(ctrl.createCampaign));
campaignsAdminRouter.patch('/:id', asyncHandler(ctrl.updateCampaign));
campaignsAdminRouter.delete('/:id', asyncHandler(ctrl.deleteCampaign));
campaignsAdminRouter.get('/:id/analytics', asyncHandler(ctrl.getCampaignAnalytics));

// Tracking links nested under a campaign
campaignsAdminRouter.get('/:campaignId/links', asyncHandler(ctrl.listLinks));
campaignsAdminRouter.post('/:campaignId/links', asyncHandler(ctrl.createLink));
campaignsAdminRouter.patch('/:campaignId/links/:linkId', asyncHandler(ctrl.updateLink));
campaignsAdminRouter.delete('/:campaignId/links/:linkId', asyncHandler(ctrl.deleteLink));
campaignsAdminRouter.get('/:campaignId/links/:linkId/analytics', asyncHandler(ctrl.getLinkAnalytics));

// ─── Public redirect endpoint ─────────────────────────────────────────────────
// Mounted at /r/:code — no auth, no admin slug
const redirectRouter = Router();
redirectRouter.get('/:code', asyncHandler(ctrl.redirect));

module.exports = { campaignsAdminRouter, redirectRouter };
