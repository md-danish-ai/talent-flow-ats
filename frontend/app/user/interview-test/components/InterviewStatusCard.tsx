import { useEffect, useRef } from "react";
import { CheckCircle2, Clock3, Lock } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewSection, TimerZone } from "../types";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

interface InterviewStatusCardProps {
  sections: InterviewSection[];
  sectionIndex: number;
  lockedSections: boolean[];
  timerZone: TimerZone;
  answeredCount: number;
  notAttemptedCount: number;
  questionIndex: number;
}

export function InterviewStatusCard({
  sections,
  sectionIndex,
  lockedSections,
  timerZone,
  answeredCount,
  notAttemptedCount,
  questionIndex,
}: InterviewStatusCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = document.getElementById(`section-${sectionIndex}`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [sectionIndex]);

  return (
    <MainCard title="Interview Status" bodyClassName="space-y-4">
      <Alert
        variant="warning"
        className="bg-amber-500/10 border-amber-500/20"
        description={
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-[11px] uppercase tracking-wider">
              Mandatory Locking Policy
            </span>
            <span className="text-[12px] opacity-90">
              Completed sections are permanently locked. You cannot revisit
              them.
            </span>
          </div>
        }
        showIcon={true}
      />

      <div
        ref={scrollContainerRef}
        className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
      >
        {sections.map((section, index) => {
          const isCurrent = index === sectionIndex;
          const isLocked = lockedSections[index];

          return (
            <div
              key={section.id}
              id={`section-${index}`}
              className={cn(
                "group flex flex-col gap-2 rounded-lg border transition-all duration-300",
                isCurrent
                  ? timerZone === "danger"
                    ? "border-red-500 bg-red-500/10 shadow-sm animate-[pulse_0.8s_infinite] p-3"
                    : timerZone === "warn"
                      ? "border-yellow-500 bg-yellow-500/10 shadow-sm animate-pulse p-3"
                      : "border-brand-primary bg-brand-primary/10 shadow-sm p-3"
                  : isLocked
                    ? "border-emerald-500/50 bg-emerald-500/10 p-2.5"
                    : "border-border bg-muted/5 opacity-60 p-2.5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Typography
                    variant={isCurrent ? "body4" : "body5"}
                    weight={isCurrent ? "bold" : "semibold"}
                    className={cn(
                      "transition-all duration-300",
                      isCurrent
                        ? timerZone === "danger"
                          ? "text-red-600"
                          : timerZone === "warn"
                            ? "text-yellow-600"
                            : "text-brand-primary"
                        : "text-foreground opacity-90",
                    )}
                  >
                    {section.title}
                  </Typography>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      shape="square"
                      color={isLocked ? "success" : "warning"}
                      icon={<Clock3 size={11} />}
                      className={cn(!isCurrent && "opacity-70")}
                      animate={isLocked ? "none" : "pulse"}
                    >
                      {section.durationMinutes} Mins Allotted
                    </Badge>

                    {isCurrent && (
                      <Badge
                        variant="outline"
                        shape="square"
                        color="violet"
                        animate="pulse"
                      >
                        QUESTION {questionIndex + 1}/{section.questions.length}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {isCurrent && (
                    <Badge
                      variant="outline"
                      color="primary"
                      shape="square"
                      animate="pulse"
                    >
                      ACTIVE
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge
                      variant="outline"
                      shape="square"
                      color="success"
                      icon={<CheckCircle2 size={12} />}
                      animate="pulse"
                    >
                      LOCKED
                    </Badge>
                  )}
                  {!isCurrent && !isLocked && (
                    <Badge
                      variant="outline"
                      shape="square"
                      color="secondary"
                      icon={<Lock size={12} />}
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
        <div
          className={cn(
            "border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] via-emerald-500/[0.01] to-transparent px-3.5 py-3 shadow-[0_4px_12px_rgba(16,185,129,0.03)]",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <Typography
            variant="body5"
            className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]"
          >
            Answered
          </Typography>
          <Typography
            variant="h3"
            weight="black"
            className="text-emerald-500 mt-1"
          >
            {answeredCount}
          </Typography>
        </div>
        <div
          className={cn(
            "border border-rose-500/20 bg-gradient-to-br from-rose-500/[0.04] via-rose-500/[0.01] to-transparent px-3.5 py-3 shadow-[0_4px_12px_rgba(244,63,94,0.03)]",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <Typography
            variant="body5"
            className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-[10px]"
          >
            Not Attempted
          </Typography>
          <Typography
            variant="h3"
            weight="black"
            className="text-rose-500 mt-1"
          >
            {notAttemptedCount}
          </Typography>
        </div>
      </div>
    </MainCard>
  );
}
