import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface ResultCardSkeletonProps {
  rowCount?: number;
}

export function ResultCardSkeleton({ rowCount = 10 }: ResultCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 p-4 sm:p-6 bg-slate-100/70 dark:bg-slate-950/60 min-h-full">
      {Array.from({ length: rowCount }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgb(0,0,0,0.65)] overflow-hidden flex flex-col justify-between"
        >
          {/* Header Skeleton */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-4 w-14 rounded-md" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-24 rounded opacity-60" />
                  <Skeleton className="h-3 w-20 rounded opacity-60" />
                </div>
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>

          <div className="space-y-2.5 pt-3 border-t border-border/50">
            {/* Paper Strip Skeleton */}
            <Skeleton className="h-7 w-full rounded-lg" />

            {/* 4 Stats Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="flex items-center justify-between pt-3 mt-3.5 border-t border-border/50">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
