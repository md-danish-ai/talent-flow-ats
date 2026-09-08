"use client";

import React, { memo } from "react";
import { EvaluationTask } from "@types";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { ClipboardEdit, Eye } from "lucide-react";
import { cn } from "@lib/utils";

interface CandidateItemRowProps {
  task: EvaluationTask;
  onOpenEvaluation: (task: EvaluationTask) => void;
}

export const CandidateItemRow = memo(function CandidateItemRow({
  task,
  onOpenEvaluation,
}: CandidateItemRowProps) {
  const initials = task.candidate_name
    ? task.candidate_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NA";

  const isPending = task.status === "pending";

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5",
        isPending
          ? "border-2 border-brand-primary/40 dark:border-brand-primary/30 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] hover:border-brand-primary dark:hover:border-brand-primary hover:bg-brand-primary/[0.06] dark:hover:bg-brand-primary/[0.09] shadow-sm hover:shadow-lg hover:shadow-brand-primary/15 dark:hover:shadow-brand-primary/25"
          : "border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-500/[0.06] dark:hover:bg-emerald-500/[0.09] shadow-sm hover:shadow-lg hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/25",
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm border border-brand-primary/20 shrink-0 transition-transform group-hover:scale-105 shadow-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <Typography
            variant="body3"
            className="font-extrabold text-foreground truncate text-sm sm:text-base leading-tight"
          >
            {task.candidate_name}
          </Typography>
          <div className="flex items-center gap-2 mt-1">
            {task.round_type && (
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary px-1.5 py-0.5 bg-brand-primary/5 rounded border border-brand-primary/20">
                {task.round_type}
              </span>
            )}
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border",
                isPending
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
              )}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant={isPending ? "primary" : "outline"}
        color={isPending ? "primary" : "success"}
        size="sm"
        startIcon={isPending ? <ClipboardEdit size={18} /> : <Eye size={13} />}
        onClick={() => onOpenEvaluation(task)}
        animate="scale"
      >
        {isPending ? "Start Evaluation" : "View Evaluation"}
      </Button>
    </div>
  );
});
