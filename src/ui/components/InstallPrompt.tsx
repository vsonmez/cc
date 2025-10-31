import { useEffect, useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { Button } from './Button';

export function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall, dismissPrompt } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (!isInstallable || isInstalled) {
      return;
    }

    // Show prompt after 2 seconds on first visit
    const hasSeenPrompt = localStorage.getItem('pwa-install-seen');
    if (!hasSeenPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
        localStorage.setItem('pwa-install-seen', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await promptInstall();
    setIsInstalling(false);

    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setShowPrompt(false);
  };

  if (!showPrompt || !isInstallable || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Uygulamayı Yükle
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ödev Takip uygulamasını telefonunuza veya bilgisayarınıza yükleyerek hızlı erişim sağlayın.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Anasayfaya ekle, hızlı erişim</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Günlük hatırlatma bildirimleri</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Çevrimdışı çalışma desteği</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleDismiss}
            className="flex-1"
            disabled={isInstalling}
          >
            Şimdi Değil
          </Button>
          <Button
            variant="primary"
            onClick={handleInstall}
            className="flex-1"
            disabled={isInstalling}
          >
            {isInstalling ? 'Yükleniyor...' : 'Yükle'}
          </Button>
        </div>
      </div>
    </div>
  );
}
