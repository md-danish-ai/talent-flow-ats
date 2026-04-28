import { Classification } from "./classification";

export interface InterviewEvaluation {
  id: number;
  user_id: number;
  project_lead_id: number;
  attempt_id: number;
  round_type: string;
  status: "pending" | "completed";
  evaluation_data: Record<string, string>;
  overall_grade?: string;
  final_verdict_id?: number;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface EvaluationTask extends InterviewEvaluation {
  candidate_name: string;
  candidate_mobile: string;
  lead_name?: string;
  verdict_name?: string;
}

export interface EvaluationHistoryItem extends InterviewEvaluation {
  lead_name: string;
  candidate_name: string;
  candidate_mobile: string;
  candidate_id?: number;
  verdict_name?: string;
}

export interface AssignLeadPayload {
  user_id: number;
  project_lead_id: number;
  attempt_id: number;
  round_type?: string;
}

export interface SubmitEvaluationPayload {
  evaluation_data: Record<string, string>;
  overall_grade: string;
  final_verdict_id: number;
  comments?: string;
}
