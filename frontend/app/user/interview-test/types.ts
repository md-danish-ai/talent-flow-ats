export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "IMAGE_MULTIPLE_CHOICE"
  | "SUBJECTIVE"
  | "IMAGE_SUBJECTIVE"
  | "PASSAGE_CONTENT"
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
  image_url?: string;
  marks?: number;
  testLevel?: string;
  explanation?: string;
}

export interface InterviewSection {
  id: string;
  title: string;
  durationMinutes: number;
  questions: InterviewQuestion[];
}

export type TimerZone = "safe" | "warn" | "danger";
