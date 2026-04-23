import { Classification } from "./classification";

export interface QuestionOption {
  option_label: string;
  option_text: string;
  is_correct: boolean;
}

export interface QuestionAnswer {
  answer_text?: string | null;
  explanation?: string | null;
}

export type ClassificationRef = Classification;

export interface Question {
  id: number;
  question_text: string;
  image_url?: string | null;
  passage?: string | null;
  marks: number;
  is_active: boolean;
  options: QuestionOption[] | Record<string, unknown> | null;
  answer?: QuestionAnswer;
  question_type?: ClassificationRef | null;
  subject?: ClassificationRef | null;
  exam_level?: ClassificationRef | null;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionCreate {
  question_type: string;
  subject: string;
  exam_level: string;
  question_text: string;
  image_url?: string | null;
  passage?: string | null;
  marks: number;
  is_active?: boolean;
  options: QuestionOption[] | Record<string, unknown> | null;
  answer: QuestionAnswer;
}

export interface AutoGenerateRequirement {
  type_code: string;
  count: number;
  marks?: number;
}

export interface AutoGenerateRequest {
  subject_code: string;
  exam_level: string;
  requirements: AutoGenerateRequirement[];
}

export interface AutoGenerateResponse {
  question_ids: number[];
  details: {
    type_code: string;
    requested: number;
    found: number;
    question_ids: number[];
  }[];
  warnings: string[];
}
