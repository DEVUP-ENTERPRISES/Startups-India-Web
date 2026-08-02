const { AuditLog } = require('../models/AuditLog');

// Derive a readable action string from HTTP method + URL path
function inferAction(method, rawPath) {
  const path = rawPath.replace(/^\/api\/v1\/admin\/?/, '');
  const segments = path.split('/').filter(Boolean);
  const resource = segments[0] || 'unknown';

  // Handle sub-resource actions (e.g. payments/:id/refund, events/:id/duplicate)
  const subAction = segments[2];
  if (subAction && !subAction.match(/^[0-9a-f]{24}$/i)) {
    return `admin.${resource}.${subAction}`;
  }

  const verbMap = { GET: 'read', POST: 'create', PATCH: 'update', PUT: 'update', DELETE: 'delete' };
  return `admin.${resource}.${verbMap[method] || method.toLowerCase()}`;
}

function auditLogMiddleware(req, res, next) {
  const startMs = Date.now();

  res.on('finish', () => {
    // Skip safe reads - only log writes and deletes
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return;

    const duration = Date.now() - startMs;
    const statusCode = res.statusCode;

    AuditLog.create({
      userId: req.user?.userId,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      action: inferAction(req.method, req.path),
      resource: req.path.replace(/^\/api\/v1\/admin\/?/, '').split('/')[0],
      resourceId: req.params?.id || req.params?.courseId || req.params?.moduleId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      details: { duration, params: req.params },
      severity: statusCode >= 500 ? 'critical' : statusCode >= 400 ? 'warning' : 'info',
    }).catch(() => {}); // non-blocking
  });

  next();
}

module.exports = { auditLogMiddleware };
