import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

export function AttemptDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Unified Attempt Summary Card Skeleton (with Top Action Row, Profile, Full-Width Metadata, 4 Cards & Matrix) */}
      <div
        className={cn(
          "bg-card border border-border/70 p-4 md:p-4.5 shadow-sm space-y-3.5",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Top Action Row Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <div className="flex items-center gap-2.5 sm:ml-auto">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        </div>

        {/* Candidate Profile Header Row Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-3.5 min-w-0">
            <Skeleton className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl shrink-0" />
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-3 w-24 rounded opacity-60" />
            </div>
          </div>
        </div>

        {/* Metadata Pills Full-Width Strip Skeleton */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-border/50">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>

        {/* Middle Section: 4 Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
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

        {/* Bottom Section: Grade Scale Matrix */}
        <div className="pt-3.5 border-t border-border/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 sm:h-9 w-full rounded-2xl" />
          <div className="relative w-full h-5 flex justify-between gap-2 px-3">
            <Skeleton className="h-3 w-8 rounded opacity-50" />
            <Skeleton className="h-3 w-16 rounded opacity-50" />
            <Skeleton className="h-3 w-12 rounded opacity-50" />
            <Skeleton className="h-3 w-16 rounded opacity-50" />
            <Skeleton className="h-3 w-10 rounded opacity-50" />
            <Skeleton className="h-3 w-12 rounded opacity-50" />
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
