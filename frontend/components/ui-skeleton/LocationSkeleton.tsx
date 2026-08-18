import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";

export function StateListSkeleton() {
  return (
    <div className="space-y-1.5 p-1 animate-in fade-in duration-300">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-lg border border-transparent bg-muted/20"
        >
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DistrictGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-300">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="p-3 bg-background border border-border rounded-lg shadow-sm flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <Skeleton className="w-7 h-7 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
}
