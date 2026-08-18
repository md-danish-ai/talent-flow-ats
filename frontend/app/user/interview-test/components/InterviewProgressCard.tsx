"use client";

import { memo } from "react";
import { Clock3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import type { TimerZone } from "../types";

interface InterviewProgressCardProps {
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
    <div className="relative h-12 w-7 sm:h-14 sm:w-9 md:h-16 md:w-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className={`font-mono tabular-nums font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter ${colorClass}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const InterviewProgressCard = memo(function InterviewProgressCard({
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

  const shadowClass =
    timerZone === "danger"
      ? "shadow-[0_20px_50px_rgba(239,68,68,0.22)] hover:shadow-[0_20px_50px_rgba(239,68,68,0.35)]"
      : timerZone === "warn"
        ? "shadow-[0_20px_50px_rgba(245,158,11,0.22)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.35)]"
        : "shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.28)]";

  return (
    <div
      id="interview-active-timer"
      className={cn(
        "relative overflow-hidden border transition-all duration-700 py-3.5 px-4 sm:py-4 sm:px-6 bg-background border-border/40",
        STYLE_CONFIG.cardRadius,
        shadowClass,
        timerZone === "danger"
          ? "ring-2 ring-red-500/20"
          : timerZone === "warn"
            ? "ring-2 ring-yellow-500/20"
            : "ring-2 ring-emerald-500/10",
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Typography
          variant="body5"
          weight="black"
          className={`uppercase tracking-[0.25em] text-[10px] text-center opacity-70 ${colorClass}`}
        >
          Time Remaining
        </Typography>

        <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full">
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
              className={`${colorClass} opacity-30 px-1 mb-1 sm:mb-2 text-4xl sm:text-5xl md:text-6xl`}
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

          <div className="pl-3 sm:pl-4 shrink-0">
            <Clock3
              size={32}
              strokeWidth={2.5}
              className={`transition-all duration-700 ${
                timerZone === "danger"
                  ? "text-red-500 animate-[spin_1s_linear_infinite]"
                  : timerZone === "warn"
                    ? "text-yellow-500 animate-[spin_5s_linear_infinite]"
                    : "text-emerald-500/60"
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
          className={cn(
            "absolute inset-0 border-4 pointer-events-none",
            STYLE_CONFIG.cardRadius,
            timerZone === "danger" ? "border-red-500" : "border-yellow-500",
          )}
        />
      )}

      {/* Minimal Glow Behind Digit Group */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

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
  );
});
