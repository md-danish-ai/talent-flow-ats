// ─── Global Toast Event Bus ────────────────────────────────────────────────
// Usage from anywhere (client.ts, forms, etc.):
//   import { toast } from "@lib/toast";
//   toast.success("Question updated successfully.");
//   toast.error("Something went wrong.");
//
// The <ToastProvider> component in the layout listens to these events and
// renders the toasts. No external libraries needed.

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastEvent {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, default 4000
}

type ToastListener = (event: ToastEvent) => void;

let listeners: ToastListener[] = [];
let queue: ToastEvent[] = [];

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

  // Flush queue to new subscriber
  if (queue.length > 0) {
    queue.forEach((event) => fn(event));
    queue = [];
  }

  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function show(
  type: ToastType,
  message: string,
  options?: { title?: string; duration?: number },
) {
  emit({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    message,
    title: options?.title,
    duration: options?.duration ?? 4000,
  });
}

export const toast = {
  success: (message: string, options?: { title?: string; duration?: number }) =>
    show("success", message, options),
  error: (message: string, options?: { title?: string; duration?: number }) =>
    show("error", message, options),
  info: (message: string, options?: { title?: string; duration?: number }) =>
    show("info", message, options),
  warning: (message: string, options?: { title?: string; duration?: number }) =>
    show("warning", message, options),
  subscribe,
};
