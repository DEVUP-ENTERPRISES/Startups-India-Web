'use strict';
const { Router } = require('express');
const { asyncHandler } = require('../../utils/asyncHandler');
const { GuestToken } = require('./guest-token.model');
const { User } = require('../users/user.model');

const pushRouter = Router();

// Public — no auth required. Stores FCM token for any visitor.
// If user is logged in, also associates with their account (via optional bearer token).
pushRouter.post('/subscribe', asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'token required' });
  }

  // Try to associate with logged-in user
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (bearer) {
    try {
      const jwt = require('jsonwebtoken');
      const env = require('../../config/env');
      const decoded = jwt.verify(bearer, env.JWT_ACCESS_SECRET);
      const userId = decoded.userId || decoded.id || decoded.sub;
      if (userId) {
        await User.findByIdAndUpdate(userId, { $addToSet: { fcmTokens: token } });
        // Remove from guest list if it was there
        await GuestToken.deleteOne({ token });
        return res.json({ success: true, type: 'user' });
      }
    } catch (_) {
      // Invalid/expired token — fall through to guest
    }
  }

  // Store as guest subscriber
  await GuestToken.updateOne({ token }, { token }, { upsert: true });
  res.json({ success: true, type: 'guest' });
}));

module.exports = { pushRouter };
