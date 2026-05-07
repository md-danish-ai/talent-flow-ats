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
