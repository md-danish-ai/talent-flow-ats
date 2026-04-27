"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  Clock,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { evaluationsApi } from "@lib/api";

import { EvaluationHistoryItem } from "@types";

interface Round2HistoryProps {
  userId: number;
}

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
            className="h-32 w-full rounded-2xl bg-muted animate-pulse"
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
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <UserCheck size={20} />
              </div>
              <div>
                <Typography variant="body4" className="font-bold">
                  Interview with {item.lead_name}
                </Typography>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={12} />
                  <Typography variant="body5" className="text-[11px]">
                    Assigned on {new Date(item.created_at).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                color={item.status === "completed" ? "success" : "warning"}
                shape="square"
                className="uppercase tracking-widest text-[10px] font-black"
              >
                {item.status}
              </Badge>
              {item.overall_grade && (
                <Badge
                  color="primary"
                  variant="fill"
                  shape="square"
                  className="font-bold"
                >
                  {item.overall_grade}
                </Badge>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          {item.status === "completed" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {Object.entries(item.evaluation_data || {}).map(
                ([metric, rating]: [string, string]) => (
                  <div
                    key={metric}
                    className="p-3 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <Typography
                      variant="body5"
                      className="text-muted-foreground font-medium mb-1 truncate capitalize"
                    >
                      {metric.replace("_", " ")}
                    </Typography>
                    <Typography
                      variant="body4"
                      className={`font-bold text-[13px] ${
                        rating === "Excellent"
                          ? "text-emerald-600"
                          : rating === "Good"
                            ? "text-blue-600"
                            : rating === "Average"
                              ? "text-amber-600"
                              : "text-rose-600"
                      }`}
                    >
                      {rating}
                    </Typography>
                  </div>
                ),
              )}
            </div>
          )}

          {/* Verdict & Comments */}
          {item.status === "completed" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
                <ShieldCheck
                  size={20}
                  className="text-brand-primary shrink-0 mt-0.5"
                />
                <div>
                  <Typography
                    variant="body5"
                    className="font-bold uppercase tracking-wider text-brand-primary/80 mb-1"
                  >
                    Final Verdict
                  </Typography>
                  <Typography
                    variant="body4"
                    className="font-black text-slate-900 dark:text-white"
                  >
                    {item.verdict_name || "Decision Pending"}
                  </Typography>
                </div>
              </div>

              {item.comments && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-border/50">
                  <MessageSquare
                    size={20}
                    className="text-muted-foreground shrink-0 mt-0.5"
                  />
                  <div>
                    <Typography
                      variant="body5"
                      className="font-bold uppercase tracking-wider text-muted-foreground mb-1"
                    >
                      Interviewer Comments
                    </Typography>
                    <Typography
                      variant="body4"
                      className="text-slate-700 dark:text-slate-300 italic"
                    >
                      {item.comments}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          )}

          {(item.status === "pending" || !item.status) && (
            <div className="flex flex-col items-center justify-center py-8 bg-muted/10 rounded-xl border border-dashed border-border">
              <Clock size={32} className="text-muted-foreground/30 mb-2" />
              <Typography
                variant="body5"
                className="text-muted-foreground font-medium"
              >
                Waiting for Project Lead to submit evaluation...
              </Typography>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
