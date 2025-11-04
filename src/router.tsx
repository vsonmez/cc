import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Why: Lazy loading splits routes into separate chunks for faster initial load
const TasksPage = lazy(() => import('./features/tasks/TasksPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage'));

// Why: Suspense fallback shows loading state during chunk download
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Yükleniyor...</p>
    </div>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(TasksPage)
  },
  {
    path: '/settings',
    element: withSuspense(SettingsPage)
  },
  {
    path: '/onboarding',
    element: withSuspense(OnboardingPage)
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
