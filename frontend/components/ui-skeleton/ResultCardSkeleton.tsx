import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface ResultCardSkeletonProps {
  rowCount?: number;
}

export function ResultCardSkeleton({ rowCount = 10 }: ResultCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
      {Array.from({ length: rowCount }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden"
        >
          {/* Header Skeleton */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-40 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32 rounded opacity-60" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>

          <div className="h-px bg-border/50 w-full mb-6" />

          {/* Body Skeleton */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded opacity-40" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded opacity-40" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded opacity-40" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
