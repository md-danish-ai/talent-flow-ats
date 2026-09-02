import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

export function AttemptDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Back to Attempt History link Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-3.5 w-32 rounded" />
      </div>

      {/* Unified Attempt Summary Card Skeleton */}
      <div
        className={cn(
          "bg-card border border-border/70 p-4 md:p-4.5 shadow-sm space-y-3.5",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Top Section: Profile + Metadata Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/50">
          {/* Left: Avatar + Name + Badges */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-3.5 w-14 rounded" />
              </div>
              <Skeleton className="h-2.5 w-20 rounded opacity-60" />
            </div>
          </div>

          {/* Right: Metadata Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>

        {/* Middle Section: 4 Integrated Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3 sm:p-3.5 rounded-lg bg-muted/20 border border-border/40 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-16 rounded opacity-60" />
                <Skeleton className="h-5 w-5 rounded-md" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-6 w-14 rounded" />
                <Skeleton className="h-3 w-8 rounded opacity-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: Grade Scale Matrix */}
        <div className="pt-3 border-t border-border/40 space-y-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
          <Skeleton className="h-5 w-full rounded-full" />
          <div className="flex justify-between gap-2 px-2">
            <Skeleton className="h-2.5 w-8 rounded opacity-50" />
            <Skeleton className="h-2.5 w-10 rounded opacity-50" />
            <Skeleton className="h-2.5 w-10 rounded opacity-50" />
            <Skeleton className="h-2.5 w-10 rounded opacity-50" />
          </div>
        </div>
      </div>

      {/* Result Breakdown Banner Skeleton */}
      <div className="space-y-3.5">
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3.5 md:p-4 border border-border/50 shadow-sm",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-2.5 w-40 rounded opacity-60" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        </div>

        {/* Section Accordions Skeleton */}
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-card border border-border/50 p-3.5 md:p-4 px-4 md:px-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm",
                STYLE_CONFIG.cardRadius,
              )}
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-2.5 w-16 rounded opacity-40" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
