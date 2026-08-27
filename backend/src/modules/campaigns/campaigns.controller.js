const svc = require('./campaigns.service');

// ─── Campaigns ────────────────────────────────────────────────────────────────

async function listCampaigns(req, res) {
  const { page, limit, search, status } = req.query;
  const data = await svc.listCampaigns({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    search,
    status,
  });
  res.json({ success: true, data });
}

async function getCampaign(req, res) {
  const data = await svc.getCampaign(req.params.id);
  res.json({ success: true, data });
}

async function createCampaign(req, res) {
  const data = await svc.createCampaign({ ...req.body, createdBy: req.user.userId });
  res.status(201).json({ success: true, data });
}

async function updateCampaign(req, res) {
  const data = await svc.updateCampaign(req.params.id, req.body);
  res.json({ success: true, data });
}

async function deleteCampaign(req, res) {
  const data = await svc.deleteCampaign(req.params.id);
  res.json({ success: true, data });
}

async function getCampaignAnalytics(req, res) {
  const data = await svc.getCampaignAnalytics(req.params.id);
  res.json({ success: true, data });
}

// ─── Tracking Links ──────────────────────────────────────────────────────────

async function listLinks(req, res) {
  const data = await svc.listLinks(req.params.campaignId);
  res.json({ success: true, data });
}

async function createLink(req, res) {
  const data = await svc.createLink({ ...req.body, campaignId: req.params.campaignId });
  res.status(201).json({ success: true, data });
}

async function updateLink(req, res) {
  const data = await svc.updateLink(req.params.linkId, req.body);
  res.json({ success: true, data });
}

async function deleteLink(req, res) {
  const data = await svc.deleteLink(req.params.linkId);
  res.json({ success: true, data });
}

async function getLinkAnalytics(req, res) {
  const data = await svc.getLinkAnalytics(req.params.linkId);
  res.json({ success: true, data });
}

// ─── Public redirect (no auth) ───────────────────────────────────────────────

async function redirect(req, res) {
  const { code } = req.params;
  const destination = await svc.recordScanAndGetRedirect(code, req);

  if (!destination) {
    return res.status(404).send('Link not found or inactive');
  }

  // 302 so scanners never cache the redirect; the destination can still be changed later
  res.redirect(302, destination);
}

module.exports = {
  listCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignAnalytics,
  listLinks,
  createLink,
  updateLink,
  deleteLink,
  getLinkAnalytics,
  redirect,
};
