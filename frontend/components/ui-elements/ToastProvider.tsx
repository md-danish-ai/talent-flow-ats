"use client";

import React from "react";
import { createPortal } from "react-dom";
import { toast as toastBus, type ToastEvent } from "@lib/toast";
import { cn } from "@lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

const ICONS: Record<ToastEvent["type"], React.ReactNode> = {
  success: <CheckCircle2 size={18} className="shrink-0" />,
  error: <AlertCircle size={18} className="shrink-0" />,
  info: <Info size={18} className="shrink-0" />,
  warning: <AlertTriangle size={18} className="shrink-0" />,
};

const STYLES: Record<
  ToastEvent["type"],
  { container: string; icon: string; title: string; progressBar: string }
> = {
  success: {
    container: "border-emerald-300/80 dark:border-emerald-500/50 bg-card",
    icon: "text-emerald-500",
    title: "text-emerald-600 dark:text-emerald-400",
    progressBar: "bg-emerald-500",
  },
  error: {
    container: "border-red-300/80 dark:border-red-500/50 bg-card",
    icon: "text-red-500",
    title: "text-red-600 dark:text-red-400",
    progressBar: "bg-red-500",
  },
  info: {
    container: "border-blue-300/80 dark:border-blue-500/50 bg-card",
    icon: "text-blue-500",
    title: "text-blue-600 dark:text-blue-400",
    progressBar: "bg-blue-500",
  },
  warning: {
    container: "border-amber-300/80 dark:border-amber-500/50 bg-card",
    icon: "text-amber-500",
    title: "text-amber-600 dark:text-amber-400",
    progressBar: "bg-amber-500",
  },
};
interface ToastItemProps {
  toast: ToastEvent;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Trigger enter animation
    const show = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const dismiss = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 4000);

    return () => {
      clearTimeout(show);
      clearTimeout(dismiss);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = STYLES[toast.type];

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl min-w-[300px] max-w-sm transition-all duration-300 overflow-hidden",
        style.container,
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
      )}
    >
      {/* Icon */}
      <span className={cn("mt-0.5", style.icon)}>{ICONS[toast.type]}</span>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-1">
        {toast.title && (
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-widest mb-0.5",
              style.title,
            )}
          >
            {toast.title}
          </p>
        )}
        <p className="text-sm text-foreground leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="shrink-0 mt-0.5 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-10"
        aria-label="Dismiss"
      >
        <X size={14} className="opacity-50" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5 dark:bg-white/5 left-0">
        <div
          className={cn(
            "h-full animate-toast-progress origin-left",
            style.progressBar,
          )}
          style={{ animationDuration: `${toast.duration ?? 4000}ms` }}
        />
      </div>
    </div>
  );
}

export function ToastProvider() {
  const [toasts, setToasts] = React.useState<ToastEvent[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const unsub = toastBus.subscribe((event) => {
      setToasts((prev) => [...prev, event]);
    });
    return unsub;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="fixed top-6 right-6 mt-[10px] z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
