import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildren } from '../../ui/hooks/useChildren'
import { useSettings } from '../../ui/hooks/useSettings'
import { Button } from '../../ui/components/Button'
import { Checkbox } from '../../ui/components/Checkbox'
import { ChildList } from './ChildList'
import { AddChildModal } from './AddChildModal'

export function SettingsPage() {
  const navigate = useNavigate()
  const { children, addChild, deleteChild } = useChildren()
  const { settings, updateSettings } = useSettings()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddChild = (name: string, grade: number) => {
    addChild(name, grade)
  }

  const handleDeleteChild = (childId: string, childName: string) => {
    const confirmDelete = window.confirm(
      `${childName} silinecek. Tüm ödevleri de silinecek. Emin misiniz?`
    )

    if (!confirmDelete) {
      return
    }

    deleteChild(childId)
  }

  const handleReminderToggle = (enabled: boolean) => {
    updateSettings({ reminderEnabled: enabled })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            <Button onClick={() => setIsAddModalOpen(true)}>
              + Çocuk Ekle
            </Button>
          </div>

          <ChildList children={children} onDelete={handleDeleteChild} />
        </section>

        {/* Reminder section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hatırlatıcı
          </h2>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <Checkbox
              checked={settings.reminderEnabled}
              onChange={handleReminderToggle}
              label="Günlük hatırlatıcı gönder"
            />

            {settings.reminderEnabled && (
              <p className="text-sm text-gray-600 mt-2 ml-7">
                Her gün saat {settings.reminderTime}'de bildirim alacaksınız
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Not: Web bildirimleri için tarayıcı izni gereklidir
          </p>
        </section>

        {/* App info */}
        <section className="pt-8 border-t">
          <div className="text-center text-sm text-gray-500">
            <p>Ödev Takip Sistemi v1.0</p>
            <p className="mt-1">
              Çocuklarınızın ödevlerini kolayca yönetin
            </p>
          </div>
        </section>
      </div>

      <AddChildModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddChild}
      />
    </div>
  )
}
