import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api";
import { ENDPOINTS } from "@lib/api/endpoints";

export interface DashboardStats {
  total_candidates: number;
  active_papers: number;
  total_questions: number;
  today_attempts: number;
}

export interface GradeCount {
  label: string;
  count: number;
}

export interface TodayPulse {
  registrations: number;
  reinterviews: number;
  assignments: number;
  attempts: number;
  grades: GradeCount[];
}

export interface DashboardOverview {
  stats: DashboardStats;
  today_pulse: TodayPulse;
}

export function useDashboardOverview(params?: {
  start_date?: string;
  end_date?: string;
}) {
  return useQuery<DashboardOverview>({
    queryKey: ["dashboard-overview", params],
    queryFn: async () => {
      return await api.get(ENDPOINTS.DASHBOARD.OVERVIEW, { params });
    },
  });
}
