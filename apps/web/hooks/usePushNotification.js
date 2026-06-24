'use client';

import { useEffect, useRef } from 'react';

const FCM_TOKEN_KEY = 'fcm_device_token';

export function usePushNotification({ onMessage } = {}) {
  const unsubRef = useRef(null);

  useEffect(() => {
    // Only run if the user is logged in (access token present)
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!accessToken) return;

    let cancelled = false;

    async function init() {
      try {
        const { requestNotificationPermission, onForegroundMessage } = await import('@/lib/firebase');

        const token = await requestNotificationPermission();
        if (!token || cancelled) return;

        // Register with backend only if token changed
        const stored = localStorage.getItem(FCM_TOKEN_KEY);
        if (token !== stored) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/fcm-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({ token }),
          });
          localStorage.setItem(FCM_TOKEN_KEY, token);

          // Pass config to service worker so it can init Firebase for background messages
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

        // Listen for foreground messages
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
  }, []); // runs once on mount — token presence check is inside
}
