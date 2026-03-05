import { CheckCircle2, Clock3, Lock } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewSection, TimerZone } from "../types";

interface InterviewStatusCardProps {
  sections: InterviewSection[];
  sectionIndex: number;
  lockedSections: boolean[];
  timerZone: TimerZone;
  remainingTimeText: string;
  answeredCount: number;
  notAttemptedCount: number;
}

export function InterviewStatusCard({
  sections,
  sectionIndex,
  lockedSections,
  timerZone,
  remainingTimeText,
  answeredCount,
  notAttemptedCount,
}: InterviewStatusCardProps) {
  return (
    <MainCard
      title="Interview Status"
      bodyClassName="space-y-4"
      action={
        <Badge
          variant="outline"
          color={
            timerZone === "danger"
              ? "error"
              : timerZone === "warn"
                ? "warning"
                : "success"
          }
          icon={<Clock3 size={14} />}
          className="font-mono"
        >
          {remainingTimeText}
        </Badge>
      }
    >
      <Alert
        variant="warning"
        description="Section lock is mandatory. Once section is completed, you cannot go back."
        showIcon={false}
      />

      <div className="space-y-2">
        {sections.map((section, index) => {
          const isCurrent = index === sectionIndex;
          const isLocked = lockedSections[index];

          return (
            <div
              key={section.id}
              className={`rounded-lg border px-3 py-3 ${
                isCurrent
                  ? "border-brand-primary bg-brand-primary/10"
                  : isLocked
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-border bg-muted/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Typography
                  variant="body4"
                  className={`break-words ${
                    isCurrent ? "text-brand-primary" : "text-foreground"
                  }`}
                >
                  {section.title}
                </Typography>
                {isCurrent && <Badge color="primary">Active</Badge>}
                {isLocked && (
                  <Badge
                    variant="outline"
                    color="success"
                    icon={<CheckCircle2 size={12} />}
                  >
                    Locked
                  </Badge>
                )}
                {!isCurrent && !isLocked && (
                  <Badge variant="outline" color="default" icon={<Lock size={12} />}>
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
          <Typography variant="body5">Answered</Typography>
          <Typography variant="h4" className="text-foreground mt-1">
            {answeredCount}
          </Typography>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
          <Typography variant="body5">Not Attempted</Typography>
          <Typography variant="h4" className="text-foreground mt-1">
            {notAttemptedCount}
          </Typography>
        </div>
      </div>
    </MainCard>
  );
}
