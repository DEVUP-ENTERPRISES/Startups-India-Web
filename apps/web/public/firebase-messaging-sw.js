// Firebase Messaging Service Worker — handles background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

let messaging = null;

// Receive config from the main thread (sent by usePushNotification after SW registration)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG' && event.data.config?.projectId && !messaging) {
    try {
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();
      messaging.onBackgroundMessage(handleBackgroundMessage);
    } catch (_) {}
  }
});

function handleBackgroundMessage(payload) {
  const { title, body, image } = payload.notification || {};
  const data = payload.data || {};

  self.registration.showNotification(title || 'Startup India', {
    body: body || '',
    icon: '/assets/images/logos/Startupsina-logo-wight.png',
    badge: '/Startupsindia-favicon.png',
    image: image || undefined,
    vibrate: [200, 100, 200, 100, 400, 100, 600],
    requireInteraction: true,
    tag: 'startup-india-push',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    data: { clickUrl: data.clickUrl || 'https://startupsindia.in' },
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.clickUrl || 'https://startupsindia.in';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
