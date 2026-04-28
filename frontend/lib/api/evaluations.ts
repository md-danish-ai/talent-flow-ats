import { api } from "./base";
import {
  AssignLeadPayload,
  SubmitEvaluationPayload,
  EvaluationHistoryItem,
  EvaluationTask,
  InterviewEvaluation,
  PaginatedResponse,
} from "@types";

export const evaluationsApi = {
  assignLead: async (payload: AssignLeadPayload) => {
    return api.post("/evaluations/assign", payload);
  },

  getLeadTasks: async (
    leadId: number,
    params?: { status?: string; page?: number; limit?: number; search?: string },
  ): Promise<PaginatedResponse<EvaluationTask>> => {
    return api.get(`/evaluations/my-tasks/${leadId}`, {
      params,
    });
  },

  getEvaluationDetail: async (
    evaluationId: number,
  ): Promise<InterviewEvaluation> => {
    return api.get(`/evaluations/get-detail/${evaluationId}`);
  },

  submitEvaluation: async (
    evaluationId: number,
    payload: SubmitEvaluationPayload,
  ) => {
    return api.post(`/evaluations/submit/${evaluationId}`, payload);
  },

  getEvaluationHistory: async (
    userId: number,
    attemptId?: number,
  ): Promise<EvaluationHistoryItem[]> => {
    const url = attemptId
      ? `/evaluations/history/${userId}/${attemptId}`
      : `/evaluations/history/${userId}`;
    return api.get<EvaluationHistoryItem[]>(url);
  },

  getAdminEvaluationList: async (
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<EvaluationHistoryItem>> => {
    return api.get<PaginatedResponse<EvaluationHistoryItem>>("/evaluations/admin/list", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  unassignLead: async (evaluationId: number) => {
    return api.delete(`/evaluations/unassign/${evaluationId}`);
  },
};
