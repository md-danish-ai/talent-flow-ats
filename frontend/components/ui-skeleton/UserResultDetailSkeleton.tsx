import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

export function UserResultDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Candidate Overview Card Skeleton (PaperOverviewCard style) */}
      <div
        className={cn(
          "bg-card border border-border/80 shadow-xs p-5 sm:p-6 space-y-5 relative overflow-hidden",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Top Action Row Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <div className="flex items-center gap-2.5 sm:ml-auto">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        </div>

        {/* Candidate Profile Details & 4 Mini UI Cards */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar + Candidate Details */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Skeleton className="h-7 w-48 rounded" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-28 rounded opacity-60" />
                <Skeleton className="h-3.5 w-44 rounded opacity-60" />
              </div>
            </div>
          </div>

          {/* Right: 4 Mini UI Cards */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[52px] w-28 sm:w-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation & Attempt History Section */}
      <div className="space-y-6">
        {/* Attempt History Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3.5 w-64 rounded opacity-60" />
            </div>
          </div>
          <Skeleton className="h-7 w-28 rounded-md" />
        </div>

        {/* Segmented Pill Tabs Skeleton */}
        <div className="flex items-center p-1.5 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl w-full sm:w-fit gap-1.5">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>

        {/* Attempt Cards List Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-full bg-card border border-border/70 p-4 md:p-5 shadow-sm space-y-4",
                STYLE_CONFIG.cardRadius,
              )}
            >
              {/* Header Row: Attempt Info on Left, CTA on Right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 border-b border-border/50">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <Skeleton className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Skeleton className="h-5 w-44 rounded" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-32 rounded opacity-70" />
                      <Skeleton className="h-3 w-24 rounded opacity-70" />
                      <Skeleton className="h-3 w-36 rounded opacity-70" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-32 rounded-lg shrink-0" />
              </div>

              {/* 4 Dashboard Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="p-3.5 sm:p-4 rounded-xl bg-muted/20 border border-border/40 flex items-center gap-3.5 h-[92px]"
                  >
                    <Skeleton className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-2.5 w-16 rounded opacity-60" />
                      <Skeleton className="h-6 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Typing Stats Strip Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-border/60">
                <Skeleton className="h-4 w-44 rounded" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3.5 w-20 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
