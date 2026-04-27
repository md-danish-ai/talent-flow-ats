import { api } from "./base";
import { ENDPOINTS } from "./endpoints";
import {
  PaginatedUserResults,
  AdminUserResultDetail,
  AdminUserAttemptsResponse,
  GetUserResultsParams,
} from "@types";

export const resultsApi = {
  getUserResults: async ({
    search,
    page = 1,
    limit = 10,
    startDate,
    endDate,
    status,
    completionReason,
    overallGrade,
  }: GetUserResultsParams) => {
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

    return api.get<PaginatedUserResults>(
      `${ENDPOINTS.RESULTS.GET_ALL}?${params.toString()}`,
    );
  },

  getUserResultDetail: async (userId: number, attemptId?: number) => {
    const query = attemptId ? `?attempt_id=${attemptId}` : "";
    return api.get<AdminUserResultDetail>(
      `${ENDPOINTS.RESULTS.USER_DETAIL(userId)}${query}`,
    );
  },

  getUserAttempts: async (userId: number) => {
    return api.get<AdminUserAttemptsResponse>(
      ENDPOINTS.RESULTS.USER_ATTEMPTS(userId),
    );
  },

  resetUserStatus: async (userId: number) => {
    return api.post<{ message: string }>(
      ENDPOINTS.RESULTS.RESET_ATTEMPT(userId),
    );
  },

  resetUserDetails: async (userId: number) => {
    return api.post<{ message: string }>(
      ENDPOINTS.RESULTS.RESET_DETAILS(userId),
    );
  },

  enableReInterview: async (userId: number) => {
    return api.post<{ message: string; reinterview_date?: string }>(
      ENDPOINTS.RESULTS.RE_INTERVIEW(userId),
    );
  },

  resetUserSubjects: async (
    userId: number,
    attemptId: number,
    sectionNames: string[],
  ) => {
    return api.post<{ message: string }>(
      ENDPOINTS.RESULTS.RESET_SUBJECTS(userId),
      { attempt_id: attemptId, section_names: sectionNames },
    );
  },

  applyManualMarks: async (
    userId: number,
    attemptId: number,
    questionId: number,
    marks: number,
  ) => {
    return api.post<{
      message: string;
      manual_marks: number;
      new_total_marks: number;
    }>(ENDPOINTS.RESULTS.MANUAL_MARKS(userId, attemptId, questionId), {
      marks,
    });
  },
};
