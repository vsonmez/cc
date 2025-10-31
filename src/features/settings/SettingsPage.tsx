import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildren } from '../../ui/hooks/useChildren';
import { useSettings } from '../../ui/hooks/useSettings';
import { useNotifications } from '../../ui/hooks/useNotifications';
import { Button } from '../../ui/components/Button';
import { Checkbox } from '../../ui/components/Checkbox';
import { ChildList } from './ChildList';
import { AddChildModal } from './AddChildModal';

export function SettingsPage() {
  const navigate = useNavigate();
  const { children, addChild, deleteChild } = useChildren();
  const { settings, updateSettings } = useSettings();
  const {
    notificationPermission,
    isSupported,
    requestPermission,
    sendTestNotification
  } = useNotifications();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleAddChild = (childName: string, childGrade: number) => {
    addChild(childName, childGrade);
  };

  const handleDeleteChild = (childId: string, childName: string) => {
    const confirmDelete = window.confirm(
      `${childName} silinecek. Tüm ödevleri de silinecek. Emin misiniz?`
    );

    if (!confirmDelete) {
      return;
    }

    deleteChild(childId);
  };

  const handleReminderToggle = async (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      // Request permission first
      setIsRequestingPermission(true);
      const granted = await requestPermission();
      setIsRequestingPermission(false);

      if (!granted) {
        alert('Bildirim izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.');
        return;
      }
    }

    updateSettings({ reminderEnabled: enabled });
  };

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const granted = await requestPermission();
    setIsRequestingPermission(false);

    if (granted) {
      alert('Bildirim izni verildi! ✅');
    } else {
      alert('Bildirim izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Ayarlar</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Children section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Çocuklar</h2>
            <Button onClick={() => setIsAddModalOpen(true)}>+ Çocuk Ekle</Button>
          </div>

          <ChildList children={children} onDelete={handleDeleteChild} />
        </section>

        {/* Reminder section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hatırlatıcı</h2>

          {!isSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Tarayıcınız bildirim özelliğini desteklemiyor.
              </p>
            </div>
          )}

          {isSupported && (
            <>
              {/* Notification Permission Status */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bildirim İzni</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notificationPermission === 'granted' && '✅ İzin verildi'}
                      {notificationPermission === 'denied' && '❌ İzin reddedildi'}
                      {notificationPermission === 'default' && '⏳ Henüz sorulmadı'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {notificationPermission === 'granted' && (
                      <Button onClick={sendTestNotification} variant="secondary" className="text-sm">
                        Test Et
                      </Button>
                    )}
                    {notificationPermission !== 'granted' && (
                      <Button
                        onClick={handleRequestPermission}
                        className="text-sm"
                        disabled={isRequestingPermission}
                      >
                        {isRequestingPermission ? 'İzin İsteniyor...' : 'İzin Ver'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reminder Toggle */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Checkbox
                  checked={settings.reminderEnabled}
                  onChange={handleReminderToggle}
                  label="Günlük hatırlatıcı gönder"
                  disabled={notificationPermission !== 'granted'}
                />

                {settings.reminderEnabled && (
                  <p className="text-sm text-gray-600 mt-2 ml-7">
                    Her gün saat {settings.reminderTime}'de bildirim alacaksınız
                  </p>
                )}

                {notificationPermission !== 'granted' && (
                  <p className="text-xs text-orange-600 mt-2 ml-7">
                    Hatırlatıcı için önce bildirim izni vermelisiniz
                  </p>
                )}
              </div>
            </>
          )}

          <p className="text-xs text-gray-500 mt-2">
            💡 İpucu: Bildirimler çalışması için uygulama açık olmalıdır
          </p>
        </section>

        {/* App info */}
        <section className="pt-8 border-t">
          <div className="text-center text-sm text-gray-500">
            <p>Ödev Takip Sistemi v1.0</p>
            <p className="mt-1">Çocuklarınızın ödevlerini kolayca yönetin</p>
          </div>
        </section>
      </div>

      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddChild}
      />
    </div>
  );
}
