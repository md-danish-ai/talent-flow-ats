import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { MainCard } from "@components/ui-cards/MainCard";

export function PaperFormSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Header Card */}
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-48 rounded" />
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        }
      >
        <div className="space-y-6 pt-2">
          {/* Form Fields: Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </MainCard>

      {/* Subject Configuration Table Card */}
      <MainCard
        title={
          <div className="space-y-1">
            <Skeleton className="h-6 w-56 rounded" />
            <Skeleton className="h-4 w-72 rounded mt-1" />
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-7 gap-4 p-3 bg-muted/40 rounded-xl">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* Table Rows Skeleton */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-7 gap-4 p-3.5 border border-border/50 rounded-xl items-center"
            >
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-8 w-12 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}

          {/* Summary Badges Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>
        </div>
      </MainCard>
    </div>
  );
}
