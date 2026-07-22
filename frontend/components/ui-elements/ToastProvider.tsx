"use client";

import React from "react";
import { createPortal } from "react-dom";
import { toast as toastBus, type ToastEvent } from "@lib/toast";
import { cn } from "@lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Loader2,
  X,
  ArrowRight,
} from "lucide-react";

// Creative Icon Configurations
const ICONS: Record<ToastEvent["type"], React.ReactNode> = {
  success: <CheckCircle2 size={18} className="stroke-[2.5]" />,
  error: <XCircle size={18} className="stroke-[2.5]" />,
  info: <Sparkles size={18} className="stroke-[2.5]" />,
  warning: <AlertTriangle size={18} className="stroke-[2.5]" />,
  loading: <Loader2 size={18} className="animate-spin stroke-[2.5]" />,
};

const STYLES: Record<
  ToastEvent["type"],
  {
    glowGradient: string;
    iconBadge: string;
    titleColor: string;
    badgeBg: string;
    progressBar: string;
  }
> = {
  success: {
    glowGradient: "from-emerald-500/25 via-teal-500/15 to-transparent",
    iconBadge:
      "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]",
    titleColor: "text-emerald-600 dark:text-emerald-400",
    badgeBg:
      "bg-emerald-50/80 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    progressBar:
      "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500",
  },
  error: {
    glowGradient: "from-rose-500/25 via-red-500/15 to-transparent",
    iconBadge:
      "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.4)]",
    titleColor: "text-rose-600 dark:text-rose-400",
    badgeBg:
      "bg-rose-50/80 text-rose-700 border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    progressBar: "bg-gradient-to-r from-rose-500 via-red-400 to-pink-500",
  },
  info: {
    glowGradient: "from-sky-500/25 via-indigo-500/15 to-transparent",
    iconBadge:
      "bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(14,165,233,0.4)]",
    titleColor: "text-sky-600 dark:text-sky-400",
    badgeBg:
      "bg-sky-50/80 text-sky-700 border-sky-200/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
    progressBar: "bg-gradient-to-r from-sky-500 via-indigo-400 to-cyan-500",
  },
  warning: {
    glowGradient: "from-amber-500/25 via-orange-500/15 to-transparent",
    iconBadge:
      "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_4px_16px_rgba(245,158,11,0.4)]",
    titleColor: "text-amber-600 dark:text-amber-400",
    badgeBg:
      "bg-amber-50/80 text-amber-700 border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    progressBar: "bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500",
  },
  loading: {
    glowGradient: "from-indigo-500/25 via-purple-500/15 to-transparent",
    iconBadge:
      "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)]",
    titleColor: "text-indigo-600 dark:text-indigo-400",
    badgeBg:
      "bg-indigo-50/80 text-indigo-700 border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
    progressBar: "bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500",
  },
};

interface ToastItemProps {
  toast: ToastEvent;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);

  const style = STYLES[toast.type];

  React.useEffect(() => {
    if (toast.duration === 0 || toast.type === "loading" || isPaused) return;

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 4500);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.id, toast.type, isPaused, onRemove]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "group relative flex items-start gap-3 rounded-2xl border p-3 px-3.5 transition-all duration-300 min-w-[280px] max-w-sm sm:max-w-md select-none overflow-hidden",
        // Frosted Crystal Glass Base with Saturation & Backdrop Blur
        "bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl backdrop-saturate-200 text-slate-900 dark:text-slate-100",
        // Crystal Bevel Edges & Prism Shadows
        "border-white/80 dark:border-white/15 ring-1 ring-slate-900/5 dark:ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none",
      )}
    >
      {/* 💎 Crystal Surface Gloss Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/10 to-transparent dark:from-white/15 dark:via-white/5 dark:to-transparent pointer-events-none z-0" />

      {/* Ambient Status Glow Aura */}
      <div
        className={cn(
          "absolute -inset-1 bg-gradient-to-r opacity-30 blur-xl transition-all duration-500 group-hover:opacity-60 pointer-events-none z-0",
          style.glowGradient,
        )}
      />

      {/* 1. Left Icon Badge */}
      <div
        className={cn(
          "flex items-center justify-center p-2 rounded-xl shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-105 z-10",
          style.iconBadge,
        )}
      >
        {toast.icon || ICONS[toast.type]}
      </div>

      {/* 2. Middle Content Block */}
      <div className="flex-1 min-w-0 pt-0.5 z-10">
        {/* Title & Badge Row */}
        {(toast.title || toast.badge) && (
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            {toast.title && (
              <span
                className={cn(
                  "text-[11px] font-extrabold uppercase tracking-wider leading-none",
                  style.titleColor,
                )}
              >
                {toast.title}
              </span>
            )}
            {toast.badge && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border leading-none backdrop-blur-md",
                  style.badgeBg,
                )}
              >
                {toast.badge}
              </span>
            )}
          </div>
        )}

        {/* Message */}
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug break-words">
          {toast.message}
        </p>

        {/* Description */}
        {toast.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight break-words">
            {toast.description}
          </p>
        )}

        {/* Action Button */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleClose();
            }}
            className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl bg-white/60 hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all duration-200 active:scale-95 group/btn"
          >
            <span>{toast.action.label}</span>
            <ArrowRight
              size={11}
              className="transition-transform group-hover/btn:translate-x-0.5"
            />
          </button>
        )}
      </div>

      {/* 3. Right Close Button */}
      <button
        onClick={handleClose}
        className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 hover:rotate-90 -mr-1 -mt-0.5 z-10"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>

      {/* Progress Bar */}
      {toast.duration !== 0 && toast.type !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/10 overflow-hidden z-10">
          <div
            className={cn(
              "h-full animate-toast-progress origin-left",
              style.progressBar,
            )}
            style={{
              animationDuration: `${toast.duration ?? 4500}ms`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastProvider() {
  const [toasts, setToasts] = React.useState<ToastEvent[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const unsubBus = toastBus.subscribe((event) => {
      setToasts((prev) => {
        const createdAt = event.createdAt || Date.now();
        const exists = prev.some(
          (t) =>
            t.message === event.message &&
            t.type === event.type &&
            Math.abs(createdAt - (t.createdAt || 0)) < 1000,
        );
        if (exists) return prev;
        return [...prev.slice(-4), event];
      });
    });

    const unsubDismiss = toastBus.subscribeDismiss((id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    });

    return () => {
      unsubBus();
      unsubDismiss();
    };
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full flex justify-end">
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
