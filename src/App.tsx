import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { InstallPrompt } from './ui/components/InstallPrompt';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <InstallPrompt />
    </>
  );
}
