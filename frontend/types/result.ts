import { GradeSetting } from "./paper";
import { PaginatedResponse } from "./common";

export interface SubjectResult {
  section_code: string;
  section_name: string;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  correct_count: number;
  incorrect_count: number;
  obtained_marks: number;
  total_marks: number;
  percentage: number;
  grade: string;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  time_taken: number;
}

export interface AdminUserLatestAttempt {
  attempt_id: number;
  paper_id?: number;
  paper_name?: string;
  status: string;
  completion_reason?: "manual" | "time_over" | null;
  started_at?: string | null;
  submitted_at?: string | null;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  obtained_marks?: number | null;
  total_marks?: number;
  overall_grade?: string;
  typing_stats?: TypingStats | null;
  subject_results?: SubjectResult[];
  interviewers?: Array<[string, string]>;
}

export interface AdminUserResultListItem {
  user_id: number;
  username: string;
  mobile: string;
  email?: string | null;
  attempts_count: number;
  is_reattempt?: boolean;
  latest_attempt?: AdminUserLatestAttempt | null;
}

export interface SummaryStats {
  total: number;
  active: number;
  completed: number;
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

export interface PaginatedUserResults extends PaginatedResponse<AdminUserResultListItem> {
  summary_stats?: SummaryStats;
}

export interface AdminUserResultAnswer {
  question_id: number;
  section_name: string;
  question_type: string;
  subject_type: string;
  exam_level: string;
  question_text: string;
  passage?: string | null;
  image_url?: string | null;
  options?: Array<Record<string, unknown>> | null;
  max_marks: number;
  user_answer?: string | null;
  correct_answer?: string | null;
  status: "correct" | "incorrect" | "not_attempted";
  marks_obtained: number;
  manual_marks?: number | null;
  is_attempted: boolean;
  is_auto_saved: boolean;
  saved_at: string;
  typing_stats?: TypingStats | null;
}

export interface AdminUserResultDetail {
  user: {
    id: number;
    username: string;
    mobile: string;
    email?: string | null;
  };
  attempt: {
    attempt_id: number;
    paper_id: number;
    paper_name: string;
    attempt_number: number;
    status: string;
    completion_reason?: "manual" | "time_over" | null;
    started_at: string;
    submitted_at?: string | null;
    total_questions: number;
    attempted_count: number;
    unattempted_count: number;
    obtained_marks?: number | null;
    total_marks: number;
    overall_grade: string;
    is_auto_submitted: boolean;
    subject_results?: SubjectResult[];
  };
  summary: {
    correct_count: number;
    incorrect_count: number;
    not_attempted_count: number;
    total_marks_obtained: number;
    overall_percentage: number;
    overall_grade: string;
  };
  subject_results: SubjectResult[];
  grade_settings: GradeSetting[];
  answers: AdminUserResultAnswer[];
}

export interface AdminUserAttemptHistoryItem {
  attempt_id: number;
  paper_id: number;
  paper_name?: string;
  status: string;
  completion_reason?: "manual" | "time_over" | null;
  started_at: string;
  submitted_at?: string | null;
  total_questions: number;
  attempted_count: number;
  unattempted_count: number;
  obtained_marks?: number | null;
  total_marks?: number;
  overall_grade?: string;
  is_auto_submitted: boolean;
  subject_results?: SubjectResult[];
  typing_stats?: TypingStats | null;
}

export interface AdminUserAttemptsResponse {
  user: {
    id: number;
    username: string;
    mobile: string;
    email?: string | null;
  };
  attempts: AdminUserAttemptHistoryItem[];
}

export interface GetUserResultsParams {
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  completionReason?: string;
  overallGrade?: string;
  project_lead_id?: string;
}
