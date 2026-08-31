import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { PaperOverviewCardSkeleton } from "@components/features/paper-setup/PaperOverviewCard";

export function AutoAssignSkeleton() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <PaperOverviewCardSkeleton className="mb-6" />

      {/* Subject Card Skeletons */}
      <div className="grid grid-cols-1 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2rem] border border-border/40 bg-white dark:bg-slate-900 shadow-sm p-6 overflow-hidden"
          >
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
