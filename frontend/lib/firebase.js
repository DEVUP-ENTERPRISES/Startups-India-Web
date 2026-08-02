import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// ── DROP YOUR FIREBASE WEB CONFIG HERE WHEN YOU GET CREDENTIALS ──
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let app = null;
let messaging = null;

function getFirebaseApp() {
  if (!firebaseConfig.apiKey) return null;
  if (!app) app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return app;
}

async function getFirebaseMessaging() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!(await isSupported())) return null;
  if (!messaging) messaging = getMessaging(app);
  return messaging;
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const msg = await getFirebaseMessaging();
  if (!msg) return null;

  try {
    const token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
    });
    return token;
  } catch (err) {
    console.warn('[FCM] getToken error:', err);
    return null;
  }
}

export async function onForegroundMessage(callback) {
  const msg = await getFirebaseMessaging();
  if (!msg) return () => {};
  return onMessage(msg, callback);
}

export { getFirebaseApp };
