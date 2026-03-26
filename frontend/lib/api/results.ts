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
}

export interface AdminUserResultListItem {
  user_id: number;
  username: string;
  mobile: string;
  email?: string | null;
  attempts_count: number;
  latest_attempt?: AdminUserLatestAttempt | null;
}

export interface AdminUserResultAnswer {
  question_id: number;
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
  answers: AdminUserResultAnswer[];
}

export interface AdminUserAttemptHistoryItem {
  attempt_id: number;
  paper_id: number;
  status: string;
  completion_reason?: "manual" | "time_over" | null;
  started_at: string;
  submitted_at?: string | null;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  obtained_marks?: number | null;
  is_auto_submitted: boolean;
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
  getUserResults: async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return api.get<AdminUserResultListItem[]>(
      `/interview-attempts/admin/users${query}`,
    );
  },

  getUserResultDetail: async (userId: number, attemptId?: number) => {
    const query = attemptId ? `?attempt_id=${attemptId}` : "";
    return api.get<AdminUserResultDetail>(
      `/interview-attempts/admin/users/${userId}/result${query}`,
    );
  },

  getUserAttempts: async (userId: number) => {
    return api.get<AdminUserAttemptsResponse>(
      `/interview-attempts/admin/users/${userId}/attempts`,
    );
  },

  updateSubjectiveMarks: async (attemptId: number, marks: Array<{ question_id: number; marks: number }>) => {
    return api.post(
      `/interview-attempts/admin/attempts/${attemptId}/marks`,
      { marks }
    );
  },
};
