export type QuestionType = "MCQ" | "IMAGE_MCQ" | "SUBJECTIVE" | "PASSAGE_MCQ";

export interface InterviewQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
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
