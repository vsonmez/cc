import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user has dismissed the prompt before
    const hasUserDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasUserDismissed === 'true') {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setInstallPromptEvent(promptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPromptEvent) {
      return false;
    }

    await installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
      setInstallPromptEvent(null);
      return true;
    }

    return false;
  };

  const dismissPrompt = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setIsInstallable(false);
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    dismissPrompt
  };
}
