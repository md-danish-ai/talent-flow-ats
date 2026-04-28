export type GradeLabel = "Excellent" | "Good" | "Average" | "Poor" | "N/A";

export interface GradeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeColor: "success" | "blue" | "warning" | "error" | "default";
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
  Average: {
    label: "Average",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    barBg: "bg-amber-500",
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

export const getGradeConfig = (grade?: string): GradeConfig => {
  if (!grade) return GRADE_CONFIG["N/A"];
  const normalized = Object.keys(GRADE_CONFIG).find(
    (key) => key.toLowerCase() === grade.toLowerCase(),
  );
  return normalized ? GRADE_CONFIG[normalized] : GRADE_CONFIG["N/A"];
};
