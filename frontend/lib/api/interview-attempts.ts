import { apiClient, type ApiRequestOptions } from "./client";

export interface AttemptSavedResponse {
  question_id: number;
  section_code: string;
  section_name: string;
  answer_text?: string | null;
  is_attempted: boolean;
  is_auto_saved: boolean;
  saved_at: string;
}

export interface StartAttemptResponse {
  attempt_id: number;
  paper_id: number;
  user_id: number;
  status: string;
  total_questions: number;
  started_at: string;
  is_resumed: boolean;
  paper_question_ids: number[];
  saved_responses: AttemptSavedResponse[];
  total_duration_minutes: number;
}

export interface SaveAttemptAnswerResponse {
  attempt_id: number;
  question_id: number;
  section_code: string;
  section_name: string;
  is_attempted: boolean;
  is_auto_saved: boolean;
  saved_at: string;
}

export interface AttemptSummaryResponse {
  attempt_id: number;
  paper_id: number;
  user_id: number;
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

export interface ActiveStatusResponse {
  has_attempt: boolean;
  status: string | null;
  is_expired: boolean;
  attempt_id?: number | null;
}

// Local helper to avoid circularity with index.ts
const api = {
  get: <T>(url: string, options?: ApiRequestOptions) =>
    apiClient<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(url, { ...options, method: "POST", body }),
  put: <T>(url: string, body?: unknown, options?: ApiRequestOptions) =>
    apiClient<T>(url, { ...options, method: "PUT", body }),
};

export const interviewAttemptsApi = {
  startAttempt: (paperId: number) =>
    api.post<StartAttemptResponse>("/user/interview-attempts/start", {
      paper_id: paperId,
    }),

  // silentSuccess + silentError: fires on every answer change — must not spam toasts
  saveAnswer: (
    attemptId: number,
    questionId: number,
    payload: { answer_text?: string | null; is_auto_saved?: boolean },
  ) =>
    api.put<SaveAttemptAnswerResponse>(
      `/user/interview-attempts/${attemptId}/answers/${questionId}`,
      payload,
      { silentSuccess: true, silentError: true },
    ),

  submitAttempt: (attemptId: number) =>
    api.post<AttemptSummaryResponse>(
      `/user/interview-attempts/${attemptId}/submit`,
    ),

  // silentSuccess: triggered automatically by timer, not a user action
  autoSubmitAttempt: (attemptId: number) =>
    api.post<AttemptSummaryResponse>(
      `/user/interview-attempts/${attemptId}/auto-submit`,
      undefined,
      { silentSuccess: true },
    ),

  getSummary: (attemptId: number) =>
    api.get<AttemptSummaryResponse>(
      `/user/interview-attempts/${attemptId}/summary`,
    ),

  skipSection: (
    attemptId: number,
    sectionName: string,
    options?: ApiRequestOptions,
  ) =>
    api.post(
      `/user/interview-attempts/${attemptId}/sections/${sectionName}/skip`,
      undefined,
      options,
    ),

  getActiveStatus: (options?: ApiRequestOptions) =>
    api.get<ActiveStatusResponse>(
      "/user/interview-attempts/active-status",
      options,
    ),

  saveAnswersBatch: (
    attemptId: number,
    payload: {
      answers: {
        question_id: number;
        answer_text?: string | null;
        is_auto_saved?: boolean;
      }[];
    },
    options?: ApiRequestOptions,
  ) =>
    api.post<{ attempt_id: number; count: number; saved_at: string }>(
      `/user/interview-attempts/${attemptId}/answers/batch`,
      payload,
      options,
    ),
};
