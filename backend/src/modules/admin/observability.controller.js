const mongoose = require('mongoose');
const os = require('os');
const { SecurityEvent } = require('../../models/SecurityEvent');
const { AuditLog } = require('../../models/AuditLog');
const { Incident } = require('../../models/Incident');
const { getRecentEvents, getSecuritySummary } = require('../../infrastructure/observability/securityEvents');
const { getMetricsSnapshot } = require('../../infrastructure/observability/metrics');
const { isRedisReady, getCacheStats } = require('../../infrastructure/cache/redis');
const { ApiError } = require('../../utils/apiError');

// ─── SECURITY EVENTS ──────────────────────────────────────────────────

async function getSecurityEvents(req, res) {
  const { page = 1, limit = 50, type, severity, resolved, startDate, endDate } = req.query;
  const query = {};
  if (type) query.type = type;
  if (severity) query.severity = severity;
  if (resolved !== undefined) query.resolved = resolved === 'true';
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const [events, total] = await Promise.all([
    SecurityEvent.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(),
    SecurityEvent.countDocuments(query),
  ]);

  res.json({ success: true, data: { events, total, page: Number(page), pages: Math.ceil(total / limit) } });
}

async function getSecuritySummaryRoute(req, res) {
  // Combine in-memory (live) summary with DB aggregates for the past 24h
  const inMemorySummary = getSecuritySummary();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [byType24h, bySeverity24h, topIps24h, total7d, criticalUnresolved] = await Promise.all([
    SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: since24h } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]),
    SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: since24h } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]),
    SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: since24h }, ipAddress: { $ne: 'unknown' } } },
      { $group: { _id: '$ipAddress', count: { $sum: 1 }, types: { $addToSet: '$type' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    SecurityEvent.countDocuments({ createdAt: { $gte: since7d } }),
    SecurityEvent.countDocuments({ severity: { $in: ['critical', 'high'] }, resolved: false }),
  ]);

  res.json({
    success: true,
    data: {
      live: inMemorySummary,
      db: {
        byType24h: byType24h.reduce((a, { _id, count }) => { a[_id] = count; return a; }, {}),
        bySeverity24h: bySeverity24h.reduce((a, { _id, count }) => { a[_id] = count; return a; }, {}),
        topIps24h,
        total7d,
        criticalUnresolved,
      },
    },
  });
}

async function resolveSecurityEvent(req, res) {
  const event = await SecurityEvent.findByIdAndUpdate(
    req.params.id,
    { resolved: true, resolvedAt: new Date(), resolvedBy: req.user.userId },
    { new: true }
  );
  if (!event) throw new ApiError(404, 'Security event not found');
  res.json({ success: true, data: event });
}

