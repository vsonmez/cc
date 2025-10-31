import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Why: Validate that environment variables are loaded
const missingVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingVars);
  console.error('💡 Solution: Restart the dev server (npm run dev) to load .env file');
  throw new Error(
    `Missing Firebase config: ${missingVars.join(', ')}. Please restart dev server.`
  );
}

console.log('✅ Firebase config loaded successfully');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null;

// Why: Messaging might not be supported in all browsers (e.g., Firefox in private mode)
try {
  messaging = getMessaging(app);
} catch (error) {
  console.warn('Firebase Messaging not supported:', error);
}

export { app, db, messaging, getToken, onMessage };
