import { useState, useEffect } from 'react';
import { messaging, getToken, onMessage, db } from '../../core/firebase/config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useNotifications() {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');
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

    // Auto-register token if permission already granted but token missing
    const autoRegisterToken = async () => {
      const existingToken = localStorage.getItem('fcm-token');
      const migrated = localStorage.getItem('fcm-token-migrated');

      // Case 1: Token exists but not migrated to Firestore yet
      if (existingToken && !migrated && Notification.permission === 'granted') {
        console.log('🔄 Migrating existing FCM token to Firestore...');
        try {
          const tokenDocRef = doc(collection(db, 'fcmTokens'), existingToken);
          await setDoc(
            tokenDocRef,
            {
              token: existingToken,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              userAgent: navigator.userAgent,
              migrated: true
            },
            { merge: true }
          );
          console.log('✅ FCM token migrated to Firestore');
          localStorage.setItem('fcm-token-migrated', 'true');
          setFcmToken(existingToken);
        } catch (error) {
          console.error('❌ Error migrating token to Firestore:', error);
        }
      }

      // Case 2: Permission granted but no token (localStorage cleared or token never obtained)
      if (!existingToken && Notification.permission === 'granted' && messaging) {
        console.log('🔄 Permission granted but no token found. Getting new token...');
        try {
          // Wait for service worker to be ready
          if ('serviceWorker' in navigator) {
            console.log('⏳ Waiting for service worker to be ready...');
            const registration = await navigator.serviceWorker.ready;
            console.log('✅ Service worker ready');
          }

          const token = await getToken(messaging, {
            vapidKey:
              'BFCPZKdD1MfKUq9z-h--BUC-P4NlN4XSZMz4SISdijEKvgeDuNFk-TrmO9aw0tydNQ1JtuPmcez8ixZGjvnZH0g'
          });

          if (token) {
            console.log('✅ New FCM token obtained');
            setFcmToken(token);
            localStorage.setItem('fcm-token', token);
            localStorage.setItem('fcm-token-migrated', 'true');

            // Save to Firestore
            const tokenDocRef = doc(collection(db, 'fcmTokens'), token);
            await setDoc(
              tokenDocRef,
              {
                token: token,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userAgent: navigator.userAgent
              },
              { merge: true }
            );
            console.log('✅ FCM token saved to Firestore');
          }
        } catch (error) {
          console.error('❌ Error getting new token:', error);
        }
      }
    };

    autoRegisterToken();

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

  const saveFcmTokenToFirestore = async (token: string): Promise<void> => {
    try {
      // Why: Use token as document ID to prevent duplicates
      const tokenDocRef = doc(collection(db, 'fcmTokens'), token);

      await setDoc(
        tokenDocRef,
        {
          token: token,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userAgent: navigator.userAgent
        },
        { merge: true }
      );

      console.log('✅ FCM token saved to Firestore');
    } catch (error) {
      console.error('Error saving FCM token to Firestore:', error);
      // Don't throw error, token is still usable locally
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported || !messaging) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        // Wait for service worker to be ready
        if ('serviceWorker' in navigator) {
          console.log('⏳ Waiting for service worker to be ready...');
          await navigator.serviceWorker.ready;
          console.log('✅ Service worker ready');
        }

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey:
            'BFCPZKdD1MfKUq9z-h--BUC-P4NlN4XSZMz4SISdijEKvgeDuNFk-TrmO9aw0tydNQ1JtuPmcez8ixZGjvnZH0g'
        });

        if (token) {
          // console.log('FCM Token:', token);
          setFcmToken(token);
          // Why: Store token in localStorage for later use
          localStorage.setItem('fcm-token', token);

          // Why: Save token to Firestore for Cloud Functions to send notifications
          await saveFcmTokenToFirestore(token);

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
      // Why: Use timestamp to make each test notification unique
      const timestamp = new Date().getTime();
      new Notification('Test Bildirimi', {
        body: 'Bildirimler çalışıyor! 🎉',
        icon: '/vite.svg',
        tag: `test-notification-${timestamp}`
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
