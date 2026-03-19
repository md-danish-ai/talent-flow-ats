import { api } from "./index";
import type { ApiRequestOptions } from "./client";

export interface PaperAssignmentPayload {
  user_id: number;
  paper_id: number;
  assigned_date: string;
}

export interface PaperAssignmentResponse {
  id: number;
  user_id: number;
  username: string;
  paper_id: number;
  paper_name: string;
  assigned_date: string;
  assigned_by: number;
  assigned_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export const paperAssignmentsApi = {
  assignPaperToUser: (
    payload: PaperAssignmentPayload,
    options?: Pick<ApiRequestOptions, "cookies" | "silentSuccess" | "silentError">,
  ) =>
    api.post<PaperAssignmentResponse>(
      "/paper-assignments/assign",
      payload,
      options,
    ),

  getAssignmentsByDate: (
    assignedDate: string,
    options?: Pick<ApiRequestOptions, "cookies">,
  ) =>
    api.get<PaperAssignmentResponse[]>(
      `/paper-assignments/by-date?assigned_date=${encodeURIComponent(assignedDate)}`,
      options,
    ),

  getMyAssignedPaper: (
    assignedDate: string,
    options?: Pick<ApiRequestOptions, "cookies">,
  ) =>
    api.get<PaperAssignmentResponse>(
      `/paper-assignments/my-paper?assigned_date=${encodeURIComponent(assignedDate)}`,
      options,
    ),
};
