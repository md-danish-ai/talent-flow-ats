import { apiClient, type ApiRequestOptions } from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  StartAttemptResponse,
  SaveAttemptAnswerResponse,
  AttemptSummaryResponse,
  ActiveStatusResponse,
} from "@types";

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
    api.post<StartAttemptResponse>(ENDPOINTS.INTERVIEW_ATTEMPTS.START, {
      paper_id: paperId,
    }),

  // silentSuccess + silentError: fires on every answer change — must not spam toasts
  saveAnswer: (
    attemptId: number,
    questionId: number,
    payload: { answer_text?: string | null; is_auto_saved?: boolean },
  ) =>
    api.put<SaveAttemptAnswerResponse>(
      ENDPOINTS.INTERVIEW_ATTEMPTS.SAVE_ANSWER(attemptId, questionId),
      payload,
      { silentSuccess: true, silentError: true },
    ),

  submitAttempt: (attemptId: number) =>
    api.post<AttemptSummaryResponse>(
      ENDPOINTS.INTERVIEW_ATTEMPTS.SUBMIT(attemptId),
    ),

  // silentSuccess: triggered automatically by timer, not a user action
  autoSubmitAttempt: (attemptId: number) =>
    api.post<AttemptSummaryResponse>(
      ENDPOINTS.INTERVIEW_ATTEMPTS.AUTO_SUBMIT(attemptId),
      undefined,
      { silentSuccess: true },
    ),

  getSummary: (attemptId: number) =>
    api.get<AttemptSummaryResponse>(
      ENDPOINTS.INTERVIEW_ATTEMPTS.SUMMARY(attemptId),
    ),

  skipSection: (
    attemptId: number,
    sectionName: string,
    options?: ApiRequestOptions,
  ) =>
    api.post(
      ENDPOINTS.INTERVIEW_ATTEMPTS.SKIP_SECTION(attemptId, sectionName),
      undefined,
      options,
    ),

  getActiveStatus: (options?: ApiRequestOptions) =>
    api.get<ActiveStatusResponse>(
      ENDPOINTS.INTERVIEW_ATTEMPTS.ACTIVE_STATUS,
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
      ENDPOINTS.INTERVIEW_ATTEMPTS.SAVE_BATCH(attemptId),
      payload,
      options,
    ),
};
