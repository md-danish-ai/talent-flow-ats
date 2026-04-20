import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

export function UserResultDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="min-h-[12rem] w-full bg-muted/40 rounded-3xl border border-border/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col md:flex-row items-center md:justify-start gap-3">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex gap-2 justify-center md:justify-start">
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-h-[9rem] bg-muted/30 rounded-2xl border border-border/50 p-6 flex flex-col gap-4"
          >
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded opacity-60" />
              <div className="flex flex-wrap items-baseline gap-2 mt-1">
                <Skeleton className="h-9 w-20 rounded" />
                <Skeleton className="h-4 w-28 rounded opacity-40" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History List Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded opacity-60" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="min-h-[14rem] w-full bg-muted/20 rounded-2xl border border-border/40 p-6 flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 rounded" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-16 w-64 rounded-xl" />
              </div>
              <Skeleton className="h-16 w-full rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
