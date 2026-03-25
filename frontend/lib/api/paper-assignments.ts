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
    options?: Pick<ApiRequestOptions, "cookies" | "silentSuccess" | "silentError">,
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
};
