"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
};

type ToastContextValue = {
  show: (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const next: Toast = { id, ...t };
    setToasts((s) => [next, ...s]);
    window.setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full rounded-lg p-3 shadow-lg border backdrop-blur-sm text-sm text-white transition-all duration-200 ${
              t.type === 'success'
                ? 'bg-emerald-600/95 border-emerald-500'
                : t.type === 'error'
                ? 'bg-rose-600/95 border-rose-500'
                : 'bg-slate-800/95 border-slate-700'
            }`}
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-xs text-slate-100/90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
