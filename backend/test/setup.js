process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:1/test-never-connects';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.RAZORPAY_KEY_SECRET = 'test-razorpay-secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test-webhook-secret';
process.env.LOG_LEVEL = 'error';

const mongoose = require('mongoose');

// Fail fast instead of buffering forever if a test forgets to stub a query.
mongoose.set('bufferCommands', false);

function leanResult(value) {
  return { lean: async () => value, then: (res, rej) => Promise.resolve(value).then(res, rej) };
}

module.exports = { leanResult };
