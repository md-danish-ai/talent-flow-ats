/**
 * Centralized classification codes used throughout the frontend.
 * These correspond exactly to the `code` values stored in the backend classifications table.
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

// ─── Exam Levels ───────────────────────────────────────────────────────────
export const EXAM_LEVELS = {
  FRESHER: "FRESHER",
  QA: "QA",
  TEAMLEAD: "TEAMLEAD",
} as const;

export type ExamLevel = (typeof EXAM_LEVELS)[keyof typeof EXAM_LEVELS];

// ─── Subjects ──────────────────────────────────────────────────────────────
export const SUBJECTS = {
  APTITUDE: "APTITUDE",
  BRAND_AWARENESS: "BRAND_AWARENESS",
  COMPANY_CONTACT_DETAILS: "COMPANY_CONTACT_DETAILS",
  COMPREHENSION: "COMPREHENSION",
  DATA_INTERPRETATION_ANALYTICS: "DATA_INTERPRETATION_ANALYTICS",
  ENGLISH: "ENGLISH",
  EXCEL: "EXCEL",
  FOOD_INDUSTRY: "FOOD_INDUSTRY",
  GRAMMAR: "GRAMMAR",
  INDUSTRY_AWARENESS: "INDUSTRY_AWARENESS",
  LEAD_GENERATION: "LEAD_GENERATION",
  REAL_ESTATE: "REAL_ESTATE",
  TYPING_TEST: "TYPING_TEST",
  WRITTEN: "WRITTEN",
  E_COMMERCE_ONLINE_SHOPPING: "E_COMMERCE_ONLINE_SHOPPING",
} as const;

export type Subject = (typeof SUBJECTS)[keyof typeof SUBJECTS];
