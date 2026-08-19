"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  Clock,
  MessageSquareQuote,
  ShieldCheck,
  Award,
  Calendar,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Avatar } from "@components/ui-elements/Avatar";
import { evaluationsApi } from "@lib/api";
import { cn, formatDate, formatTime, humanizeString } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { toast } from "@lib/toast";

import { EvaluationHistoryItem } from "@types";

interface Round2HistoryProps {
  userId: number;
}

const EVALUATION_METRICS = [
  "Communication",
  "Domain Knowledge",
  "Critical Thinking",
  "Professionalism",
  "Cultural Fit",
  "Learning Ability",
] as const;

const ratingColors: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  Excellent: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-500/20",
  },
  Good: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    border: "border-blue-500/20",
  },
  Average: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-500/20",
  },
  Poor: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    border: "border-rose-500/20",
  },
};

export function Round2History({ userId }: Round2HistoryProps) {
  const [history, setHistory] = useState<EvaluationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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

  const handleCopyComments = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Interviewer comments copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-64 w-full bg-card/60 animate-pulse border border-border/70 p-6 space-y-4",
              STYLE_CONFIG.cardRadius,
            )}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted/40 rounded-xl" />
                <div className="space-y-2">
                  <div className="w-48 h-5 bg-muted/40 rounded" />
                  <div className="w-32 h-4 bg-muted/40 rounded" />
                </div>
              </div>
              <div className="w-24 h-7 bg-muted/40 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="h-16 bg-muted/30 rounded-xl" />
              ))}
            </div>
            <div className="h-20 bg-muted/30 rounded-xl" />
          </div>
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
      {history.map((item) => {
        const isCompleted = item.status === "completed";
        const gradeColor =
          item.overall_grade === "Excellent"
            ? "bg-emerald-500 text-white shadow-emerald-500/20"
            : item.overall_grade === "Good"
              ? "bg-blue-600 text-white shadow-blue-500/20"
              : item.overall_grade === "Average"
                ? "bg-amber-500 text-white shadow-amber-500/20"
                : "bg-rose-500 text-white shadow-rose-500/20";

        return (
          <div
            key={item.id}
            className={cn(
              "bg-card border border-border/70 shadow-sm overflow-hidden space-y-5 p-5 md:p-6 transition-all duration-200 hover:border-border",
              STYLE_CONFIG.cardRadius,
            )}
          >
            {/* Top Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <Avatar
                    name={item.lead_name || "Project Lead"}
                    variant="brand"
                    size="md"
                    className="rounded-xl border border-brand-primary/20"
                  />
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                      isCompleted ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Typography
                      variant="h4"
                      className="font-bold text-foreground text-base sm:text-lg"
                    >
                      Interview with {item.lead_name}
                    </Typography>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-wider">
                      {item.round_type || "F2F"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-orange-500 shrink-0" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-blue-500 shrink-0" />
                      <span>{formatTime(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Overall Grade Badges */}
              <div className="flex items-center gap-2.5 shrink-0">
                <Badge
                  variant="outline"
                  shape="square"
                  color={isCompleted ? "success" : "warning"}
                  className="font-bold text-xs px-3 py-1 uppercase tracking-wider"
                >
                  {item.status}
                </Badge>

                {item.overall_grade && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-lg shadow-sm font-bold text-xs uppercase tracking-wider",
                      gradeColor,
                    )}
                  >
                    <Award size={14} className="shrink-0" />
                    <span>{item.overall_grade}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation Metrics Grid */}
            {isCompleted && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-brand-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Evaluation Metrics
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {EVALUATION_METRICS.map((metric) => {
                    const ratingStr = (item.evaluation_data?.[metric] || "").trim();
                    const colors =
                      ratingColors[ratingStr] || ratingColors.Average;
                    const hasRating = ratingStr.length > 0;

                    return (
                      <div
                        key={metric}
                        className={cn(
                          "p-3 rounded-xl border transition-all duration-200",
                          hasRating
                            ? cn("bg-muted/20 border-border/60 hover:bg-muted/30")
                            : "bg-muted/10 border-border/30 opacity-60",
                        )}
                      >
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight block truncate mb-1.5">
                          {metric}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {hasRating ? (
                            <>
                              <span
                                className={cn(
                                  "w-2 h-2 rounded-full shrink-0",
                                  colors.dot,
                                )}
                              />
                              <span
                                className={cn(
                                  "font-bold text-xs sm:text-sm",
                                  colors.text,
                                )}
                              >
                                {ratingStr}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground/60 italic">
                              N/A
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Verdict & Comments Section */}
            {isCompleted && (
              <div className="space-y-4 pt-1">
                {/* Final Result Banner */}
                {item.result_name && (
                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-400/80 block">
                        Final Result
                      </span>
                      <span className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                        {item.result_name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Interviewer Comments (Full Untruncated Visible Text) */}
                {item.comments && (
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                        <MessageSquareQuote size={16} className="text-brand-primary" />
                        <span>Interviewer Comments & Feedback</span>
                      </div>
                      <button
                        onClick={() => handleCopyComments(item.id, item.comments || "")}
                        className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-brand-primary transition-colors px-2 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/50"
                        title="Copy comments"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative pl-3.5 border-l-2 border-brand-primary/40">
                      <p className="text-sm font-medium text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {item.comments}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pending Evaluation State */}
            {!isCompleted && (
              <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl bg-muted/10 border border-dashed border-border/60 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center animate-pulse">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                    Evaluation in Progress
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5 block">
                    Waiting for {item.lead_name} to submit the interview report.
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
