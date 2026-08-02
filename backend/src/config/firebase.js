'use strict';

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

let _app = null;

function getFirebaseAdmin() {
  if (_app) return { messaging: () => getMessaging(_app) };

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[FCM] Firebase credentials not set - push notifications disabled.');
    return null;
  }

  _app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

  return { messaging: () => getMessaging(_app) };
}

module.exports = { getFirebaseAdmin };
