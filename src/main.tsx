import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { notificationScheduler } from './core/services/notificationScheduler';

// Register service worker for push notifications
if ('serviceWorker' in navigator) {
  // Why: Use BASE_URL from Vite config for correct path in GitHub Pages
  const swPath = `${import.meta.env.BASE_URL}firebase-messaging-sw.js`;
  console.log('🔄 Registering service worker:', swPath);

  navigator.serviceWorker
    .register(swPath)
    .then((registration) => {
      console.log('✅ Service Worker registered successfully:', registration.scope);
      console.log('Service Worker state:', registration.active?.state);
    })
    .catch((error) => {
      console.error('❌ Service Worker registration failed:', error);
      console.error('Attempted path:', swPath);
    });
}

// Start notification scheduler
notificationScheduler.start();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
