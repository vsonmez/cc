import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { notificationScheduler } from './core/services/notificationScheduler';

// Register service worker for push notifications
if ('serviceWorker' in navigator) {
  // Why: Use BASE_URL from Vite config for correct path in GitHub Pages
  const swPath = `${import.meta.env.BASE_URL}firebase-messaging-sw.js`;
  navigator.serviceWorker
    .register(swPath)
    .then(() => {
      console.log('Service Worker registered:');
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Start notification scheduler
notificationScheduler.start();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
