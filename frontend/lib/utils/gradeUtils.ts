import { type BadgeColor } from "@components/ui-elements/Badge";

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
  hoverBorder: string;
  pillar: string;
  badgeColor: BadgeColor;
  barBg: string;
}

export const GRADE_CONFIG: Record<string, GradeConfig> = {
  Excellent: {
    label: "Excellent",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400",
    pillar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    barBg: "bg-emerald-500",
    badgeColor: "success",
  },
  Good: {
    label: "Good",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400",
    pillar: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    barBg: "bg-blue-500",
    badgeColor: "blue",
  },
  "Above Average": {
    label: "Above Average",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    hoverBorder: "hover:border-violet-500 dark:hover:border-violet-400",
    pillar: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    barBg: "bg-violet-500",
    badgeColor: "violet",
  },
  Average: {
    label: "Average",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
    pillar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
    barBg: "bg-amber-500",
    badgeColor: "warning",
  },
  "Below Average": {
    label: "Below Average",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    hoverBorder: "hover:border-orange-500 dark:hover:border-orange-400",
    pillar: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
    barBg: "bg-orange-500",
    badgeColor: "orange",
  },
  Poor: {
    label: "Poor",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    hoverBorder: "hover:border-rose-500 dark:hover:border-rose-400",
    pillar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]",
    barBg: "bg-rose-500",
    badgeColor: "rose",
  },
  "N/A": {
    label: "N/A",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    hoverBorder: "hover:border-brand-primary dark:hover:border-brand-primary",
    pillar: "bg-slate-400 dark:bg-slate-600",
    barBg: "bg-slate-500/40",
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
  if (!grade || grade === "N/A") return GRADE_CONFIG["N/A"];
  const cleanGrade = grade.toLowerCase().replace(/[\s_-]+/g, "");

  if (cleanGrade === "excellent") return GRADE_CONFIG["Excellent"];
  if (cleanGrade === "good") return GRADE_CONFIG["Good"];
  if (cleanGrade === "aboveaverage" || cleanGrade === "aboveavg")
    return GRADE_CONFIG["Above Average"];
  if (cleanGrade === "average" || cleanGrade === "avg")
    return GRADE_CONFIG["Average"];
  if (cleanGrade === "belowaverage" || cleanGrade === "belowavg")
    return GRADE_CONFIG["Below Average"];
  if (cleanGrade === "poor") return GRADE_CONFIG["Poor"];

  return GRADE_CONFIG["N/A"];
};

export const getGradeCardStyles = (grade?: string) => {
  const norm = (grade?.toLowerCase() || "").replace(/[\s_-]+/g, "");
  switch (norm) {
    case "excellent":
      return {
        card: "border-2 border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500 dark:hover:border-emerald-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/25",
        icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/5 border border-emerald-500/20",
        bar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
        badgeColor: "success" as const,
      };
    case "good":
      return {
        card: "border-2 border-blue-500/40 dark:border-blue-500/30 hover:border-blue-500 dark:hover:border-blue-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-blue-500/15 dark:hover:shadow-blue-500/25",
        icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/5 border border-blue-500/20",
        bar: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
        badgeColor: "blue" as const,
      };
    case "aboveaverage":
    case "aboveavg":
      return {
        card: "border-2 border-violet-500/40 dark:border-violet-500/30 hover:border-violet-500 dark:hover:border-violet-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-violet-500/15 dark:hover:shadow-violet-500/25",
        icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-500/5 border border-violet-500/20",
        bar: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
        badgeColor: "violet" as const,
      };
    case "average":
    case "avg":
      return {
        card: "border-2 border-amber-500/40 dark:border-amber-500/30 hover:border-amber-500 dark:hover:border-amber-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/25",
        icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/5 border border-amber-500/20",
        bar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
        badgeColor: "warning" as const,
      };
    case "belowaverage":
    case "belowavg":
      return {
        card: "border-2 border-orange-500/40 dark:border-orange-500/30 hover:border-orange-500 dark:hover:border-orange-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-orange-500/15 dark:hover:shadow-orange-500/25",
        icon: "bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/5 border border-orange-500/20",
        bar: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
        badgeColor: "orange" as const,
      };
    case "poor":
      return {
        card: "border-2 border-rose-500/40 dark:border-rose-500/30 hover:border-rose-500 dark:hover:border-rose-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-rose-500/15 dark:hover:shadow-rose-500/25",
        icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/5 border border-rose-500/20",
        bar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]",
        badgeColor: "rose" as const,
      };
    default:
      return {
        card: "border-2 border-border/60 hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-brand-primary/15",
        icon: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/50",
        bar: "bg-slate-400",
        badgeColor: "default" as const,
      };
  }
};

export const getThemedCardHoverStyles = (colorOrName?: string): string => {
  if (!colorOrName) {
    return "border-2 border-brand-primary/40 dark:border-brand-primary/30 hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-brand-primary/15 dark:hover:shadow-brand-primary/25";
  }

  const clean = colorOrName.toLowerCase();

  if (clean.includes("blue") || clean.includes("good")) {
    return "border-2 border-blue-500/40 dark:border-blue-500/30 hover:border-blue-500 dark:hover:border-blue-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-blue-500/15 dark:hover:shadow-blue-500/25";
  }
  if (
    clean.includes("emerald") ||
    clean.includes("green") ||
    clean.includes("excellent")
  ) {
    return "border-2 border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500 dark:hover:border-emerald-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/25";
  }
  if (
    clean.includes("purple") ||
    clean.includes("violet") ||
    clean.includes("above average") ||
    clean.includes("aboveavg") ||
    clean.includes("aboveaverage")
  ) {
    return "border-2 border-purple-500/40 dark:border-purple-500/30 hover:border-purple-500 dark:hover:border-purple-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-purple-500/15 dark:hover:shadow-purple-500/25";
  }
  if (
    clean.includes("amber") ||
    clean.includes("yellow") ||
    (clean.includes("average") &&
      !clean.includes("below") &&
      !clean.includes("above"))
  ) {
    return "border-2 border-amber-500/40 dark:border-amber-500/30 hover:border-amber-500 dark:hover:border-amber-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-amber-500/15 dark:hover:shadow-amber-500/25";
  }
  if (
    clean.includes("orange") ||
    clean.includes("below average") ||
    clean.includes("belowavg") ||
    clean.includes("belowaverage")
  ) {
    return "border-2 border-orange-500/40 dark:border-orange-500/30 hover:border-orange-500 dark:hover:border-orange-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-orange-500/15 dark:hover:shadow-orange-500/25";
  }
  if (
    clean.includes("rose") ||
    clean.includes("red") ||
    clean.includes("poor")
  ) {
    return "border-2 border-rose-500/40 dark:border-rose-500/30 hover:border-rose-500 dark:hover:border-rose-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-rose-500/15 dark:hover:shadow-rose-500/25";
  }
  if (clean.includes("indigo")) {
    return "border-2 border-indigo-500/40 dark:border-indigo-500/30 hover:border-indigo-500 dark:hover:border-indigo-400 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/25";
  }
  if (clean.includes("brand-primary") || clean.includes("primary")) {
    return "border-2 border-brand-primary/40 dark:border-brand-primary/30 hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-brand-primary/15 dark:hover:shadow-brand-primary/25";
  }

  return "border-2 border-border/60 hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-brand-primary/15 dark:hover:shadow-brand-primary/25";
};
