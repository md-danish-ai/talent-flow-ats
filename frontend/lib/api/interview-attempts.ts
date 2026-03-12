import { api } from "./index";

export interface StartAttemptResponse {
  attempt_id: number;
  paper_id: number;
  user_id: number;
  status: string;
  total_questions: number;
  started_at: string;
  paper_question_ids: number[];
}

export interface SaveAttemptAnswerResponse {
  attempt_id: number;
  question_id: number;
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

export const interviewAttemptsApi = {
  startAttempt: (paperId: number) =>
    api.post<StartAttemptResponse>("/interview-attempts/start", {
      paper_id: paperId,
    }),

  // silentSuccess + silentError: fires on every answer change — must not spam toasts
  saveAnswer: (
    attemptId: number,
    questionId: number,
    payload: { answer_text?: string | null; is_auto_saved?: boolean },
  ) =>
    api.put<SaveAttemptAnswerResponse>(
      `/interview-attempts/${attemptId}/answers/${questionId}`,
      payload,
      { silentSuccess: true, silentError: true },
    ),

  submitAttempt: (attemptId: number) =>
    api.post<AttemptSummaryResponse>(`/interview-attempts/${attemptId}/submit`),

  // silentSuccess: triggered automatically by timer, not a user action
  autoSubmitAttempt: (attemptId: number) =>
    api.post<AttemptSummaryResponse>(
      `/interview-attempts/${attemptId}/auto-submit`,
      undefined,
      { silentSuccess: true },
    ),

  getSummary: (attemptId: number) =>
    api.get<AttemptSummaryResponse>(`/interview-attempts/${attemptId}/summary`),
};
