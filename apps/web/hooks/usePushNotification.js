'use client';

import { useEffect, useRef } from 'react';

const FCM_TOKEN_KEY        = 'fcm_device_token';
const FCM_ASKED_AT_KEY     = 'fcm_permission_asked_at';
const FCM_COOLDOWN_MS      = 24 * 60 * 60 * 1000; // ask once per 24h if user hasn't decided

export function usePushNotification({ onMessage } = {}) {
  const unsubRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Must be logged in
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    // Browser doesn't support notifications — stop silently
    if (!('Notification' in window)) return;

    const permission = Notification.permission;

    // User blocked — browser prevents re-asking; surface a re-enable banner instead
    if (permission === 'denied') {
      window.dispatchEvent(new CustomEvent('fcm:blocked'));
      return;
    }

    // User hasn't decided yet — enforce 24h cooldown so we don't nag every page load
    if (permission === 'default') {
      const lastAsked = Number(localStorage.getItem(FCM_ASKED_AT_KEY) || '0');
      if (Date.now() - lastAsked < FCM_COOLDOWN_MS) return;
      localStorage.setItem(FCM_ASKED_AT_KEY, String(Date.now()));
    }

    // If already granted + token unchanged — only re-register foreground listener, skip getToken
    const storedToken = localStorage.getItem(FCM_TOKEN_KEY);
    if (permission === 'granted' && storedToken) {
      let cancelled = false;
      import('@/lib/firebase').then(({ onForegroundMessage }) => {
        onForegroundMessage((payload) => {
          if (!cancelled && onMessage) onMessage(payload);
        }).then(unsub => { unsubRef.current = unsub; });
      });
      return () => {
        cancelled = true;
        if (typeof unsubRef.current === 'function') unsubRef.current();
      };
    }

    // Full init: request permission → get FCM token → register with backend
    let cancelled = false;

    async function init() {
      try {
        const { requestNotificationPermission, onForegroundMessage } = await import('@/lib/firebase');

        const token = await requestNotificationPermission();
        if (!token || cancelled) return;

        // Register with backend only when token changes
        if (token !== storedToken) {
          await fetch(
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
          localStorage.setItem(FCM_TOKEN_KEY, token);

          // Pass Firebase config to service worker for background messages
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
        }

        const unsub = await onForegroundMessage((payload) => {
          if (!cancelled && onMessage) onMessage(payload);
        });
        unsubRef.current = unsub;
      } catch (err) {
        console.warn('[FCM] init error:', err);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (typeof unsubRef.current === 'function') unsubRef.current();
    };
  }, []);
}
