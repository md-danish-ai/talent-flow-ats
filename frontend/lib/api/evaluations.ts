import { api } from "./base";
import {
  AssignLeadPayload,
  SubmitEvaluationPayload,
  EvaluationHistoryItem,
  EvaluationTask,
} from "@types";

export const evaluationsApi = {
  assignLead: async (payload: AssignLeadPayload) => {
    return api.post("/evaluations/assign", payload);
  },

  getLeadTasks: async (
    leadId: number,
    status?: string,
  ): Promise<EvaluationTask[]> => {
    return api.get(`/evaluations/my-tasks/${leadId}`, {
      params: { status },
    });
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
    status?: string,
  ): Promise<EvaluationHistoryItem[]> => {
    return api.get<EvaluationHistoryItem[]>("/evaluations/admin/list", {
      params: { status },
    });
  },

  unassignLead: async (evaluationId: number) => {
    return api.delete(`/evaluations/unassign/${evaluationId}`);
  },
};
