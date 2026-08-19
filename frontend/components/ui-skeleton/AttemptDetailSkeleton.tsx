import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

export function AttemptDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Back to Attempt History link Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-4 w-36 rounded" />
      </div>

      {/* Unified Attempt Summary Card Skeleton */}
      <div
        className={cn(
          "bg-card border border-border/70 p-5 md:p-6 shadow-sm space-y-5",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Top Section: Profile + Metadata Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/50">
          {/* Left: Avatar + Name + Badges */}
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-3 w-24 rounded opacity-60" />
            </div>
          </div>

          {/* Right: Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Middle Section: 4 Integrated Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-muted/20 border border-border/40 flex flex-col justify-between gap-3 min-h-[5.5rem]"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded opacity-60" />
                <Skeleton className="h-6 w-6 rounded-lg" />
              </div>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded opacity-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: Grade Scale Matrix */}
        <div className="pt-4 border-t border-border/40 space-y-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <Skeleton className="h-6 w-full rounded-full" />
          <div className="flex justify-between gap-2 px-2">
            <Skeleton className="h-3 w-10 rounded opacity-50" />
            <Skeleton className="h-3 w-14 rounded opacity-50" />
            <Skeleton className="h-3 w-12 rounded opacity-50" />
            <Skeleton className="h-3 w-14 rounded opacity-50" />
          </div>
        </div>
      </div>

      {/* Result Breakdown Banner Skeleton */}
      <div className="space-y-5">
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-5 border border-border/50 shadow-sm",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-3 w-48 rounded opacity-60" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>
        </div>

        {/* Section Accordions Skeleton */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-card border border-border/50 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm",
                STYLE_CONFIG.cardRadius,
              )}
            >
              <div className="flex items-center gap-3.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-44 rounded" />
                  <Skeleton className="h-3 w-20 rounded opacity-40" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
