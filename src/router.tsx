import { createBrowserRouter, Navigate } from 'react-router-dom'
import { TasksPage } from './features/tasks/TasksPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { OnboardingPage } from './features/onboarding/OnboardingPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TasksPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])
