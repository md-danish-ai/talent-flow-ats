import { useEffect, useRef } from "react";
import { CheckCircle2, Clock3, Lock } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewSection, TimerZone } from "../types";
import { cn } from "@lib/utils";

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
    if (activeElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.offsetHeight;
      const containerHeight = container.offsetHeight;

      // Scroll so that active element is positioned nicely
      container.scrollTo({
        top: elementTop - containerHeight / 2 + elementHeight / 2,
        behavior: "smooth",
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
                "group flex flex-col gap-2 rounded-xl border transition-all duration-300",
                isCurrent
                  ? timerZone === "danger"
                    ? "border-red-500 bg-red-500/10 shadow-sm animate-[pulse_0.8s_infinite] p-3"
                    : timerZone === "warn"
                      ? "border-yellow-500 bg-yellow-500/10 shadow-sm animate-pulse p-3"
                      : "border-brand-primary bg-brand-primary/10 shadow-sm p-3"
                  : isLocked
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-80 p-2.5"
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
                      color={isCurrent ? "primary" : "default"}
                      icon={<Clock3 size={11} />}
                      className={cn(
                        "text-[10px] py-0.5 px-2 font-bold",
                        !isCurrent && "opacity-70",
                      )}
                    >
                      {section.durationMinutes} Mins Allotted
                    </Badge>

                    {isCurrent && (
                      <Badge
                        variant="fill"
                        color="warning"
                        className="text-[10px] py-0.5 px-2 font-black shadow-sm"
                      >
                        QUESTION {questionIndex + 1}/{section.questions.length}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {isCurrent && (
                    <Badge
                      color="primary"
                      className="animate-pulse shadow-brand-200"
                    >
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
