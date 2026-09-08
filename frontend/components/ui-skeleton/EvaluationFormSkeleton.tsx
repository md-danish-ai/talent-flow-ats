import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

export function EvaluationFormSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 6 Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Grade and Result Dropdowns */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-36 rounded" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  );
}
