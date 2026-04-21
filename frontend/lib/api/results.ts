import { api } from "./index";
import { ENDPOINTS } from "./endpoints";
import { GradeSetting } from "./papers";

export interface AdminUserLatestAttempt {
  attempt_id: number;
  paper_id?: number;
  paper_name?: string;
  status: string;
  completion_reason?: "manual" | "time_over" | null;
  started_at?: string | null;
  submitted_at?: string | null;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  obtained_marks?: number | null;
  total_marks?: number;
  overall_grade?: string;
  typing_stats?: {
    wpm: number;
    accuracy: number;
    errors: number;
    time_taken: number;
  } | null;
  subject_results?: SubjectResult[];
}

export interface AdminUserResultListItem {
  user_id: number;
  username: string;
  mobile: string;
  email?: string | null;
  attempts_count: number;
  is_reattempt?: boolean;
  latest_attempt?: AdminUserLatestAttempt | null;
}

export interface PaginatedUserResults {
  items: AdminUserResultListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  summary_stats?: {
    total: number;
    active: number;
    completed: number;
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
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

export interface SubjectResult {
  section_code: string;
  section_name: string;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  correct_count: number;
  incorrect_count: number;
  obtained_marks: number;
  total_marks: number;
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
    total_marks: number;
    overall_grade: string;
    is_auto_submitted: boolean;
    subject_results?: SubjectResult[];
  };
  summary: {
    correct_count: number;
    incorrect_count: number;
    not_attempted_count: number;
    total_marks_obtained: number;
    overall_percentage: number;
    overall_grade: string;
  };
  subject_results: SubjectResult[];
  grade_settings: GradeSetting[];
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
  total_marks?: number;
  overall_grade?: string;
  is_auto_submitted: boolean;
  subject_results?: SubjectResult[];
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
    status?: string,
    completionReason?: string,
    overallGrade?: string,
  ) => {
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

    return api.get<PaginatedUserResults>(`${ENDPOINTS.RESULTS.GET_ALL}?${params.toString()}`);
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
    }>(
      ENDPOINTS.RESULTS.MANUAL_MARKS(userId, attemptId, questionId),
      { marks },
    );
  },
};
