import { memo } from "react";
import { Clock3 } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { MainCard } from "@components/ui-cards/MainCard";
import type { InterviewSection, TimerZone } from "../types";

interface InterviewProgressCardProps {
  sectionIndex: number;
  totalSections: number;
  currentSection: InterviewSection;
  progressPercent: number;
  timerZone: TimerZone;
  remainingTimeText: string;
}

export const InterviewProgressCard = memo(function InterviewProgressCard({
  sectionIndex,
  totalSections,
  currentSection,
  progressPercent,
  timerZone,
  remainingTimeText,
}: InterviewProgressCardProps) {
  return (
    <MainCard
      title="Exam Progress"
      bodyClassName="space-y-6"
    >
      {/* Big Digital Timer Display */}
      <div className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-500 bg-gradient-to-br ${
        timerZone === "danger" 
          ? "border-red-500/30 bg-red-50/50 shadow-red-100" 
          : timerZone === "warn"
            ? "border-orange-500/30 bg-orange-50/50 shadow-orange-100"
            : "border-brand-primary/20 bg-brand-primary/5 shadow-brand-100"
      }`}>
        <div className="flex flex-col items-center justify-center space-y-1">
          <Typography 
            variant="body5" 
            weight="black" 
            className={`uppercase tracking-[0.2em] text-[10px] ${
              timerZone === "danger" ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            Time Remaining
          </Typography>
          
          <div className="flex items-baseline gap-1">
            <Typography
              variant="h1"
              weight="black"
              className={`font-mono tabular-nums tracking-tighter text-5xl leading-none transition-colors duration-500 ${
                timerZone === "danger" 
                  ? "text-red-600 animate-pulse" 
                  : timerZone === "warn"
                    ? "text-orange-600"
                    : "text-brand-primary"
              }`}
            >
              {remainingTimeText}
            </Typography>
            <Clock3 className={`w-5 h-5 mb-1 ${
              timerZone === "danger" ? "text-red-500 animate-spin" : "text-muted-foreground/40"
            }`} />
          </div>
        </div>

        {/* Dynamic glow effect */}
        <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-20 ${
          timerZone === "danger" ? "bg-red-500" : "bg-brand-primary"
        }`} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            color="secondary"
            className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter"
          >
            Section {sectionIndex + 1}/{totalSections}
          </Badge>
          <Badge
            variant="outline"
            color="primary"
            className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter"
          >
            {currentSection.title}
          </Badge>
          <Badge
            variant="outline"
            color="default"
            className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter"
          >
            {progressPercent}% Complete
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                timerZone === "danger" ? "bg-red-500" : "bg-brand-primary"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em]">
            <span>Start</span>
            <span>Progress: {progressPercent}%</span>
            <span>Finish</span>
          </div>
        </div>
      </div>
    </MainCard>
  );
});
