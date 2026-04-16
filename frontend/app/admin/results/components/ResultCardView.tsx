"use client";

import {
  Phone,
  ArrowRight,
  History as HistoryIcon,
  CheckCircle2,
  CircleAlert,
  User2,
} from "lucide-react";
import { ResultCard } from "@components/ui-cards/ResultCard";
import { AdminUserResultListItem } from "@lib/api/results";

interface ResultCardViewProps {
  items: AdminUserResultListItem[];
}

export function ResultCardView({ items }: ResultCardViewProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {items.map((item) => {
          const latest = item.latest_attempt;
          const detailHref = `/admin/results/${item.user_id}`;

          return (
            <ResultCard
              key={latest?.attempt_id ?? item.user_id}
              title={item.username || "Anonymous Candidate"}
              avatarContent={item.username?.[0]?.toUpperCase() || "A"}
              identityIcon={User2}
              status={latest?.status || "not_started"}
              subtitle={
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                    <Phone size={13} className="text-brand-primary/60" />
                    {item.mobile}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                    <HistoryIcon size={13} className="text-brand-primary/60" />
                    {item.attempts_count} Sessions
                  </div>
                </div>
              }
              metrics={[
                {
                  label: "Total Questions",
                  value: latest?.total_questions || "N/A",
                  icon: HistoryIcon,
                  color: "text-brand-primary",
                },
                {
                  label: "Completion",
                  value: latest
                    ? `${latest.attempted_count}/${latest.total_questions}`
                    : "0/0",
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                },
                {
                  label: "Missed",
                  value: latest?.unattempted_count || 0,
                  icon: CircleAlert,
                  color: "text-rose-500",
                },
              ]}
              actionHref={detailHref}
              actionLabel="View Result"
              actionIcon={ArrowRight}
            />
          );
        })}
      </div>
    </div>
  );
}
