// Firebase Messaging Service Worker
// Why: Handles background push notifications when app is not active

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: 'AIzaSyDy2K4n2HAqCxoqTwfSrUme7bIxcJW6sRA',
  authDomain: 'homework-tracker-3bc75.firebaseapp.com',
  projectId: 'homework-tracker-3bc75',
  storageBucket: 'homework-tracker-3bc75.firebasestorage.app',
  messagingSenderId: '582076253893',
  appId: '1:582076253893:web:673fa5b99172e2ce34d2ac',
  measurementId: 'G-3NWJSE7QBZ'
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Ödev Hatırlatıcı';
  const notificationOptions = {
    body: payload.notification?.body || 'Tamamlanmamış ödevleriniz var!',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: payload.data?.type || 'homework-reminder',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    silent: false,
    renotify: false,
    data: payload.data,
    // Android-specific: Add timestamp for proper ordering
    timestamp: Date.now()
  };

  console.log('[firebase-messaging-sw.js] Showing notification:', notificationTitle, notificationOptions);

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked', event);

  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
