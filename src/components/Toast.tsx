import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Toast Notification Component
 *
 * Aesthetic Direction: Glassmorphism with neon accents
 * - Frosted glass background with blur
 * - Neon colored borders based on type
 * - Smooth slide-in and fade-out animations
 * - Auto-dismiss with progress bar
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG: Record<ToastType, { icon: string; borderColor: string; iconBg: string }> = {
  success: {
    icon: '\u2713', // ✓
    borderColor: 'border-emerald-500/50',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  error: {
    icon: '\u2717', // ✗
    borderColor: 'border-rose-500/50',
    iconBg: 'bg-rose-500/20 text-rose-400',
  },
  warning: {
    icon: '\u26A0', // ⚠
    borderColor: 'border-amber-500/50',
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
  info: {
    icon: '\u2139', // ℹ
    borderColor: 'border-cyan-500/50',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
  },
};

function Toast({ id, type, title, message, duration = 5000, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = TOAST_CONFIG[type];

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Start progress countdown
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(progressInterval);
        setIsVisible(false);
        setTimeout(() => onDismiss(id), 300);
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={`
        relative overflow-hidden
        w-80 max-w-full
        bg-gray-900/80 backdrop-blur-xl
        border ${config.borderColor}
        rounded-xl shadow-2xl shadow-black/50
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center font-bold`}>
          {config.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-100">{title}</p>
          {message && (
            <p className="mt-1 text-xs text-gray-400 line-clamp-2">{message}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-800">
        <div
          className={`h-full transition-all duration-100 ease-linear ${
            type === 'success' ? 'bg-emerald-500' :
            type === 'error' ? 'bg-rose-500' :
            type === 'warning' ? 'bg-amber-500' :
            'bg-cyan-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Toast Container and Context
interface ToastContextValue {
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
}

let toastHandler: ToastContextValue | null = null;

export function setToastHandler(handler: ToastContextValue | null) {
  toastHandler = handler;
}

// Global toast function
export function toast(type: ToastType, title: string, message?: string, duration?: number) {
  if (toastHandler) {
    toastHandler.addToast({ type, title, message, duration });
  }
}

// Convenience methods
toast.success = (title: string, message?: string) => toast('success', title, message);
toast.error = (title: string, message?: string) => toast('error', title, message);
toast.warning = (title: string, message?: string) => toast('warning', title, message);
toast.info = (title: string, message?: string) => toast('info', title, message);

// Toast Provider Component
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Register handler
  useEffect(() => {
    setToastHandler({ addToast, removeToast });
    return () => setToastHandler(null);
  }, [addToast, removeToast]);

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={removeToast} />
      ))}
    </div>,
    document.body
  );
}
