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
    <div className="flex items-center justify-between p-3.5 bg-muted/10 dark:bg-slate-900/40 border border-border/30 rounded-xl hover:bg-muted/20 dark:hover:bg-slate-900/60 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm border border-brand-primary/20 shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <Typography
            variant="body3"
            className="font-extrabold text-foreground truncate"
          >
            {task.candidate_name}
          </Typography>
          <div className="flex items-center gap-2 mt-0.5">
            {task.round_type && (
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary px-1.5 py-0.5 bg-brand-primary/5 rounded border border-brand-primary/20">
                {task.round_type}
              </span>
            )}
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border",
                isPending
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-500"
                  : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500",
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
        className="rounded-lg h-8 text-[11px] font-extrabold flex items-center gap-1.5 shrink-0 ml-3"
        startIcon={isPending ? <ClipboardEdit size={13} /> : <Eye size={13} />}
        onClick={() => onOpenEvaluation(task)}
      >
        {isPending ? "Start Evaluation" : "View Evaluation"}
      </Button>
    </div>
  );
});
