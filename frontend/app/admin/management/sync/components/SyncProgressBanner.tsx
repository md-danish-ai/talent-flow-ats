"use client";

import React from "react";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  X,
  ShieldCheck,
  Database,
} from "lucide-react";
import { SyncJobStatus } from "@lib/api/sync";
import { cn } from "@lib/utils";

interface SyncProgressBannerProps {
  jobStatus: SyncJobStatus | null;
  onClose: () => void;
}

export function SyncProgressBanner({
  jobStatus,
  onClose,
}: SyncProgressBannerProps) {
  if (!jobStatus) return null;

  const {
    total_records,
    completed_records,
    success_count,
    failed_count,
    progress_pct,
    status,
  } = jobStatus;

  const isDone = status === "COMPLETED" || status === "FAILED";
  const isSuccess = isDone && failed_count === 0 && success_count > 0;
  const hasErrors = failed_count > 0;

  return (
    <div
      className={cn(
        "relative w-full border-b transition-all duration-300 p-4 sm:p-5 overflow-hidden backdrop-blur-md",
        isSuccess
          ? "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30"
          : hasErrors
            ? "bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30"
            : "bg-brand-primary/5 dark:bg-slate-900/80 border-brand-primary/20",
      )}
    >
      {/* Decorative ambient background glow */}
      <div
        className={cn(
          "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20",
          isSuccess
            ? "bg-emerald-500"
            : hasErrors
              ? "bg-rose-500"
              : "bg-brand-primary",
        )}
      />

      <div className="relative z-10 space-y-3.5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Status Icon with pulse aura */}
            <div
              className={cn(
                "relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                isSuccess
                  ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                  : hasErrors
                    ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                    : "bg-brand-primary/15 text-brand-primary border border-brand-primary/30",
              )}
            >
              {!isDone ? (
                <>
                  <span className="absolute inset-0 rounded-xl bg-brand-primary/30 animate-ping opacity-75" />
                  <RefreshCw size={17} className="animate-spin relative z-10" />
                </>
              ) : isSuccess ? (
                <ShieldCheck size={18} className="relative z-10" />
              ) : (
                <XCircle size={18} className="relative z-10" />
              )}
            </div>

            {/* Title & Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {isSuccess
                  ? "ArcCRM Synchronization Completed Successfully"
                  : hasErrors
                    ? "Synchronization Completed with Errors"
                    : "Synchronizing Candidates with ArcCRM..."}
              </h4>

              {/* Progress Chip */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide shadow-sm border",
                  isSuccess
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : hasErrors
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                      : "bg-brand-primary/10 border-brand-primary/30 text-brand-primary",
                )}
              >
                {!isDone && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                )}
                {completed_records} / {total_records} ({progress_pct}%)
              </span>
            </div>
          </div>

          {/* Dismiss Action Button */}
          {isDone && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all shrink-0"
              title="Dismiss progress banner"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* High-Precision Progress Bar with Glow */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 p-0.5 overflow-hidden border border-slate-300/50 dark:border-slate-700/50">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out shadow-sm",
              isSuccess
                ? "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-emerald-500/50"
                : hasErrors
                  ? "bg-gradient-to-r from-rose-600 to-rose-400 shadow-rose-500/50"
                  : "bg-gradient-to-r from-brand-primary via-indigo-500 to-emerald-400 shadow-brand-primary/40",
            )}
            style={{ width: `${Math.min(progress_pct, 100)}%` }}
          />
        </div>

        {/* Metric Badges & Detailed Status Footer */}
        <div className="flex items-center justify-between gap-4 pt-0.5 flex-wrap">
          {/* Stat Pills */}
          <div className="flex items-center gap-2">
            {/* Total */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
              <Database size={13} className="text-slate-400" />
              <span className="font-medium">Total:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {total_records}
              </span>
            </div>

            {/* Success */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle2
                size={13}
                className="text-emerald-600 dark:text-emerald-500"
              />
              <span>Verified:</span>
              <span className="font-bold font-mono">{success_count}</span>
            </div>

            {/* Failed */}
            {failed_count > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-400 font-medium">
                <XCircle
                  size={13}
                  className="text-rose-600 dark:text-rose-500"
                />
                <span>Failed:</span>
                <span className="font-bold font-mono">{failed_count}</span>
              </div>
            )}
          </div>

          {/* Detailed Message */}
          {isDone && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {isSuccess ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  ✓ Successfully synchronized and verified all {success_count}{" "}
                  candidate profiles!
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  ✕ Sync finished with {failed_count} candidate error
                  {failed_count > 1 ? "s" : ""}. Hover over candidate status for
                  details.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
