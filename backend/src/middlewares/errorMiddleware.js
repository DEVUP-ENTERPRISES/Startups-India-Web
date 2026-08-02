const { logger } = require('../infrastructure/observability/logger');

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  const context = {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
    statusCode,
  };

  if (statusCode >= 500) {
    // A real server fault - log it loud, with the stack, so it's actionable.
    logger.error('Request failed', err, context);
  } else {
    // A 4xx is the CLIENT's condition, not a server error: an expired token on
    // /auth/me, a validation miss, a 404. Logging these at error level with a
    // stack trace buries the genuine 500s in noise. Warn, no stack.
    logger.warn('Request rejected', { ...context, message: err.message });
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorMiddleware };
