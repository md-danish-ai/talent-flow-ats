// ─── Global Toast Event Bus ────────────────────────────────────────────────
// Supports rich toasts with titles, badges, actions, promises, auto creative fallback,
// hover pause, and sound effects.

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number; // ms, default 4000 (0 for sticky)
  action?: ToastAction;
  badge?: string;
  icon?: React.ReactNode;
  playSound?: boolean;
}

export interface ToastEvent extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

type ToastListener = (event: ToastEvent) => void;
type ToastDismissListener = (id: string) => void;

let listeners: ToastListener[] = [];
let dismissListeners: ToastDismissListener[] = [];
let queue: ToastEvent[] = [];

// Creative auto-title generators when no title is provided
const CREATIVE_TITLES: Record<ToastType, string[]> = {
  success: [
    "✨ Woohoo!",
    "🚀 Success!",
    "🎉 Awesome!",
    "✅ Done & Dusted!",
    "🌟 Great Job!",
  ],
  error: [
    "💥 Whoops!",
    "❌ Action Failed",
    "⚠️ Uh-oh!",
    "🚨 Something Went Wrong",
    "💔 Ouch!",
  ],
  info: [
    "💡 Quick Tip",
    "ℹ️ Good to Know",
    "🔔 Update",
    "💬 Heads Up!",
    "📌 Note",
  ],
  warning: [
    "⚡ Attention Required",
    "⚠️ Hold On...",
    "🛑 Careful!",
    "🟡 Warning",
    "⚡ Mind the Gap",
  ],
  loading: ["⏳ Working Magic...", "🔄 Please Wait...", "✨ Processing..."],
};

function getRandomCreativeTitle(type: ToastType): string {
  const titles = CREATIVE_TITLES[type];
  return titles[Math.floor(Math.random() * titles.length)];
}

function emit(event: ToastEvent) {
  if (typeof window === "undefined") return;
  if (listeners.length === 0) {
    queue.push(event);
    return;
  }
  listeners.forEach((fn) => fn(event));
}

function subscribe(fn: ToastListener) {
  listeners.push(fn);

  if (queue.length > 0) {
    queue.forEach((event) => fn(event));
    queue = [];
  }

  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function subscribeDismiss(fn: ToastDismissListener) {
  dismissListeners.push(fn);
  return () => {
    dismissListeners = dismissListeners.filter((l) => l !== fn);
  };
}

function show(
  type: ToastType,
  message: string,
  options?: ToastOptions,
): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const autoTitle = options?.title || getRandomCreativeTitle(type);

  emit({
    id,
    type,
    message,
    title: autoTitle,
    description: options?.description,
    duration: options?.duration ?? (type === "loading" ? 0 : 4500),
    action: options?.action,
    badge: options?.badge,
    icon: options?.icon,
    playSound: options?.playSound ?? false,
    createdAt: Date.now(),
  });

  return id;
}

function dismiss(id: string) {
  dismissListeners.forEach((fn) => fn(id));
}

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    show("success", message, options),
  error: (message: string, options?: ToastOptions) =>
    show("error", message, options),
  info: (message: string, options?: ToastOptions) =>
    show("info", message, options),
  warning: (message: string, options?: ToastOptions) =>
    show("warning", message, options),
  loading: (message: string, options?: ToastOptions) =>
    show("loading", message, options),
  dismiss,
  /**
   * Helper for handling promises automatically with loading, success, and error toasts.
   */
  promise: async <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
    options?: ToastOptions,
  ): Promise<T> => {
    const id = toast.loading(msgs.loading, options);
    try {
      const data = await promise;
      toast.dismiss(id);
      const successMsg =
        typeof msgs.success === "function" ? msgs.success(data) : msgs.success;
      toast.success(successMsg, options);
      return data;
    } catch (err) {
      toast.dismiss(id);
      const errorMsg =
        typeof msgs.error === "function" ? msgs.error(err) : msgs.error;
      toast.error(errorMsg, options);
      throw err;
    }
  },
  subscribe,
  subscribeDismiss,
};
