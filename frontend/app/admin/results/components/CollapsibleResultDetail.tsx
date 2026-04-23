"use client";

import {
  CheckCircle2,
  History as HistoryIcon,
  LayoutGrid,
  UserX,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { cn } from "@lib/utils";
import { type AdminUserLatestAttempt } from "@types";

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
              className="group relative bg-card p-5 rounded-2xl border border-border/50 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <Typography
                  variant="body4"
                  className="font-bold text-slate-700 dark:text-slate-200 leading-tight line-clamp-2"
                >
                  {res.section_name}
                </Typography>
                <Badge
                  variant="fill"
                  shape="square"
                  color={
                    res.grade === "Excellent" || res.grade === "Good"
                      ? "success"
                      : res.grade === "Average"
                        ? "warning"
                        : "error"
                  }
                  className="text-[9px] px-1.5 py-0 h-5 shrink-0 font-bold tracking-wider"
                >
                  {res.grade}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-end gap-1.5">
                  <span className="text-xl font-black text-brand-primary leading-none">
                    {res.obtained_marks}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground/80 mb-[2px]">
                    / {res.total_marks}
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden shrink-0">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      res.percentage >= 80
                        ? "bg-emerald-500"
                        : res.percentage >= 60
                          ? "bg-brand-primary"
                          : res.percentage >= 40
                            ? "bg-amber-500"
                            : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(res.percentage || 0, 100)}%` }}
                  />
                </div>
              </div>
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
                value:
                  latest.typing_stats.time_taken < 60
                    ? `${Math.round(latest.typing_stats.time_taken)}s`
                    : `${Math.floor(latest.typing_stats.time_taken / 60)}m ${Math.round(
                        latest.typing_stats.time_taken % 60,
                      )}s`,
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
                  <Typography
                    variant="body5"
                    className="text-muted-foreground font-medium"
                  >
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
