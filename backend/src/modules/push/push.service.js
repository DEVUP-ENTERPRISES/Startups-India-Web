'use strict';

const { getFirebaseAdmin } = require('../../config/firebase');
const { User } = require('../users/user.model');

const CHUNK = 500; // FCM multicast max

async function sendToTokens(tokens, { title, body, imageUrl, data = {} }) {
  const firebase = getFirebaseAdmin();
  if (!firebase || !tokens.length) return { sent: 0, failed: 0 };

  let sent = 0, failed = 0;

  for (let i = 0; i < tokens.length; i += CHUNK) {
    const chunk = tokens.slice(i, i + CHUNK);
    const message = {
      tokens: chunk,
      notification: { title, body, ...(imageUrl ? { imageUrl } : {}) },
      webpush: {
        notification: {
          title,
          body,
          icon: '/assets/images/logos/Startupsina-logo-wight.png',
          badge: '/Startupsindia-favicon.png',
          ...(imageUrl ? { image: imageUrl } : {}),
          vibrate: [200, 100, 200, 100, 400],
          requireInteraction: true,
          actions: [{ action: 'open', title: 'Open' }],
        },
        fcmOptions: { link: process.env.NEXT_PUBLIC_SITE_URL || 'https://startupsindia.in' },
      },
      data: { ...data, clickUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://startupsindia.in' },
    };

    try {
      const res = await firebase.messaging().sendEachForMulticast(message);
      sent   += res.successCount;
      failed += res.failureCount;

      // Remove invalid tokens
      const stale = [];
      res.responses.forEach((r, idx) => {
        if (!r.success && ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'].includes(r.error?.code)) {
          stale.push(chunk[idx]);
        }
      });
      if (stale.length) {
        await User.updateMany({ fcmTokens: { $in: stale } }, { $pull: { fcmTokens: { $in: stale } } });
      }
    } catch (err) {
      console.error('[FCM] multicast error', err.message);
      failed += chunk.length;
    }
  }

  return { sent, failed };
}

async function sendToAll(payload) {
  const users = await User.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } }, 'fcmTokens').lean();
  const tokens = users.flatMap(u => u.fcmTokens);
  return sendToTokens(tokens, payload);
}

async function sendToUser(userId, payload) {
  const user = await User.findById(userId, 'fcmTokens').lean();
  if (!user?.fcmTokens?.length) return { sent: 0, failed: 0 };
  return sendToTokens(user.fcmTokens, payload);
}

async function sendToRole(role, payload) {
  const users = await User.find({ role, fcmTokens: { $exists: true, $not: { $size: 0 } } }, 'fcmTokens').lean();
  const tokens = users.flatMap(u => u.fcmTokens);
  return sendToTokens(tokens, payload);
}

module.exports = { sendToAll, sendToUser, sendToRole, sendToTokens };
