"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  Clock,
  MessageSquare,
  ShieldCheck,
  Award,
  Calendar,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { evaluationsApi } from "@lib/api";
import { cn } from "@lib/utils";

import { EvaluationHistoryItem } from "@types";

interface Round2HistoryProps {
  userId: number;
}

const ratingColors: Record<string, { bg: string; text: string; dot: string }> =
  {
    Excellent: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      dot: "bg-emerald-500",
    },
    Good: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
    Average: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      dot: "bg-amber-500",
    },
    Poor: { bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },
  };

export function Round2History({ userId }: Round2HistoryProps) {
  const [history, setHistory] = useState<EvaluationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await evaluationsApi.getEvaluationHistory(userId);
        setHistory(res || []);
      } catch (err) {
        console.error("Failed to fetch R2 history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/50"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <EmptyState
        variant="search"
        title="No Round 2 History"
        description="This candidate hasn't been assigned to any Project Leads for Face-to-Face interviews yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      {history.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1"
        >
          {/* Top Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-inner">
                <UserCheck size={24} />
              </div>
              <div>
                <Typography
                  variant="body3"
                  className="font-black tracking-tight uppercase"
                >
                  Interview with {item.lead_name}
                </Typography>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={13} className="opacity-70" />
                    <Typography
                      variant="body5"
                      className="text-[11px] font-bold"
                    >
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={13} className="opacity-70" />
                    <Typography
                      variant="body5"
                      className="text-[11px] font-bold uppercase"
                    >
                      Round 2
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                shape="square"
                color={item.status === "completed" ? "success" : "warning"}
                className="uppercase  text-[10px] font-black h-7 px-3"
              >
                {item.status}
              </Badge>
              {item.overall_grade && (
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 h-7 rounded-md shadow-lg",
                    item.overall_grade === "Excellent"
                      ? "bg-emerald-500 shadow-emerald-500/20"
                      : item.overall_grade === "Good"
                        ? "bg-blue-600 shadow-blue-500/20"
                        : item.overall_grade === "Average"
                          ? "bg-amber-500 shadow-amber-500/20"
                          : "bg-rose-500 shadow-rose-500/20",
                  )}
                >
                  <Award size={14} className="text-white" />
                  <Typography
                    variant="body5"
                    className="text-white font-black uppercase text-[10px] tracking-widest"
                  >
                    {item.overall_grade}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Metrics Visualization */}
            {item.status === "completed" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-muted-foreground" />
                  <Typography
                    variant="body5"
                    className="font-black uppercase tracking-widest text-muted-foreground text-[10px]"
                  >
                    Evaluation Metrics
                  </Typography>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {Object.entries(item.evaluation_data || {}).map(
                    ([metric, rating]: [string, string]) => {
                      const colors =
                        ratingColors[rating] || ratingColors.Average;
                      return (
                        <div
                          key={metric}
                          className={cn(
                            "group/metric relative p-4 rounded-2xl border transition-all duration-300",
                            "bg-muted/30 border-border/50 hover:bg-white dark:hover:bg-white/5 hover:border-border hover:shadow-md",
                          )}
                        >
                          <Typography
                            variant="body5"
                            className="text-muted-foreground font-bold mb-2 truncate uppercase text-[9px] tracking-tight"
                          >
                            {metric.replace("_", " ")}
                          </Typography>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                colors.dot,
                              )}
                            />
                            <Typography
                              variant="body4"
                              className={cn(
                                "font-black text-[13px]",
                                colors.text,
                              )}
                            >
                              {rating}
                            </Typography>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            {/* Verdict & Comments Section */}
            {item.status === "completed" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative group/verdict overflow-hidden p-5 rounded-[20px] bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                      <ShieldCheck size={18} />
                    </div>
                    <Typography
                      variant="body5"
                      className="font-black uppercase tracking-widest text-emerald-600/80 text-[10px]"
                    >
                      Final Verdict
                    </Typography>
                  </div>
                  <Typography
                    variant="body3"
                    className="font-black text-emerald-900 dark:text-emerald-50 transition-colors"
                  >
                    {item.verdict_name || "Decision Pending"}
                  </Typography>
                </div>

                <div className="relative group/comments overflow-hidden p-5 rounded-[20px] bg-slate-500/5 border border-slate-500/10 transition-all hover:bg-slate-500/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center text-slate-600">
                      <MessageSquare size={18} />
                    </div>
                    <Typography
                      variant="body5"
                      className="font-black uppercase tracking-widest text-slate-600/80 text-[10px]"
                    >
                      Interviewer Comments
                    </Typography>
                  </div>
                  <Typography
                    variant="body4"
                    className="text-slate-700 dark:text-slate-300 italic line-clamp-2 hover:line-clamp-none transition-all cursor-default"
                  >
                    {item.comments}
                  </Typography>
                </div>
              </div>
            )}

            {/* Pending State */}
            {(item.status === "pending" || !item.status) && (
              <div className="flex flex-col items-center justify-center py-10 bg-muted/10 rounded-[20px] border border-dashed border-border/60">
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3 animate-pulse">
                  <Clock size={24} className="text-muted-foreground/40" />
                </div>
                <Typography
                  variant="body4"
                  className="text-muted-foreground font-bold uppercase tracking-widest text-[11px]"
                >
                  Evaluation in Progress
                </Typography>
                <Typography
                  variant="body5"
                  className="text-muted-foreground/60 mt-1"
                >
                  Waiting for {item.lead_name} to submit the report
                </Typography>
              </div>
            )}
          </div>

          {/* Bottom subtle bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
