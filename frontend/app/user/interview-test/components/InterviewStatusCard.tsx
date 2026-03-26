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
  answeredCount: number;
  notAttemptedCount: number;
}

export function InterviewStatusCard({
  sections,
  sectionIndex,
  lockedSections,
  timerZone,
  answeredCount,
  notAttemptedCount,
}: InterviewStatusCardProps) {
  return (
    <MainCard
      title="Interview Status"
      bodyClassName="space-y-4"
    >
      <Alert
        variant="warning"
        description="Section lock is mandatory. Once section is completed, you cannot go back."
        showIcon={false}
      />

      <div className="space-y-3">
        {sections.map((section, index) => {
          const isCurrent = index === sectionIndex;
          const isLocked = lockedSections[index];

          return (
            <div
              key={section.id}
              className={`group flex flex-col gap-2 rounded-xl border p-3 transition-all duration-300 ${
                isCurrent
                  ? timerZone === "danger"
                    ? "border-red-500 bg-red-500/10 shadow-sm animate-[pulse_0.8s_infinite]"
                    : timerZone === "warn"
                      ? "border-yellow-500 bg-yellow-500/10 shadow-sm animate-pulse"
                      : "border-brand-primary bg-brand-primary/10 shadow-sm"
                  : isLocked
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-80"
                    : "border-border bg-muted/5 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Typography
                    variant="body4"
                    weight={isCurrent ? "bold" : "semibold"}
                    className={
                      isCurrent
                        ? timerZone === "danger"
                          ? "text-red-600"
                          : timerZone === "warn"
                            ? "text-yellow-600"
                            : "text-brand-primary"
                        : "text-foreground"
                    }
                  >
                    {section.title}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded border border-border/50">
                      <Clock3 size={10} />
                      <span>{section.durationMinutes} Mins Allotted</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {isCurrent && (
                    <Badge color="primary" className="animate-pulse shadow-brand-200">
                      ACTIVE
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge
                      variant="outline"
                      color="success"
                      icon={<CheckCircle2 size={12} />}
                      className="bg-emerald-50"
                    >
                      LOCKED
                    </Badge>
                  )}
                  {!isCurrent && !isLocked && (
                    <Badge
                      variant="outline"
                      color="default"
                      icon={<Lock size={12} />}
                      className="bg-background"
                    >
                      PENDING
                    </Badge>
                  )}
                </div>
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
