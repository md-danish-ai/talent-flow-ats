import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

export function UserResultDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Top Navigation & Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-8 w-56 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-44 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      {/* User Information Profile Card Skeleton - Compact */}
      <div
        className={cn(
          "bg-card border border-border/70 p-5 md:p-6 shadow-sm space-y-4",
          STYLE_CONFIG.cardRadius,
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-6 w-36 rounded" />
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-24 rounded opacity-60" />
                <Skeleton className="h-3 w-36 rounded opacity-60" />
              </div>
            </div>
          </div>

          {/* Right: 4 Metadata Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full flex gap-2 border-b border-border pb-1">
        <Skeleton className="h-9 w-40 rounded-lg" />
        <Skeleton className="h-9 w-44 rounded-lg" />
      </div>

      {/* Attempt History Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-3 w-56 rounded opacity-60" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* History List Items (Matching Original AttemptHistoryCard Exactly) */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-full bg-card border border-border/70 p-6 flex flex-col gap-6 shadow-sm",
                STYLE_CONFIG.cardRadius,
              )}
            >
              {/* Top Row: Identity on Left, Timing Box on Right */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="flex items-center gap-5">
                  <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 rounded" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                  </div>
                </div>

                {/* Right Timing Box Skeleton */}
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-4 bg-muted/20 px-4 py-3 border border-border/30",
                    STYLE_CONFIG.innerCardRadius,
                  )}
                >
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex flex-col gap-1">
                      <Skeleton className="h-2.5 w-12 rounded opacity-50" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Performance Footer & Action Button */}
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between bg-muted/30 p-4 ring-1 ring-border/50 gap-4",
                  STYLE_CONFIG.innerCardRadius,
                )}
              >
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5].map((k) => (
                    <div key={k} className="flex flex-col gap-1">
                      <Skeleton className="h-2.5 w-14 rounded opacity-50" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-8 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
