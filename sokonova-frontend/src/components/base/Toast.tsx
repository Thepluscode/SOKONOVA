import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 5000, actionLabel, onAction, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'ri-checkbox-circle-fill';
      case 'error':
        return 'ri-error-warning-fill';
      case 'warning':
        return 'ri-alert-fill';
      case 'info':
        return 'ri-information-fill';
      default:
        return 'ri-information-fill';
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-emerald-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[10000] max-w-md w-full sm:w-auto animate-slide-in-right`}
      role="alert"
    >
      <div className={`flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg ${getColorClasses()}`}>
        <i className={`${getIcon()} text-xl ${getIconColor()} flex-shrink-0 mt-0.5`}></i>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {actionLabel}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
