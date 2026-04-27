"use client";

import { UserCheck, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { EmptyState } from "@components/ui-elements/EmptyState";

import { EvaluationTask } from "@types";

interface CandidateListProps {
  tasks: EvaluationTask[];
  loading: boolean;
}

export function CandidateList({ tasks, loading }: CandidateListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 w-full rounded-2xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        variant="database"
        title="No candidates found"
        description="You don't have any assigned candidates in this category."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex flex-col h-full space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <User size={24} />
              </div>
              <div>
                <Typography
                  variant="body3"
                  className="font-bold leading-none mb-1 uppercase"
                >
                  {task.candidate_name}
                </Typography>
                <Typography variant="body5" className="text-muted-foreground mb-1">
                   {task.candidate_mobile}
                </Typography>
                <Badge
                  variant="outline"
                  color="default"
                  className="text-[10px] uppercase font-black"
                >
                  Round 2 Assignment
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <Typography
                  variant="body5"
                  className="text-muted-foreground font-medium mb-1"
                >
                  Assignment Status
                </Typography>
                <div className="flex items-center justify-between">
                  <Typography variant="body4" className="font-bold capitalize">
                    {task.status}
                  </Typography>
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${task.status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                </div>
              </div>
            </div>

            <Link
              href={`/project-lead/users/${task.user_id}?evaluation_id=${task.id}`}
            >
              <Button
                className="w-full h-12 rounded-2xl font-bold group-hover:shadow-lg group-hover:shadow-brand-primary/20 transition-all"
                startIcon={<UserCheck size={18} />}
                endIcon={<ArrowRight size={18} className="ml-auto" />}
              >
                {task.status === "completed"
                  ? "View Evaluation"
                  : "Start Interview"}
              </Button>
            </Link>
          </div>

          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
