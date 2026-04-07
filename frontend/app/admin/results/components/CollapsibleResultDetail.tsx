"use client";

import { CheckCircle2, History as HistoryIcon, LayoutGrid, UserX } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { cn } from "@lib/utils";
import { AdminUserLatestAttempt } from "@lib/api/results";

interface CollapsibleResultDetailProps {
  latest?: AdminUserLatestAttempt | null;
  attempts_count: number;
}

export function CollapsibleResultDetail({
  latest,
  attempts_count,
}: CollapsibleResultDetailProps) {
  return (
    <div className="p-8 bg-muted/5 space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography
            variant="body4"
            className="font-bold border-l-4 border-brand-primary pl-3"
          >
            Detailed Subject Performance
          </Typography>
          <div className="flex flex-col items-end">
            <Typography variant="body5" className="text-muted-foreground">
              Attempt ID: #{latest?.attempt_id}
            </Typography>
            <Typography
              variant="body5"
              className="font-bold text-brand-primary uppercase text-[9px] tracking-widest mt-1"
            >
              Total History: {attempts_count} Sessions
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest?.subject_results?.map((res, ridx) => (
            <div
              key={ridx}
              className="bg-card p-4 rounded-2xl border border-border/40 flex items-center justify-between shadow-sm"
            >
              <div>
                <Typography
                  variant="body5"
                  className="font-medium text-muted-foreground mb-1"
                >
                  {res.section_name}
                </Typography>
                <Typography variant="body2" className="font-bold">
                  {res.obtained} / {res.max}
                </Typography>
              </div>
              <Badge
                variant="fill"
                color={
                  res.grade === "Excellent" || res.grade === "Good"
                    ? "success"
                    : res.grade === "Average"
                    ? "warning"
                    : "error"
                }
                className="rounded-lg font-bold text-[10px] px-2 h-6"
              >
                {res.grade}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {latest?.typing_stats && (
        <div className="space-y-6">
          <Typography
            variant="body4"
            className="font-bold border-l-4 border-orange-500 pl-3"
          >
            Typing Test Result
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Words Per Minute",
                value: `${latest.typing_stats.wpm} WPM`,
                icon: <LayoutGrid size={18} />,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                label: "Accuracy",
                value: `${latest.typing_stats.accuracy}%`,
                icon: <CheckCircle2 size={18} />,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Total Errors",
                value: latest.typing_stats.errors,
                icon: <UserX size={18} />,
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
              {
                label: "Time Taken",
                value: `${Math.floor(latest.typing_stats.time_taken / 60)}m ${
                  latest.typing_stats.time_taken % 60
                }s`,
                icon: <HistoryIcon size={18} />,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
            ].map((stat, sidx) => (
              <div
                key={sidx}
                className="bg-card p-4 rounded-2xl border border-border/40 shadow-sm flex items-center gap-4"
              >
                <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <Typography variant="body5" className="text-muted-foreground font-medium">
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" className="font-bold">
                    {stat.value}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
