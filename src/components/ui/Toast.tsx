'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (msg: string, duration?: number) => useToastStore.getState().addToast('success', msg, duration),
  error: (msg: string, duration?: number) => useToastStore.getState().addToast('error', msg, duration),
  warning: (msg: string, duration?: number) => useToastStore.getState().addToast('warning', msg, duration),
  info: (msg: string, duration?: number) => useToastStore.getState().addToast('info', msg, duration),
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const borders = {
    success: 'border-green-500/20 bg-green-50/95 dark:bg-green-950/20',
    error: 'border-red-500/20 bg-red-50/95 dark:bg-red-950/20',
    warning: 'border-yellow-500/20 bg-yellow-50/95 dark:bg-yellow-950/20',
    info: 'border-blue-500/20 bg-blue-50/95 dark:bg-blue-950/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-between gap-3 ${
        borders[toast.type]
      }`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex-shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
export default toast;