async function getLiveSecurityFeed(req, res) {
  const events = getRecentEvents(100);
  res.json({ success: true, data: events });
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────────

async function getAuditLogs(req, res) {
  const { page = 1, limit = 50, action, severity, userId, startDate, endDate } = req.query;
  const query = {};
  if (action) query.action = { $regex: action, $options: 'i' };
  if (severity) query.severity = severity;
  if (userId) query.userId = userId;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  res.json({ success: true, data: { logs, total, page: Number(page), pages: Math.ceil(total / limit) } });
}

async function getAuditSummary(req, res) {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [byAction, bySeverity, byUser, total24h, total7d] = await Promise.all([
    AuditLog.aggregate([
      { $match: { createdAt: { $gte: since24h } } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]),
    AuditLog.aggregate([
      { $match: { createdAt: { $gte: since24h } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]),
    AuditLog.aggregate([
      { $match: { createdAt: { $gte: since24h } } },
      { $group: { _id: '$userEmail', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AuditLog.countDocuments({ createdAt: { $gte: since24h } }),
    AuditLog.countDocuments({ createdAt: { $gte: since7d } }),
  ]);

  res.json({
    success: true,
    data: {
      byAction: byAction.reduce((a, { _id, count }) => { a[_id] = count; return a; }, {}),
      bySeverity: bySeverity.reduce((a, { _id, count }) => { a[_id] = count; return a; }, {}),
      byUser,
      total24h,
      total7d,
    },
  });
}

// ─── INCIDENTS ────────────────────────────────────────────────────────

async function getIncidents(req, res) {
  const { page = 1, limit = 20, status, severity, type } = req.query;
  const query = {};
  if (status) query.status = status;
  if (severity) query.severity = severity;
  if (type) query.type = type;

  const [incidents, total] = await Promise.all([
    Incident.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(),
    Incident.countDocuments(query),
  ]);

  const summary = await Incident.aggregate([
    { $group: { _id: { status: '$status', severity: '$severity' }, count: { $sum: 1 } } },
  ]);

  res.json({ success: true, data: { incidents, total, page: Number(page), pages: Math.ceil(total / limit), summary } });
}

async function createIncident(req, res) {
  const { title, description, severity, type, affectedServices } = req.body;
  if (!title || !severity || !type) throw new ApiError(400, 'title, severity, and type are required');

  const incident = await Incident.create({
    title,
    description,
    severity,
    type,
    affectedServices: affectedServices || [],
    createdByEmail: req.user.email,
    timeline: [{ action: 'created', note: 'Incident opened', byEmail: req.user.email }],
  });

  res.status(201).json({ success: true, data: incident });
}

async function updateIncident(req, res) {
  const { status, description, note, assignedToEmail, affectedServices } = req.body;
  const incident = await Incident.findById(req.params.id);
  if (!incident) throw new ApiError(404, 'Incident not found');

  if (status && status !== incident.status) {
    incident.status = status;
    if (status === 'resolved' || status === 'closed') {
      incident.resolvedAt = new Date();
    }
  }
  if (description !== undefined) incident.description = description;
  if (assignedToEmail !== undefined) incident.assignedToEmail = assignedToEmail;
  if (affectedServices !== undefined) incident.affectedServices = affectedServices;

  incident.timeline.push({
    action: status ? `status_changed_to_${status}` : 'updated',
    note: note || undefined,
    byEmail: req.user.email,
    timestamp: new Date(),
  });

  await incident.save();
  res.json({ success: true, data: incident });
}

async function deleteIncident(req, res) {
  const incident = await Incident.findByIdAndDelete(req.params.id);
  if (!incident) throw new ApiError(404, 'Incident not found');
  res.json({ success: true, data: { deleted: true } });
}

// ─── SYSTEM HEALTH ────────────────────────────────────────────────────

async function getSystemHealth(req, res) {
  const metrics = getMetricsSnapshot();
  const memRaw = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    system: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      loadAvg: os.loadavg().map(v => +v.toFixed(2)),
      memory: {
        totalMB: Math.round(totalMem / 1024 / 1024),
        freeMB: Math.round(freeMem / 1024 / 1024),
        usedMB: Math.round((totalMem - freeMem) / 1024 / 1024),
        usedPct: Math.round(((totalMem - freeMem) / totalMem) * 100),
        processMB: {
          rss: Math.round(memRaw.rss / 1024 / 1024),
          heapUsed: Math.round(memRaw.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memRaw.heapTotal / 1024 / 1024),
        },
      },
    },
    services: {
      redis: isRedisReady() ? 'connected' : 'disconnected',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'degraded',
    },
    cache: getCacheStats(),
    api: {
      requestsTotal: metrics.requests.total,
      errorRate: metrics.requests.errorRate,
      latency: metrics.latency,
      topRoutes: metrics.topRoutes,
    },
  };

  // Degrade overall status if critical services are down
  if (health.services.mongodb !== 'connected') health.status = 'degraded';
  if (health.services.redis !== 'connected') health.status = health.status === 'degraded' ? 'degraded' : 'warning';

  res.json({ success: true, data: health });
}

// ─── SSE METRICS STREAM ───────────────────────────────────────────────
// Clients connect once and receive metric pushes every 5 seconds.
// Auth is enforced via the admin router middleware before this handler runs.

const sseClients = new Set();

function streamMetrics(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
  res.flushHeaders();

  const sendSnapshot = () => {
    const metrics = getMetricsSnapshot();
    const security = getSecuritySummary();
    const payload = JSON.stringify({ metrics, security, timestamp: new Date().toISOString() });
    res.write(`data: ${payload}\n\n`);
  };

  // Send immediately on connect, then every 5s
  sendSnapshot();
  const interval = setInterval(sendSnapshot, 5000);
  sseClients.add(res);

  const cleanup = () => {
    clearInterval(interval);
    sseClients.delete(res);
  };

  req.on('close', cleanup);
  req.on('error', cleanup);
}

module.exports = {
  getSecurityEvents,
  getSecuritySummaryRoute,
  resolveSecurityEvent,
  getLiveSecurityFeed,
  getAuditLogs,
  getAuditSummary,
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  getSystemHealth,
  streamMetrics,
};
