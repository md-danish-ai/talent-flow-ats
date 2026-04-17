import { api } from "./index";
import type { ApiRequestOptions } from "./client";

export interface PaperAssignmentPayload {
  user_id: number;
  paper_id: number;
  department_id: number;
  test_level_id: number;
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

export interface InterviewPaperQuestionResponse {
  id: number;
  type: string;
  question_text: string;
  subject_name?: string | null;
  type_name?: string | null;
  image_url?: string | null;
  passage?: string | null;
  marks?: number | null;
  options: string[];
}

export interface InterviewPaperSectionResponse {
  id: string;
  code: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  question_count: number;
  questions: InterviewPaperQuestionResponse[];
}

export interface InterviewPaperMetaResponse {
  id: number;
  paper_name: string;
  description?: string | null;
  total_time?: string | null;
  total_marks?: number | null;
  grade?: string | null;
  department_name?: string | null;
  test_level_name?: string | null;
}

export interface AssignedInterviewPaperResponse {
  assignment_id: number;
  assigned_date: string;
  paper: InterviewPaperMetaResponse;
  total_questions: number;
  overall_duration_minutes: number;
  sections: InterviewPaperSectionResponse[];
}

export const paperAssignmentsApi = {
  assignPaperToUser: (
    payload: PaperAssignmentPayload,
    options?: Pick<
      ApiRequestOptions,
      "cookies" | "silentSuccess" | "silentError"
    >,
  ) =>
    api.post<PaperAssignmentResponse>(
      "/paper-assignments/assign",
      payload,
      options,
    ),

  getMyInterviewPaper: (
    assignedDate?: string,
    options?: Pick<ApiRequestOptions, "cookies">,
  ) =>
    api.get<AssignedInterviewPaperResponse>(
      assignedDate
        ? `/paper-assignments/my-interview-paper?assigned_date=${encodeURIComponent(assignedDate)}`
        : "/paper-assignments/my-interview-paper",
      options,
    ),

  // Auto Assignment Rules
  getAutoRules: (
    assignedDate?: string,
    options?: Pick<ApiRequestOptions, "cookies">,
  ) =>
    api.get<AutoAssignmentRuleResponse[]>(
      assignedDate
        ? `/paper-assignments/auto-rules?assigned_date=${encodeURIComponent(assignedDate)}`
        : "/paper-assignments/auto-rules",
      options,
    ),

  createAutoRule: (payload: AutoAssignmentRulePayload) =>
    api.post<AutoAssignmentRuleResponse>(
      "/paper-assignments/auto-rules",
      payload,
    ),

  updateAutoRule: (
    ruleId: number,
    payload: Partial<AutoAssignmentRulePayload>,
  ) =>
    api.patch<AutoAssignmentRuleResponse>(
      `/paper-assignments/auto-rules/${ruleId}`,
      payload,
    ),

  deleteAutoRule: (ruleId: number) =>
    api.delete<any>(`/paper-assignments/auto-rules/${ruleId}`),
};

export interface AutoAssignmentRulePayload {
  department_id: number;
  test_level_id: number;
  assigned_date: string;
  paper_ids: number[];
  is_active?: boolean;
}

export interface AutoAssignmentRuleResponse {
  id: number;
  department_id: number;
  department_name: string;
  test_level_id: number;
  test_level_name: string;
  assigned_date: string;
  paper_ids: number[];
  paper_names: string[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}
