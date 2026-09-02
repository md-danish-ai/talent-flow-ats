import React from "react";
import { cn } from "@lib/utils";

interface GradeBadgeProps {
  gradeLabel: string;
  value: string; // e.g., "50%" or "0% - 39.99%"
  shape?: "curve" | "square";
  className?: string;
}

export const GradeBadge = ({
  gradeLabel,
  value,
  shape = "square",
  className,
}: GradeBadgeProps) => {
  const normalizedLabel = (gradeLabel || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  let style =
    "text-slate-700 bg-slate-500/10 border-slate-500/30 dark:text-slate-400 dark:bg-slate-500/5 dark:border-slate-500/20";

  if (normalizedLabel === "excellent") {
    style =
      "text-emerald-700 bg-emerald-500/10 border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/20";
  } else if (normalizedLabel === "good") {
    style =
      "text-blue-700 bg-blue-500/10 border-blue-500/30 dark:text-blue-400 dark:bg-blue-500/5 dark:border-blue-500/20";
  } else if (normalizedLabel === "aboveaverage") {
    style =
      "text-violet-700 bg-violet-500/10 border-violet-500/30 dark:text-violet-400 dark:bg-violet-500/5 dark:border-violet-500/20";
  } else if (normalizedLabel === "average") {
    style =
      "text-amber-700 bg-amber-500/10 border-amber-500/30 dark:text-amber-400 dark:bg-amber-500/5 dark:border-amber-500/20";
  } else if (normalizedLabel === "belowaverage") {
    style =
      "text-orange-700 bg-orange-500/10 border-orange-500/30 dark:text-orange-400 dark:bg-orange-500/5 dark:border-orange-500/20";
  } else if (normalizedLabel === "poor") {
    style =
      "text-rose-700 bg-rose-500/10 border-rose-500/30 dark:text-rose-400 dark:bg-rose-500/5 dark:border-rose-500/20";
  }

  const rounding = shape === "curve" ? "rounded-full" : "rounded-sm";

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5 border-2 shadow-sm transition-all duration-300",
        rounding,
        style,
        className,
      )}
    >
      <span className="font-black text-xs uppercase tracking-widest leading-none">
        {gradeLabel}
      </span>
      <div
        className={cn("w-1 h-3 bg-current opacity-20 mx-3 shrink-0", rounding)}
      />
      <span className="font-bold text-xs tracking-wide leading-none whitespace-nowrap">
        {value}
      </span>
    </div>
  );
};
