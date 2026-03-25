export type QuestionType =
  | "MCQ"
  | "IMAGE_MCQ"
  | "SUBJECTIVE"
  | "PASSAGE_MCQ"
  | "TYPING_TEST"
  | "LEAD_GENERATION"
  | "CONTACT_DETAILS";

export interface InterviewQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
  subjectName?: string;
  typeName?: string;
  description?: string;
  options?: string[];
  passage?: string;
  imageUrl?: string;
}

export interface InterviewSection {
  id: string;
  title: string;
  durationMinutes: number;
  questions: InterviewQuestion[];
}

export type TimerZone = "safe" | "warn" | "danger";
