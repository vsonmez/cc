import { useEffect } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'danger'
}: ConfirmDialogProps) {
  // Why: Close dialog on Escape key press for better UX
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const iconColor = variant === 'danger' ? 'text-red-600' : 'text-yellow-600';
  const iconBgColor = variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}
          >
            <svg
              className={`h-6 w-6 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title and message */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{message}</p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
