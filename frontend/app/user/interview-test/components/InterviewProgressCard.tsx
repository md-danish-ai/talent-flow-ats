import { memo } from "react";
import { Clock3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const RollingDigit = ({
  value,
  colorClass,
}: {
  value: string;
  colorClass: string;
}) => {
  return (
    <div className="relative h-12 w-7 sm:h-16 sm:w-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className={`font-mono tabular-nums font-black text-3xl sm:text-5xl tracking-tighter ${colorClass}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const InterviewProgressCard = memo(function InterviewProgressCard({
  sectionIndex,
  totalSections,
  currentSection,
  progressPercent,
  timerZone,
  remainingTimeText,
}: InterviewProgressCardProps) {
  // Split "MM:SS" into components
  const [minutes, seconds] = remainingTimeText.split(":");
  const m1 = minutes?.[0] || "0";
  const m2 = minutes?.[1] || "0";
  const s1 = seconds?.[0] || "0";
  const s2 = seconds?.[1] || "0";

  const colorClass =
    timerZone === "danger"
      ? "text-red-500"
      : timerZone === "warn"
        ? "text-yellow-500"
        : "text-emerald-500";

  return (
    <MainCard title="Exam Progress" bodyClassName="space-y-6">
      {/* Optimized Prominent Timer Display */}
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all duration-700 p-5 sm:p-8 bg-background shadow-inner border-border/40 ${
          timerZone === "danger"
            ? "ring-2 ring-red-500/20"
            : timerZone === "warn"
              ? "ring-2 ring-yellow-500/20"
              : "ring-2 ring-emerald-500/10"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Typography
            variant="body5"
            weight="black"
            className={`uppercase tracking-[0.3em] text-[10px] text-center opacity-60 ${colorClass}`}
          >
            Time Remaining
          </Typography>

          <div className="flex items-center justify-center gap-1.5 w-full">
            <motion.div
              animate={
                timerZone !== "safe"
                  ? { scale: [1, 1.05, 1], opacity: [1, 0.6, 1] }
                  : {}
              }
              transition={
                timerZone !== "safe"
                  ? {
                      duration: timerZone === "danger" ? 0.5 : 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : {}
              }
              className="flex shrink-0"
            >
              <RollingDigit value={m1} colorClass={colorClass} />
              <RollingDigit value={m2} colorClass={colorClass} />
            </motion.div>

            <motion.div
              animate={
                timerZone !== "safe"
                  ? { scale: [1, 1.1, 1], opacity: [1, 0.3, 1] }
                  : {}
              }
              transition={
                timerZone !== "safe"
                  ? {
                      duration: timerZone === "danger" ? 0.5 : 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : {}
              }
            >
              <Typography
                variant="h2"
                weight="black"
                className={`${colorClass} opacity-30 px-1 mb-2 sm:mb-3 sm:text-5xl`}
              >
                :
              </Typography>
            </motion.div>

            <motion.div
              animate={
                timerZone !== "safe"
                  ? { scale: [1, 1.05, 1], opacity: [1, 0.6, 1] }
                  : {}
              }
              transition={
                timerZone !== "safe"
                  ? {
                      duration: timerZone === "danger" ? 0.5 : 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : {}
              }
              className="flex shrink-0"
            >
              <RollingDigit value={s1} colorClass={colorClass} />
              <RollingDigit value={s2} colorClass={colorClass} />
            </motion.div>

            <div className="pl-4 shrink-0 hidden sm:block">
              <Clock3
                size={34}
                strokeWidth={2.5}
                className={`transition-all duration-700 ${
                  timerZone === "danger"
                    ? "text-red-500 animate-[spin_1s_linear_infinite]"
                    : timerZone === "warn"
                      ? "text-yellow-500 animate-[spin_5s_linear_infinite]"
                      : "text-emerald-500/50"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Space Launch Flash Border for Warning & Danger */}
        {timerZone !== "safe" && (
          <motion.div
            animate={{ opacity: [0, timerZone === "danger" ? 0.6 : 0.3, 0] }}
            transition={{
              duration: timerZone === "danger" ? 0.5 : 1.2,
              repeat: Infinity,
            }}
            className={`absolute inset-0 border-4 rounded-3xl pointer-events-none ${
              timerZone === "danger" ? "border-red-500" : "border-yellow-500"
            }`}
          />
        )}

        {/* Minimal Glow Behind Digit Group */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

        {/* Dynamic glow effect */}
        <motion.div
          animate={{ scale: timerZone === "danger" ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-10 transition-colors duration-500 ${
            timerZone === "danger"
              ? "bg-red-500"
              : timerZone === "warn"
                ? "bg-yellow-400"
                : "bg-emerald-500"
          }`}
        />
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
                timerZone === "danger"
                  ? "bg-red-500"
                  : timerZone === "warn"
                    ? "bg-yellow-500"
                    : "bg-emerald-500"
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
