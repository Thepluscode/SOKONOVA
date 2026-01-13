import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import Toast, { ToastType } from '../components/base/Toast';

type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
