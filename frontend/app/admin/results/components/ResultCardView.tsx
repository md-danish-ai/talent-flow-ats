"use client";

import {
  Phone,
  ArrowRight,
  User2,
  FileText,
  Target,
  Award,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { ResultCard } from "@components/ui-cards/ResultCard";
import { type AdminUserResultListItem } from "@types";
import { getGradeConfig, formatLongDate } from "@lib/utils";

interface ResultCardViewProps {
  items: AdminUserResultListItem[];
}

export function ResultCardView({ items }: ResultCardViewProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {items.map((item) => {
          const latest = item.latest_attempt;
          const interviewDate = latest?.submitted_at || latest?.started_at;
          const detailHref = `/admin/results/round-1/${item.user_id}`;
          const itemStatus = (
            item.status ||
            latest?.status ||
            (item.requires_interview === false ? "not_required" : "ready")
          ).toLowerCase();

          return (
            <ResultCard
              key={latest?.attempt_id ?? item.user_id}
              title={item.username || "Anonymous Candidate"}
              avatarContent={item.username?.[0]?.toUpperCase() || "A"}
              identityIcon={User2}
              status={
                itemStatus === "not_required"
                  ? "default"
                  : itemStatus === "started" || itemStatus === "inprogress"
                    ? "started"
                    : itemStatus === "auto_submitted"
                      ? "auto_submitted"
                      : itemStatus === "submitted" || itemStatus === "completed"
                        ? "submitted"
                        : itemStatus === "expired"
                          ? "expired"
                          : "not_started"
              }
              statusBadge={
                itemStatus === "not_required" ? (
                  <Badge variant="outline" shape="square" color="default">
                    NOT REQUIRED
                  </Badge>
                ) : itemStatus === "submitted" || itemStatus === "completed" ? (
                  <Badge
                    variant="outline"
                    color="success"
                    animate="pulse"
                    shape="square"
                  >
                    SUBMITTED
                  </Badge>
                ) : itemStatus === "started" || itemStatus === "inprogress" ? (
                  <Badge
                    variant="outline"
                    color="primary"
                    animate="pulse"
                    shape="square"
                  >
                    IN PROGRESS
                  </Badge>
                ) : itemStatus === "auto_submitted" ? (
                  <Badge
                    variant="outline"
                    color="blue"
                    animate="pulse"
                    shape="square"
                  >
                    AUTO SUBMITTED
                  </Badge>
                ) : itemStatus === "expired" ? (
                  <Badge variant="outline" color="error" shape="square">
                    EXPIRED
                  </Badge>
                ) : itemStatus === "ready" ? (
                  <Badge
                    variant="outline"
                    color="blue"
                    animate="pulse"
                    shape="square"
                  >
                    READY
                  </Badge>
                ) : (
                  <Badge variant="outline" shape="square" color="warning">
                    {itemStatus.toUpperCase()}
                  </Badge>
                )
              }
              subtitle={
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                    <Phone size={13} className="text-brand-primary/60" />
                    {item.mobile}
                  </div>
                  {interviewDate && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                        <CalendarDays
                          size={13}
                          className="text-brand-primary/60"
                        />
                        {formatLongDate(interviewDate)}
                      </div>
                    </>
                  )}
                </div>
              }
              metadataBadges={
                <Badge
                  variant="fill"
                  color={item.attempts_count > 1 ? "warning" : "default"}
                  shape="square"
                >
                  {item.attempts_count > 0 ? item.attempts_count : 0}{" "}
                  {item.attempts_count > 1 ? "Attempts" : "Attempt"}
                </Badge>
              }
              metrics={[
                {
                  label: "Assigned Paper",
                  value: latest?.paper_name || "N/A",
                  icon: FileText,
                  color: "text-brand-primary",
                },
                {
                  label: "Score",
                  value: latest?.total_marks
                    ? `${latest.obtained_marks || 0} / ${latest.total_marks}`
                    : "N/A",
                  icon: Target,
                  color: "text-emerald-500",
                },
                {
                  label: "Overall Grade",
                  value:
                    latest?.overall_grade && latest.overall_grade !== "N/A"
                      ? latest.overall_grade
                      : "N/A",
                  icon: Award,
                  color: getGradeConfig(latest?.overall_grade).color,
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
