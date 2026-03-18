/**
 * Centralized classification codes used throughout the frontend.
 * These correspond exactly to the `code` values stored in the backend classifications table.
 *
 * DO NOT hardcode these strings anywhere else in the codebase.
 * Import and use these constants instead.
 */

// ─── Question Types ────────────────────────────────────────────────────────
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  IMAGE_MULTIPLE_CHOICE: "IMAGE_MULTIPLE_CHOICE",
  SUBJECTIVE: "SUBJECTIVE",
  IMAGE_SUBJECTIVE: "IMAGE_SUBJECTIVE",
  PASSAGE_CONTENT: "PASSAGE_CONTENT",
  TYPING_TEST: "TYPING_TEST",
  LEAD_GENERATION: "LEAD_GENERATION",
  CONTACT_DETAILS: "CONTACT_DETAILS",
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

// ─── Subject Types ─────────────────────────────────────────────────────────
export const SUBJECT_TYPES = {
  COMPREHENSION: "COMPREHENSION",
  WRITTEN: "WRITTEN",
  GRAMMAR: "GRAMMAR",
  APTITUDE: "APTITUDE",
  INDUSTRY_AWARENESS: "INDUSTRY_AWARENESS",
} as const;

export type SubjectType = (typeof SUBJECT_TYPES)[keyof typeof SUBJECT_TYPES];

// ─── Exam Levels ───────────────────────────────────────────────────────────
export const EXAM_LEVELS = {
  FRESHER: "FRESHER",
  QA: "QA",
  TEAMLEAD: "TEAMLEAD",
} as const;

export type ExamLevel = (typeof EXAM_LEVELS)[keyof typeof EXAM_LEVELS];

// ─── Subjects ──────────────────────────────────────────────────────────────
export const SUBJECTS = {
  ENGLISH: "ENGLISH",
  GRAMMER: "GRAMMER",
  LOGICAL: "LOGICAL",
  MATHS: "MATH'S",
} as const;

export type Subject = (typeof SUBJECTS)[keyof typeof SUBJECTS];
