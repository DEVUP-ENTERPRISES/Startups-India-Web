const { logger } = require('../infrastructure/observability/logger');

/**
 * Map known Mongoose / MongoDB driver errors to user-friendly messages and
 * appropriate HTTP status codes before they leave the server.
 */
function normalizeDatabaseError(err) {
  // MongoDB duplicate key (E11000)
  if (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000)) {
    const keyPattern = err.keyPattern || {};
    const field = Object.keys(keyPattern)[0] || '';

    const fieldMessages = {
      email:       'An account with this email address already exists.',
      phoneE164:   'An account with this phone number already exists. Please use a different number or log in.',
      phone:       'An account with this phone number already exists. Please use a different number or log in.',
      name:        'This name is already taken. Please choose a different one.',
    };

    const message = fieldMessages[field]
      || 'This information is already registered. Please check your details and try again.';

    const error = new Error(message);
    error.statusCode = 409;
    return error;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    const error = new Error(messages.length ? messages.join('. ') : 'Some fields are invalid. Please review your input.');
    error.statusCode = 400;
    return error;
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    const error = new Error(`Invalid value for field "${err.path}".`);
    error.statusCode = 400;
    return error;
  }

  return err; // return as-is for everything else
}

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const normalized = normalizeDatabaseError(err);
  const statusCode = normalized.statusCode || 500;
  const payload = {
    success: false,
    message: normalized.message || 'Internal server error',
  };

  if (normalized.details) {
    payload.details = normalized.details;
  }

  if (process.env.NODE_ENV !== 'production' && normalized.stack) {
    payload.stack = normalized.stack;
  }

  const context = {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
    statusCode,
  };

  if (statusCode >= 500) {
    logger.error('Request failed', err, context);
  } else {
    logger.warn('Request rejected', { ...context, message: normalized.message });
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorMiddleware };
