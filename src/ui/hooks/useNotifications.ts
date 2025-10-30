import { useState, useEffect } from 'react';
import { messaging, getToken, onMessage } from '../../core/firebase/config';

export function useNotifications() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    'default'
  );
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      setIsSupported(false);
      return;
    }

    setNotificationPermission(Notification.permission);

    // Listen for foreground messages
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);

        // Show notification when app is in foreground
        if (payload.notification) {
          new Notification(payload.notification.title || 'Ödev Hatırlatıcı', {
            body: payload.notification.body,
            icon: '/vite.svg'
          });
        }
      });

      return unsubscribe;
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported || !messaging) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey:
            'BKcqGqKHc_8oT1jHFVuFGX6QwKvR3Qe7pY4VJ3mL9uN8xZ2pA1bC4dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW4xY5z'
        });

        if (token) {
          console.log('FCM Token:', token);
          setFcmToken(token);
          // Why: Store token in localStorage for later use
          localStorage.setItem('fcm-token', token);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Test Bildirimi', {
        body: 'Bildirimler çalışıyor! 🎉',
        icon: '/vite.svg',
        tag: 'test-notification'
      });
    }
  };

  return {
    notificationPermission,
    fcmToken,
    isSupported,
    requestPermission,
    sendTestNotification
  };
}
