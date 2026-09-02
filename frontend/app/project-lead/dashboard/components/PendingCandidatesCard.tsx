"use client";

import React, { memo, RefObject } from "react";
import Link from "next/link";
import { Users, ArrowRight, Loader2 } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { EvaluationTask } from "@types";
import { PendingCandidatesListSkeleton } from "@components/ui-skeleton/ProjectLeadDashboardSkeleton";
import { CandidateItemRow } from "./CandidateItemRow";

interface PendingCandidatesCardProps {
  tasks: EvaluationTask[];
  pendingCount: number;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  observerTarget: RefObject<HTMLDivElement | null>;
  onOpenEvaluation: (task: EvaluationTask) => void;
}

export const PendingCandidatesCard = memo(function PendingCandidatesCard({
  tasks,
  pendingCount,
  loading,
  hasMore,
  loadingMore,
  observerTarget,
  onOpenEvaluation,
}: PendingCandidatesCardProps) {
  return (
    <MainCard
      icon={<Users size={18} />}
      title={
        <div className="flex items-center gap-2.5">
          <span>Pending Candidates</span>
          <Badge
            variant="outline"
            color="primary"
            shape="square"
            className="rounded-md"
          >
            {pendingCount} new
          </Badge>
        </div>
      }
      action={
        <Link href="/project-lead/users">
          <Button
            variant="outline"
            color="primary"
            size="sm"
            className="h-8 rounded-lg text-xs font-bold px-3 flex items-center gap-1.5"
            endIcon={<ArrowRight size={13} />}
          >
            View All
          </Button>
        </Link>
      }
      className="overflow-hidden flex flex-col h-full min-h-[350px]"
      bodyClassName="p-0 flex-1 overflow-hidden flex flex-col"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <PendingCandidatesListSkeleton count={4} />
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <Users size={36} className="text-muted-foreground opacity-50" />
            <Typography variant="body4" className="text-muted-foreground">
              No pending candidates assigned to you.
            </Typography>
          </div>
        ) : (
          tasks.map((task) => (
            <CandidateItemRow
              key={task.id}
              task={task}
              onOpenEvaluation={onOpenEvaluation}
            />
          ))
        )}

        {/* Infinite Scroll Trigger & Bottom Loader */}
        {hasMore && !loading && (
          <div
            ref={observerTarget}
            className="py-2.5 flex justify-center items-center"
          >
            {loadingMore && (
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                <Loader2
                  size={13}
                  className="animate-spin text-brand-primary"
                />
                <span>Loading more candidates...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </MainCard>
  );
});
