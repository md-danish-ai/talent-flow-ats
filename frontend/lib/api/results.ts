import { api } from "./index";

export interface AdminUserLatestAttempt {
  attempt_id: number;
  status: string;
  completion_reason?: "manual" | "time_over" | null;
  submitted_at?: string | null;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  obtained_marks?: number | null;
  typing_stats?: {
    wpm: number;
    accuracy: number;
    errors: number;
    time_taken: number;
  } | null;
}

export interface AdminUserResultListItem {
  user_id: number;
  username: string;
  mobile: string;
  email?: string | null;
  attempts_count: number;
  latest_attempt?: AdminUserLatestAttempt | null;
}

export interface PaginatedUserResults {
  items: AdminUserResultListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminUserResultAnswer {
  question_id: number;
  section_name: string;
  question_type: string;
  subject_type: string;
  exam_level: string;
  question_text: string;
  passage?: string | null;
  image_url?: string | null;
  options?: Array<Record<string, unknown>> | null;
  max_marks: number;
  user_answer?: string | null;
  correct_answer?: string | null;
  status: "correct" | "incorrect" | "not_attempted";
  marks_obtained: number;
  manual_marks?: number | null;
  is_attempted: boolean;
  is_auto_saved: boolean;
  saved_at: string;
  typing_stats?: {
    wpm: number;
    accuracy: number;
    errors: number;
    time_taken: number;
  } | null;
}

export interface SubjectWiseResult {
  section_name: string;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  correct_count: number;
  incorrect_count: number;
  obtained_marks: number;
  max_marks: number;
  percentage: number;
  grade: string;
}

export interface AdminUserResultDetail {
  user: {
    id: number;
    username: string;
    mobile: string;
    email?: string | null;
  };
  attempt: {
    attempt_id: number;
    paper_id: number;
    paper_name: string;
    attempt_number: number;
    status: string;
    completion_reason?: "manual" | "time_over" | null;
    started_at: string;
    submitted_at?: string | null;
    total_questions: number;
    attempted_count: number;
    unattempted_count: number;
    obtained_marks?: number | null;
    is_auto_submitted: boolean;
  };
  summary: {
    correct_count: number;
    incorrect_count: number;
    not_attempted_count: number;
    total_marks_obtained: number;
  };
  subject_wise_result: SubjectWiseResult[];
  answers: AdminUserResultAnswer[];
}

export interface AdminUserAttemptHistoryItem {
  attempt_id: number;
  paper_id: number;
  paper_name?: string;
  status: string;
  completion_reason?: "manual" | "time_over" | null;
  started_at: string;
  submitted_at?: string | null;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  obtained_marks?: number | null;
  is_auto_submitted: boolean;
  typing_stats?: {
    wpm: number;
    accuracy: number;
    errors: number;
    time_taken: number;
  } | null;
}

export interface AdminUserAttemptsResponse {
  user: {
    id: number;
    username: string;
    mobile: string;
    email?: string | null;
  };
  attempts: AdminUserAttemptHistoryItem[];
}

export const resultsApi = {
  getUserResults: async (
    search?: string,
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    return api.get<PaginatedUserResults>(`/admin/results?${params.toString()}`);
  },

  getUserResultDetail: async (userId: number, attemptId?: number) => {
    const query = attemptId ? `?attempt_id=${attemptId}` : "";
    return api.get<AdminUserResultDetail>(
      `/admin/results/users/${userId}${query}`,
    );
  },

  getUserAttempts: async (userId: number) => {
    return api.get<AdminUserAttemptsResponse>(
      `/admin/results/users/${userId}/attempts`,
    );
  },

  resetUserStatus: async (userId: number) => {
    return api.post<{ message: string }>(
      `/admin/results/users/${userId}/reset`,
    );
  },

  resetUserDetails: async (userId: number) => {
    return api.post<{ message: string }>(
      `/admin/results/users/${userId}/reset-details`,
    );
  },

  enableReInterview: async (userId: number) => {
    return api.post<{ message: string; reinterview_date?: string }>(
      `/admin/results/users/${userId}/enable-reinterview`,
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
    }>(
      `/admin/results/users/${userId}/attempts/${attemptId}/responses/${questionId}/manual-marks`,
      { marks },
    );
  },
};
