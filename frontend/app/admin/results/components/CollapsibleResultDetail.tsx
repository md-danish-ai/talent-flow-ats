"use client";

import { Gauge, Target, AlertCircle, Timer } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { cn, getGradeConfig } from "@lib/utils";
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
                  color={getGradeConfig(res.grade).badgeColor}
                >
                  {res.grade}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center justify-center">
                  <span className="text-xl font-black text-brand-primary leading-none flex items-baseline gap-1.5">
                    {res.obtained_marks}
                    <span className="text-muted-foreground/30 font-bold text-sm">
                      /
                    </span>
                    {res.total_marks}
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-700/50 rounded-full overflow-hidden shrink-0">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      getGradeConfig(res.grade).barBg,
                    )}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Speed",
                value: `${latest.typing_stats.wpm} WPM`,
                color: "text-amber-500 dark:text-amber-400",
                icon: (
                  <Gauge
                    className="text-amber-500 dark:text-amber-400"
                    size={18}
                  />
                ),
                accentBg: "bg-amber-500/10 dark:bg-amber-500/5",
                accentBorder:
                  "hover:border-amber-500/30 hover:shadow-amber-500/[0.03]",
              },
              {
                label: "Accuracy",
                value: `${latest.typing_stats.accuracy}%`,
                color: "text-emerald-600 dark:text-emerald-400",
                icon: (
                  <Target
                    className="text-emerald-600 dark:text-emerald-400"
                    size={18}
                  />
                ),
                accentBg: "bg-emerald-500/10 dark:bg-emerald-500/5",
                accentBorder:
                  "hover:border-emerald-500/30 hover:shadow-emerald-500/[0.03]",
              },
              {
                label: "Errors",
                value: latest.typing_stats.errors,
                color: "text-rose-500 dark:text-rose-400",
                icon: (
                  <AlertCircle
                    className="text-rose-500 dark:text-rose-400"
                    size={18}
                  />
                ),
                accentBg: "bg-rose-500/10 dark:bg-rose-500/5",
                accentBorder:
                  "hover:border-rose-500/30 hover:shadow-rose-500/[0.03]",
              },
              {
                label: "Duration",
                value:
                  latest.typing_stats.time_taken < 60
                    ? `${Math.round(latest.typing_stats.time_taken)}s`
                    : `${Math.floor(latest.typing_stats.time_taken / 60)}m ${Math.round(
                        latest.typing_stats.time_taken % 60,
                      )}s`,
                color: "text-indigo-500 dark:text-indigo-400",
                icon: (
                  <Timer
                    className="text-indigo-500 dark:text-indigo-400"
                    size={18}
                  />
                ),
                accentBg: "bg-indigo-500/10 dark:bg-indigo-500/5",
                accentBorder:
                  "hover:border-indigo-500/30 hover:shadow-indigo-500/[0.03]",
              },
            ].map((stat, sidx) => (
              <div
                key={sidx}
                className={`group/stat p-5 rounded-2xl border border-border/50 dark:border-white/[0.04] bg-card/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg flex items-center justify-between relative overflow-hidden ${stat.accentBorder}`}
              >
                {/* Subtle background glow flare */}
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 ${stat.accentBg} rounded-full blur-xl opacity-60 group-hover/stat:opacity-100 transition-all duration-500 pointer-events-none`}
                />

                <div className="space-y-1.5 relative z-10">
                  <Typography
                    variant="body5"
                    className="font-black text-muted-foreground/60 uppercase tracking-widest text-[10px] select-none"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    className={`font-black ${stat.color} tracking-tighter text-xl md:text-2xl bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text select-none`}
                  >
                    {stat.value}
                  </Typography>
                </div>

                <div
                  className={`h-10 w-10 rounded-xl ${stat.accentBg} border border-border/20 dark:border-white/[0.02] flex items-center justify-center shadow-sm relative z-10 group-hover/stat:scale-110 transition-all duration-300`}
                >
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
