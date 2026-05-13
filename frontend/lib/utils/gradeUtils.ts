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
  const norm = grade?.toLowerCase() || "";
  switch (norm) {
    case "excellent":
      return {
        card: "border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500/60 ring-2 ring-emerald-500/5 dark:ring-emerald-500/10 shadow-lg shadow-emerald-500/[0.03]",
        icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/5 border border-emerald-500/20",
        bar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
      };
    case "good":
      return {
        card: "border-brand-primary/40 dark:border-brand-primary/30 hover:border-brand-primary/60 ring-2 ring-brand-primary/5 dark:ring-brand-primary/10 shadow-lg shadow-brand-primary/[0.03]",
        icon: "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/5 border border-brand-primary/20",
        bar: "bg-brand-primary shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)]",
      };
    case "average":
      return {
        card: "border-amber-500/40 dark:border-amber-500/30 hover:border-amber-500/60 ring-2 ring-amber-500/5 dark:ring-amber-500/10 shadow-lg shadow-amber-500/[0.03]",
        icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/5 border border-amber-500/20",
        bar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
      };
    case "poor":
      return {
        card: "border-rose-500/40 dark:border-rose-500/30 hover:border-rose-500/60 ring-2 ring-rose-500/5 dark:ring-rose-500/10 shadow-lg shadow-rose-500/[0.03]",
        icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/5 border border-rose-500/20",
        bar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]",
      };
    default:
      return {
        card: "border-border/50 hover:border-brand-primary/30 shadow-2xl shadow-slate-300/30 dark:shadow-none",
        icon: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-transparent",
        bar: "bg-slate-400",
      };
  }
};
