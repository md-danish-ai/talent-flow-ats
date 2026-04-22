import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

/**
 * Skeleton for the top row StatCards
 */
export const StatCardSkeleton = () => (
  <div className="bg-card p-6 rounded-[24px] border border-border/80 shadow-sm flex items-center gap-6 overflow-hidden">
    <Skeleton className="w-16 h-16 rounded-[20px] shrink-0" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="h-10 w-20 rounded-md" />
    </div>
  </div>
);

/**
 * Skeleton for the Pulse Cards (Dashboard Pulse section)
 */
export const PulseCardSkeleton = () => (
  <div className="flex items-center gap-6 p-6 rounded-[24px] bg-card border border-border/80 shadow-sm overflow-hidden">
    <Skeleton className="w-16 h-16 rounded-[20px] shrink-0" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-4 w-28 rounded-full" />
      <Skeleton className="h-10 w-20 rounded-md" />
      <Skeleton className="h-3 w-32 rounded-full" />
    </div>
  </div>
);

/**
 * Skeleton for the Performance Insight Cards
 */
export const InsightCardSkeleton = () => (
  <div className="relative p-6 rounded-[24px] border border-border/80 bg-card overflow-hidden flex items-center gap-6 shadow-sm">
    <Skeleton className="w-16 h-16 rounded-[20px] shrink-0" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-4 w-20 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
    {/* Left border indicator skeleton */}
    <Skeleton className="absolute inset-y-0 left-0 w-1.5 rounded-none" />
  </div>
);

/**
 * Skeleton for the Activity items list
 */
export const ActivitySkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="p-1 space-y-1">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="flex items-start gap-4 p-4 rounded-2xl border border-transparent"
      >
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Full Dashboard Overview Skeleton Layout
 */
export const DashboardOverviewSkeleton = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Pulse Section Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-6 h-full space-y-6">
            <Skeleton className="h-6 w-48 rounded-full mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <PulseCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Activity Section Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6 h-full space-y-6">
            <Skeleton className="h-6 w-40 rounded-full mb-8" />
            <ActivitySkeleton />
          </div>
        </div>
      </div>

      {/* Insight Section Skeleton */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <Skeleton className="h-6 w-52 rounded-full mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <InsightCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
