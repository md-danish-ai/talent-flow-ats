import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

export function UserResultDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Top Navigation & Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-48 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* User Information Profile Card Skeleton */}
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-muted/20 p-6 md:p-8",
          STYLE_CONFIG.cardRadius,
        )}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <Skeleton className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-card" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Skeleton className="h-9 w-56 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Skeleton className="h-5 w-32 rounded" />
                <div className="h-4 w-px bg-border/60 hidden md:block" />
                <Skeleton className="h-5 w-24 rounded" />
                <div className="h-4 w-px bg-border/60 hidden md:block" />
                <Skeleton className="h-5 w-48 rounded" />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
              <div
                className={cn(
                  "flex flex-wrap items-center gap-4 px-4 py-3 bg-muted/30 border border-border/40",
                  STYLE_CONFIG.cardRadius,
                )}
              >
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-36 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full flex gap-2 border-b border-border">
        <Skeleton className="h-10 w-44 rounded-t-lg" />
        <Skeleton className="h-10 w-44 rounded-t-lg" />
      </div>

      {/* Attempt History Header */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3 w-64 rounded opacity-60" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        {/* History List Items */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-full bg-muted/10 border border-border/40 p-6 flex flex-col gap-6",
                STYLE_CONFIG.cardRadius,
              )}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex gap-4 w-full md:w-auto">
                  <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-full md:w-64 rounded" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-24 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-16 w-28 rounded-xl" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
