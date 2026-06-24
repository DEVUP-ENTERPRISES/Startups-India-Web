'use client';

import { useEffect, useRef, useCallback } from 'react';

const FCM_TOKEN_KEY    = 'fcm_device_token';
const FCM_ASKED_AT_KEY = 'fcm_permission_asked_at';
const FCM_COOLDOWN_MS  = 24 * 60 * 60 * 1000; // only nag once per 24h if unanswered

export function usePushNotification({ onMessage } = {}) {
  const unsubRef   = useRef(null);
  const runningRef = useRef(false);

  const registerWithBackend = useCallback(async (token) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken || !token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/fcm-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({ token }),
        }
      );
      if (!res.ok) console.error('[FCM] backend registration failed:', res.status);
    } catch (err) {
      console.error('[FCM] backend registration error:', err);
    }
  }, []);

  const init = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (runningRef.current) return;
    if (!('Notification' in window)) return;

    const permission = Notification.permission;

    // Blocked — show re-enable banner, stop
    if (permission === 'denied') {
      window.dispatchEvent(new CustomEvent('fcm:blocked'));
      return;
    }

    // Not yet decided — enforce 24h cooldown so we don't nag on every visit
    if (permission === 'default') {
      const lastAsked = Number(localStorage.getItem(FCM_ASKED_AT_KEY) || '0');
      if (Date.now() - lastAsked < FCM_COOLDOWN_MS) return;
      localStorage.setItem(FCM_ASKED_AT_KEY, String(Date.now()));
    }

    runningRef.current = true;
    try {
      const { requestNotificationPermission, onForegroundMessage } = await import('@/lib/firebase');

      const token = await requestNotificationPermission();

      if (!token) {
        console.error('[FCM] getToken failed — check NEXT_PUBLIC_FIREBASE_* env vars');
        return;
      }

      localStorage.setItem(FCM_TOKEN_KEY, token);

      // Register with backend if logged in (also called separately on login event)
      await registerWithBackend(token);

      // Send Firebase config to service worker for background push
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: 'FIREBASE_CONFIG',
          config: {
            apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          },
        });
      }

      // Attach foreground message listener
      if (typeof unsubRef.current === 'function') unsubRef.current();
      const unsub = await onForegroundMessage((payload) => {
        if (onMessage) onMessage(payload);
      });
      unsubRef.current = unsub;
    } catch (err) {
      console.error('[FCM] init error:', err);
    } finally {
      runningRef.current = false;
    }
  }, [onMessage, registerWithBackend]);

  // Called when user logs in — register the already-obtained token with the backend
  const onLogin = useCallback(async () => {
    const token = localStorage.getItem(FCM_TOKEN_KEY);
    if (token) {
      await registerWithBackend(token);
    } else {
      // Token not yet obtained — run full init now
      await init();
    }
  }, [init, registerWithBackend]);

  useEffect(() => {
    // Ask on first visit (no login required)
    init();

    // Re-register with backend when user logs in
    window.addEventListener('user:login', onLogin);

    return () => {
      window.removeEventListener('user:login', onLogin);
      if (typeof unsubRef.current === 'function') unsubRef.current();
    };
  }, [init, onLogin]);
}
