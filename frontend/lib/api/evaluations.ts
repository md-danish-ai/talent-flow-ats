import { api } from "./base";
import { ENDPOINTS } from "./endpoints";
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
    return api.post(ENDPOINTS.EVALUATIONS.ASSIGN, payload);
  },

  getLeadTasks: async (
    leadId: number,
    params?: { status?: string; page?: number; limit?: number; search?: string },
  ): Promise<PaginatedResponse<EvaluationTask>> => {
    return api.get(ENDPOINTS.EVALUATIONS.LEAD_TASKS(leadId), {
      params,
    });
  },

  getEvaluationDetail: async (
    evaluationId: number,
  ): Promise<InterviewEvaluation> => {
    return api.get(ENDPOINTS.EVALUATIONS.DETAIL(evaluationId));
  },

  submitEvaluation: async (
    evaluationId: number,
    payload: SubmitEvaluationPayload,
  ) => {
    return api.post(ENDPOINTS.EVALUATIONS.SUBMIT(evaluationId), payload);
  },

  getEvaluationHistory: async (
    userId: number,
    attemptId?: number,
  ): Promise<EvaluationHistoryItem[]> => {
    return api.get<EvaluationHistoryItem[]>(ENDPOINTS.EVALUATIONS.USER_HISTORY(userId, attemptId));
  },

  getAdminEvaluationList: async (
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<EvaluationHistoryItem>> => {
    return api.get<PaginatedResponse<EvaluationHistoryItem>>(ENDPOINTS.EVALUATIONS.ADMIN_LIST, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  unassignLead: async (evaluationId: number) => {
    return api.delete(ENDPOINTS.EVALUATIONS.UNASSIGN(evaluationId));
  },
};
