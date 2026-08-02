'use strict';

const { getFirebaseAdmin } = require('../../config/firebase');
const { User } = require('../users/user.model');
const { GuestToken } = require('./guest-token.model');

const CHUNK = 500;

async function sendToTokens(tokens, { title, body, imageUrl, data = {} }) {
  const firebase = getFirebaseAdmin();

  if (!firebase) {
    const msg = '[FCM] Firebase Admin not initialized - set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in backend .env and restart';
    console.error(msg);
    return { sent: 0, failed: 0, error: 'Firebase not configured on server' };
  }

  if (!tokens.length) {
    console.warn('[FCM] sendToTokens called with 0 tokens - no subscribers yet');
    return { sent: 0, failed: 0, error: 'No subscribers yet' };
  }

  console.log(`[FCM] Sending to ${tokens.length} token(s)...`);
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
        fcmOptions: { link: 'https://startupsindia.in' },
      },
      data: { ...data, clickUrl: 'https://startupsindia.in' },
    };

    try {
      const res = await firebase.messaging().sendEachForMulticast(message);
      sent   += res.successCount;
      failed += res.failureCount;
      console.log(`[FCM] Chunk sent: ${res.successCount} ok, ${res.failureCount} failed`);

      const stale = [];
      res.responses.forEach((r, idx) => {
        if (!r.success) {
          console.warn(`[FCM] Token failed: ${r.error?.code} - ${chunk[idx].slice(0, 20)}...`);
          if (['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'].includes(r.error?.code)) {
            stale.push(chunk[idx]);
          }
        }
      });
      if (stale.length) {
        await Promise.all([
          User.updateMany({ fcmTokens: { $in: stale } }, { $pull: { fcmTokens: { $in: stale } } }),
          GuestToken.deleteMany({ token: { $in: stale } }),
        ]);
      }
    } catch (err) {
      console.error('[FCM] multicast error:', err.message);
      failed += chunk.length;
    }
  }

  console.log(`[FCM] Done - sent: ${sent}, failed: ${failed}`);
  return { sent, failed };
}

async function sendToAll(payload) {
  const [users, guests] = await Promise.all([
    User.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } }, 'fcmTokens').lean(),
    GuestToken.find({}, 'token').lean(),
  ]);
  const tokens = [
    ...users.flatMap(u => u.fcmTokens),
    ...guests.map(g => g.token),
  ];
  console.log(`[FCM] sendToAll - ${users.length} users, ${guests.length} guests, ${tokens.length} total tokens`);
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
