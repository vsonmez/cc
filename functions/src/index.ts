import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Scheduled function that runs every day at 18:00 Turkey time (UTC+3)
 * Sends daily homework reminder notifications to all registered devices
 */
export const sendDailyReminders = functions
  .region('europe-west1')
  .pubsub.schedule('0 18 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    try {
      console.log('Starting daily reminder notifications...');

      // Get all FCM tokens from Firestore
      const tokensSnapshot = await db.collection('fcmTokens').get();

      if (tokensSnapshot.empty) {
        console.log('No FCM tokens found. No notifications sent.');
        return null;
      }

      console.log(`Found ${tokensSnapshot.size} registered devices`);

      // Prepare notification payload
      const payload: admin.messaging.MulticastMessage = {
        notification: {
          title: 'Ödev Hatırlatıcı 📚',
          body: 'Tamamlanmamış ödevlerinizi kontrol etmeyi unutmayın!',
          imageUrl: undefined,
        },
        data: {
          type: 'daily-reminder',
          timestamp: new Date().toISOString(),
        },
        webpush: {
          notification: {
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: 'daily-reminder',
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: []
          },
          fcmOptions: {
            link: '/',
          },
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'homework-reminders',
            priority: 'high' as any,
            defaultSound: true,
            defaultVibrateTimings: true,
            defaultLightSettings: true,
            visibility: 'public' as any
          }
        },
        tokens: [] as string[],
      };

      // Collect all valid tokens
      const tokens: string[] = [];
      const invalidTokenIds: string[] = [];

      tokensSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.token && typeof data.token === 'string') {
          tokens.push(data.token);
        } else {
          invalidTokenIds.push(doc.id);
        }
      });

      console.log(`Valid tokens: ${tokens.length}, Invalid: ${invalidTokenIds.length}`);

      if (tokens.length === 0) {
        console.log('No valid tokens found.');
        return null;
      }

      // Firebase Cloud Messaging supports up to 500 tokens per request
      // Split tokens into chunks if needed
      const chunkSize = 500;
      const tokenChunks: string[][] = [];

      for (let i = 0; i < tokens.length; i += chunkSize) {
        tokenChunks.push(tokens.slice(i, i + chunkSize));
      }

      console.log(`Sending notifications in ${tokenChunks.length} batch(es)...`);

      // Send notifications to all tokens
      let totalSuccess = 0;
      let totalFailure = 0;
      const tokensToDelete: string[] = [];

      for (const tokenChunk of tokenChunks) {
        payload.tokens = tokenChunk;

        try {
          const response = await messaging.sendEachForMulticast(payload);

          totalSuccess += response.successCount;
          totalFailure += response.failureCount;

          console.log(
            `Batch sent: ${response.successCount} success, ${response.failureCount} failure`
          );

          // Check for invalid tokens and mark them for deletion
          response.responses.forEach((result, index) => {
            if (!result.success && result.error) {
              const errorCode = result.error.code;
              // Remove invalid tokens (unregistered, invalid-argument)
              if (
                errorCode === 'messaging/invalid-registration-token' ||
                errorCode === 'messaging/registration-token-not-registered' ||
                errorCode === 'messaging/invalid-argument'
              ) {
                tokensToDelete.push(tokenChunk[index]);
                console.log(`Marking token for deletion: ${errorCode}`);
              }
            }
          });
        } catch (error) {
          console.error('Error sending batch:', error);
        }
      }

      // Clean up invalid tokens from Firestore
      if (tokensToDelete.length > 0) {
        console.log(`Deleting ${tokensToDelete.length} invalid token(s)...`);

        const deletePromises = tokensToDelete.map(async (token) => {
          const tokenDocs = await db.collection('fcmTokens').where('token', '==', token).get();
          const batch = db.batch();
          tokenDocs.forEach((doc) => batch.delete(doc.ref));
          return batch.commit();
        });

        await Promise.all(deletePromises);
        console.log('Invalid tokens deleted from Firestore');
      }

      // Also delete documents with invalid structure
      if (invalidTokenIds.length > 0) {
        console.log(`Deleting ${invalidTokenIds.length} invalid document(s)...`);
        const batch = db.batch();
        invalidTokenIds.forEach((id) => {
          batch.delete(db.collection('fcmTokens').doc(id));
        });
        await batch.commit();
      }

      console.log(`✅ Daily reminders sent successfully!`);
      console.log(`Total: ${totalSuccess} success, ${totalFailure} failure`);

      return {
        success: totalSuccess,
        failure: totalFailure,
        deletedTokens: tokensToDelete.length + invalidTokenIds.length,
      };
    } catch (error) {
      console.error('Error in sendDailyReminders:', error);
      throw error;
    }
  });

/**
 * HTTP function to manually trigger notification sending (for testing)
 * Call with: https://europe-west1-homework-tracker-3bc75.cloudfunctions.net/testNotification
 */
export const testNotification = functions.region('europe-west1').https.onRequest(async (req, res) => {
  try {
    // Get all FCM tokens
    const tokensSnapshot = await db.collection('fcmTokens').get();

    if (tokensSnapshot.empty) {
      res.status(404).json({ error: 'No FCM tokens found' });
      return;
    }

    const tokens: string[] = [];
    tokensSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    if (tokens.length === 0) {
      res.status(404).json({ error: 'No valid tokens found' });
      return;
    }

    // Send test notification
    const payload: admin.messaging.MulticastMessage = {
      notification: {
        title: 'Test Bildirimi 🧪',
        body: 'Firebase Cloud Functions çalışıyor! Uygulama kapalıyken bile bildirim geldi.',
      },
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
      webpush: {
        notification: {
          icon: '/vite.svg',
          badge: '/vite.svg',
          tag: `test-${Date.now()}`,
          requireInteraction: true,
          vibrate: [200, 100, 200],
          actions: []
        },
        fcmOptions: {
          link: '/'
        }
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'homework-reminders',
          priority: 'high' as any,
          defaultSound: true,
          defaultVibrateTimings: true,
          defaultLightSettings: true,
          visibility: 'public' as any
        }
      },
      tokens: tokens,
    };

    const response = await messaging.sendEachForMulticast(payload);

    res.json({
      success: true,
      totalTokens: tokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error('Error in testNotification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});
