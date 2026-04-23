import { api } from "./index";
import { ENDPOINTS } from "./endpoints";
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
      ENDPOINTS.PAPER_ASSIGNMENTS.ASSIGN,
      payload,
      options,
    ),

  getMyInterviewPaper: (
    assignedDate?: string,
    options?: Pick<ApiRequestOptions, "cookies">,
  ) =>
    api.get<AssignedInterviewPaperResponse>(
      assignedDate
        ? `${ENDPOINTS.PAPER_ASSIGNMENTS.MY_INTERVIEW_PAPER}?assigned_date=${encodeURIComponent(assignedDate)}`
        : ENDPOINTS.PAPER_ASSIGNMENTS.MY_INTERVIEW_PAPER,
      options,
    ),

  // Auto Assignment Rules
  getAutoRules: (
    params?: { assigned_date?: string; date_from?: string; date_to?: string },
    options?: Pick<ApiRequestOptions, "cookies">,
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.assigned_date) searchParams.append("assigned_date", params.assigned_date);
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);

    const queryString = searchParams.toString();
    const url = queryString 
      ? `${ENDPOINTS.PAPER_ASSIGNMENTS.AUTO_RULES}?${queryString}`
      : ENDPOINTS.PAPER_ASSIGNMENTS.AUTO_RULES;

    return api.get<AutoAssignmentRuleResponse[]>(url, options);
  },

  createAutoRule: (payload: AutoAssignmentRulePayload) =>
    api.post<AutoAssignmentRuleResponse>(
      ENDPOINTS.PAPER_ASSIGNMENTS.AUTO_RULES,
      payload,
    ),

  updateAutoRule: (
    ruleId: number,
    payload: Partial<AutoAssignmentRulePayload>,
  ) =>
    api.patch<AutoAssignmentRuleResponse>(
      ENDPOINTS.PAPER_ASSIGNMENTS.AUTO_RULE_BY_ID(ruleId),
      payload,
    ),

  deleteAutoRule: (ruleId: number) =>
    api.delete<{ message: string }>(
      ENDPOINTS.PAPER_ASSIGNMENTS.AUTO_RULE_BY_ID(ruleId),
    ),
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
