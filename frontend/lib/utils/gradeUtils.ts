export type GradeLabel =
  | "Excellent"
  | "Good"
  | "Above Average"
  | "Average"
  | "Below Average"
  | "Poor"
  | "N/A";

export interface GradeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeColor: "success" | "blue" | "warning" | "error" | "default" | "violet";
  barBg: string;
}

export const GRADE_CONFIG: Record<string, GradeConfig> = {
  Excellent: {
    label: "Excellent",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    barBg: "bg-emerald-500",
    badgeColor: "success",
  },
  Good: {
    label: "Good",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    barBg: "bg-blue-500",
    badgeColor: "blue",
  },
  "Above Average": {
    label: "Above Average",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    barBg: "bg-violet-500",
    badgeColor: "violet",
  },
  Average: {
    label: "Average",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    barBg: "bg-amber-500",
    badgeColor: "warning",
  },
  "Below Average": {
    label: "Below Average",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    barBg: "bg-orange-500",
    badgeColor: "warning",
  },
  Poor: {
    label: "Poor",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    barBg: "bg-rose-500",
    badgeColor: "error",
  },
  "N/A": {
    label: "N/A",
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    barBg: "bg-slate-500/30",
    badgeColor: "default",
  },
};

export const GRADE_OPTIONS = [
  { id: "Excellent", label: "Excellent" },
  { id: "Good", label: "Good" },
  { id: "Above Average", label: "Above Average" },
  { id: "Average", label: "Average" },
  { id: "Below Average", label: "Below Average" },
  { id: "Poor", label: "Poor" },
];

export const getGradeConfig = (grade?: string): GradeConfig => {
  if (!grade) return GRADE_CONFIG["N/A"];
  const normalized = Object.keys(GRADE_CONFIG).find(
    (key) =>
      key.toLowerCase() === grade.toLowerCase() ||
      key.toLowerCase().replace(/\s+/g, "") ===
        grade.toLowerCase().replace(/\s+/g, ""),
  );
  return normalized ? GRADE_CONFIG[normalized] : GRADE_CONFIG["N/A"];
};

export const getGradeCardStyles = (grade?: string) => {
  const norm = (grade?.toLowerCase() || "").replace(/[\s_-]+/g, "");
  switch (norm) {
    case "excellent":
      return {
        card: "border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500/60 ring-2 ring-emerald-500/5 dark:ring-emerald-500/10 shadow-lg shadow-emerald-500/[0.03]",
        icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/5 border border-emerald-500/20",
        bar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
        badgeColor: "success" as const,
      };
    case "good":
      return {
        card: "border-blue-500/40 dark:border-blue-500/30 hover:border-blue-500/60 ring-2 ring-blue-500/5 dark:ring-blue-500/10 shadow-lg shadow-blue-500/[0.03]",
        icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/5 border border-blue-500/20",
        bar: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
        badgeColor: "blue" as const,
      };
    case "aboveaverage":
      return {
        card: "border-violet-500/40 dark:border-violet-500/30 hover:border-violet-500/60 ring-2 ring-violet-500/5 dark:ring-violet-500/10 shadow-lg shadow-violet-500/[0.03]",
        icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-500/5 border border-violet-500/20",
        bar: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
        badgeColor: "violet" as const,
      };
    case "average":
      return {
        card: "border-amber-500/40 dark:border-amber-500/30 hover:border-amber-500/60 ring-2 ring-amber-500/5 dark:ring-amber-500/10 shadow-lg shadow-amber-500/[0.03]",
        icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/5 border border-amber-500/20",
        bar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
        badgeColor: "warning" as const,
      };
    case "belowaverage":
      return {
        card: "border-orange-500/40 dark:border-orange-500/30 hover:border-orange-500/60 ring-2 ring-orange-500/5 dark:ring-orange-500/10 shadow-lg shadow-orange-500/[0.03]",
        icon: "bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/5 border border-orange-500/20",
        bar: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
        badgeColor: "warning" as const,
      };
    case "poor":
      return {
        card: "border-rose-500/40 dark:border-rose-500/30 hover:border-rose-500/60 ring-2 ring-rose-500/5 dark:ring-rose-500/10 shadow-lg shadow-rose-500/[0.03]",
        icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/5 border border-rose-500/20",
        bar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]",
        badgeColor: "error" as const,
      };
    default:
      return {
        card: "border-border/60 hover:border-brand-primary/30 shadow-sm",
        icon: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/50",
        bar: "bg-slate-400",
        badgeColor: "default" as const,
      };
  }
};
