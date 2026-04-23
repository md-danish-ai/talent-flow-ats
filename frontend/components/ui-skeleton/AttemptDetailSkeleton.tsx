import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

export function AttemptDetailSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-14 w-64 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>

      {/* Profile Summary Strip Skeleton */}
      <div className="min-h-[5rem] w-full bg-muted/40 rounded-3xl border border-border/50 p-6 flex flex-wrap items-center justify-between gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[120px] flex flex-col gap-2">
            <Skeleton className="h-3 w-16 rounded opacity-60" />
            <Skeleton className="h-5 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* Performance Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="min-h-[9rem] bg-muted/30 rounded-2xl border border-border/50 p-6 flex flex-col gap-4"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-20 rounded opacity-60" />
              <div className="flex flex-wrap items-baseline gap-2 mt-1">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-4 w-20 rounded opacity-40" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Scale Skeleton */}
      <div className="min-h-[6rem] w-full bg-card rounded-3xl border border-border/50 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <Skeleton className="h-6 w-48 rounded shrink-0" />
        <div className="flex flex-wrap gap-3 w-full">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-10 flex-1 min-w-[140px] rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Result Breakdown Banner Skeleton */}
      <div className="space-y-6">
        <div className="min-h-[5rem] w-full bg-card rounded-3xl border border-border/50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-3 w-48 rounded opacity-60" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>

        {/* Section Accordions Skeleton */}
        <div className="space-y-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="min-h-[6rem] bg-card rounded-3xl border border-border/50 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-4 w-24 rounded opacity-40" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-16 rounded" />
                  <Skeleton className="h-10 w-16 rounded" />
                </div>
                <Skeleton className="h-12 w-44 rounded-xl" />
                <Skeleton className="h-8 w-8 rounded-lg outline-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
