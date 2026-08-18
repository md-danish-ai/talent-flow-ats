import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

export function InterviewOverviewSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {/* Back Button */}
          <Skeleton className="h-10 w-24 rounded-xl" />
          {/* Start Interview Button */}
          <Skeleton className="h-10 w-36 rounded-xl" />
          {/* Quick Guide Button */}
          <Skeleton className="h-10 w-28 rounded-2xl" />
        </div>

        {/* Header Badges */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
      </div>

      {/* Title & Description Section */}
      <div className="space-y-4">
        {/* Paper Title */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 md:w-96 rounded-lg" />
          <Skeleton className="h-2 w-48 rounded-full bg-brand-primary/20" />
        </div>

        {/* Description Callout */}
        <div className="border-l-4 border-brand-primary/40 bg-brand-primary/5 p-4 md:p-5 rounded-r-xl space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>

        {/* 4 Meta Pill Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card px-4 py-2.5 shadow-sm"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-16 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections Grid Overview */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border/50 bg-slate-50/40 dark:bg-slate-900/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-full rounded" />
              <div className="flex items-center gap-4 pt-1">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Guidelines Box */}
      <div className="rounded-2xl border border-border/60 bg-slate-50/30 dark:bg-slate-900/30 p-6 space-y-4">
        <Skeleton className="h-5 w-48 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
