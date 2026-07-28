import { api } from "./base";
import { ENDPOINTS } from "./endpoints";
import { type PaginatedReportUsers, type GetReportUsersParams } from "@types";

export const reportsApi = {
  getAllReports: async ({
    search,
    page = 1,
    limit = 10,
    startDate,
    endDate,
    status,
    completionReason,
    overallGrade,
    project_lead_id,
    department_id,
    test_level_id,
  }: GetReportUsersParams) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (status && status !== "all") params.append("status", status);
    if (completionReason && completionReason !== "all")
      params.append("completion_reason", completionReason);
    if (overallGrade && overallGrade !== "all")
      params.append("overall_grade", overallGrade);
    if (project_lead_id && project_lead_id !== "all")
      params.append("project_lead_id", project_lead_id);
    if (department_id && department_id !== "all")
      params.append("department_id", department_id);
    if (test_level_id && test_level_id !== "all")
      params.append("test_level_id", test_level_id);

    return api.get<PaginatedReportUsers>(
      `${ENDPOINTS.RESULTS.GET_ALL_REPORTS}?${params.toString()}`,
    );
  },
};
