export interface AttemptSavedResponse {
  question_id: number;
  section_code: string;
  section_name: string;
  answer_text?: string | null;
  is_attempted: boolean;
  is_auto_saved: boolean;
  saved_at: string;
}

export interface StartAttemptResponse {
  attempt_id: number;
  paper_id: number;
  user_id: number;
  status: string;
  total_questions: number;
  started_at: string;
  is_resumed: boolean;
  paper_question_ids: number[];
  saved_responses: AttemptSavedResponse[];
  total_duration_minutes: number;
}

export interface SaveAttemptAnswerResponse {
  attempt_id: number;
  question_id: number;
  section_code: string;
  section_name: string;
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

export interface ActiveStatusResponse {
  has_attempt: boolean;
  status: string | null;
  is_expired: boolean;
  attempt_id?: number | null;
}
