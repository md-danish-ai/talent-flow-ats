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
  const normalizedLabel = gradeLabel.toLowerCase();
  const style =
    normalizedLabel === "excellent"
      ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/20"
      : normalizedLabel === "good"
        ? "text-brand-primary bg-brand-primary/10 border-brand-primary/30 dark:text-brand-primary dark:bg-brand-primary/5 dark:border-brand-primary/20"
        : normalizedLabel === "average"
          ? "text-amber-700 bg-amber-500/10 border-amber-500/30 dark:text-amber-400 dark:bg-amber-500/5 dark:border-amber-500/20"
          : normalizedLabel === "poor"
            ? "text-rose-700 bg-rose-500/10 border-rose-500/30 dark:text-rose-400 dark:bg-rose-500/5 dark:border-rose-500/20"
            : "text-indigo-700 bg-indigo-500/10 border-indigo-500/30 dark:text-indigo-400 dark:bg-indigo-500/5 dark:border-indigo-500/20";

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
