'use client';

import { useEffect, useRef, useCallback } from 'react';

const FCM_TOKEN_KEY    = 'fcm_device_token';
const FCM_ASKED_AT_KEY = 'fcm_permission_asked_at';
const FCM_COOLDOWN_MS  = 24 * 60 * 60 * 1000;

export function usePushNotification({ onMessage } = {}) {
  const unsubRef   = useRef(null);
  const runningRef = useRef(false); // prevent parallel runs

  const init = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (runningRef.current) return;

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    if (!('Notification' in window)) return;

    const permission = Notification.permission;

    if (permission === 'denied') {
      window.dispatchEvent(new CustomEvent('fcm:blocked'));
      return;
    }

    // Only enforce cooldown when dialog hasn't been answered yet
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
        console.error('[FCM] No token returned — check Firebase config env vars');
        return;
      }

      // Always register with backend — idempotent ($addToSet), handles user switching
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

      if (!res.ok) {
        console.error('[FCM] Token registration failed:', res.status);
      } else {
        localStorage.setItem(FCM_TOKEN_KEY, token);
      }

      // Send config to service worker for background push
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

      // Detach old listener before attaching new one
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
  }, [onMessage]);

  useEffect(() => {
    // Run on mount
    init();

    // Re-run when user logs in from same page (e.g. modal login)
    window.addEventListener('user:login', init);

    return () => {
      window.removeEventListener('user:login', init);
      if (typeof unsubRef.current === 'function') unsubRef.current();
    };
  }, [init]);
}
