import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { StatCardSkeleton } from "@components/ui-skeleton/DashboardSkeleton";
import { PageContainer } from "@components/ui-layout/PageContainer";

/**
 * Skeleton for single candidate row in Pending Candidates list
 */
export const CandidateRowSkeleton = () => (
  <div className="flex items-center justify-between p-3.5 bg-muted/10 dark:bg-slate-900/40 border border-border/30 rounded-xl animate-pulse">
    <div className="flex items-center gap-3 min-w-0">
      {/* Avatar */}
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="space-y-1.5 min-w-0">
        {/* Candidate Name */}
        <Skeleton className="h-4 w-32 rounded-md" />
        {/* Badges (Round & Status) */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
      </div>
    </div>
    {/* Evaluation Action Button */}
    <Skeleton className="h-8 w-28 rounded-lg shrink-0 ml-3" />
  </div>
);

/**
 * Skeleton for the full Pending Candidates list
 */
export const PendingCandidatesListSkeleton = ({
  count = 4,
}: {
  count?: number;
}) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <CandidateRowSkeleton key={i} />
    ))}
  </div>
);

/**
 * Skeleton for single notification row in Recent Notifications list
 */
export const NotificationRowSkeleton = () => (
  <div className="flex items-start gap-3.5 p-3.5 border border-border/30 rounded-xl bg-muted/10 dark:bg-slate-900/40 animate-pulse">
    {/* Icon box */}
    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        {/* Title */}
        <Skeleton className="h-4 w-40 rounded-md" />
        {/* Status tag & time */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Skeleton className="h-3.5 w-10 rounded" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
      {/* Notification Message preview */}
      <div className="space-y-1">
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-4/5 rounded-md" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for the full Recent Notifications list
 */
export const RecentNotificationsListSkeleton = ({
  count = 4,
}: {
  count?: number;
}) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <NotificationRowSkeleton key={i} />
    ))}
  </div>
);

/**
 * Full Project Lead Dashboard Skeleton Layout
 */
export const ProjectLeadDashboardSkeleton = () => {
  return (
    <PageContainer className="space-y-6 flex flex-col lg:h-[calc(100vh-100px)] pb-4 pt-1.5 overflow-hidden animate-in fade-in duration-300">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0 p-1">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Card 1: Pending Candidates Skeleton */}
        <div className="bg-card border border-border rounded-2xl flex flex-col h-full min-h-[350px] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-5 h-5 rounded shrink-0" />
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <PendingCandidatesListSkeleton count={10} />
          </div>
        </div>

        {/* Card 2: Recent Notifications Skeleton */}
        <div className="bg-card border border-border rounded-2xl flex flex-col h-full min-h-[350px] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-5 h-5 rounded shrink-0" />
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-14 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <RecentNotificationsListSkeleton count={10} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
