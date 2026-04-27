import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

export function AutoAssignSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Card Skeleton */}
      <div className="flex flex-col gap-8 mb-6 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-border/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-6">
          <div className="flex items-center gap-6">
            <Skeleton className="min-w-[3.5rem] w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 lg:w-96 rounded" />
              <Skeleton className="h-4 w-48 lg:w-64 rounded" />
            </div>
          </div>
          <div className="flex bg-slate-50 dark:bg-slate-800/40 border border-border px-6 py-4 rounded-[1rem] gap-3.5 items-center shrink-0">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-16 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-2 w-12 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-2">
          <div className="md:col-span-8 p-6 rounded-2xl border border-border/40 relative">
            <Skeleton className="absolute -top-3 left-6 h-6 w-32 rounded-full" />
            <Skeleton className="h-4 w-full rounded mt-2" />
          </div>
          <div className="md:col-span-4 p-6 rounded-2xl border border-border/40 flex flex-col justify-center items-center gap-2">
            <Skeleton className="h-2.5 w-20 rounded" />
            <Skeleton className="h-8 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Subject Card Skeletons */}
      <div className="grid grid-cols-1 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[2rem] border border-border/40 bg-white dark:bg-slate-900 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-1.5 h-6 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40 rounded" />
                  <div className="flex gap-4">
                    <Skeleton className="h-2 w-24 rounded-full" />
                    <Skeleton className="h-2 w-24 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2">
                  <Skeleton className="h-10 w-20 rounded-xl" />
                  <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pb-20" />
    </div>
  );
}
