import { z } from "zod";

export const mcqOptionSchema = z.object({
  option_label: z.string(),
  option_text: z.string().min(1, "Option content is required"),
  is_correct: z.boolean(),
});

export const mcqSchema = z.object({
  question_type_id: z.coerce.number().min(1, "Question type is required"),
  subject_type_id: z.coerce.number().min(1, "Subject is required"),
  exam_level_id: z.coerce.number().min(1, "Exam level is required"),
  question_text: z.string().min(10, "Question must be at least 10 characters"),
  options: z
    .array(mcqOptionSchema)
    .min(2, "At least two options are required")
    .refine((options) => options.some((opt) => opt.is_correct), {
      message: "One option must be marked as correct",
    }),
  explanation: z.string().min(5, "Explanation must be at least 5 characters"),
  source: z.string().default("Manual"),
  marks: z.coerce.number().min(1).max(50).default(1),
});

// Image MCQ Specific Validations
export const imageMCQSchema = z.object({
  question_type_id: z.coerce.number().min(1, "Question type is required"),
  subject_type_id: z.coerce.number().min(1, "Subject is required"),
  exam_level_id: z.coerce.number().min(1, "Exam level is required"),
  question_text: z.string().min(10, "Question must be at least 10 characters"),
  questionImageUrl: z.string().min(1, "Question image is required"),
  // Note: Add image fields here later if required (e.g., questionImage: z.any())
  options: z
    .array(mcqOptionSchema)
    .min(2, "At least two options are required")
    .refine((options) => options.some((opt) => opt.is_correct), {
      message: "One option must be marked as correct",
    }),
  explanation: z.string().min(5, "Explanation must be at least 5 characters"),
  source: z.string().default("Manual"),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  answerText: z.string().min(1, "Answer is required"),
  explanation: z.string().optional(),
});

// Image Subjective Specific Validations
export const imageSubjectiveSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  questionImageUrl: z.string().min(1, "Question image is required"),
  answerText: z.string().min(1, "Answer is required"),
  explanation: z.string().optional(),
});

// Passage Specific Validations
export const passageSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  passage: z.string().min(20, "Passage must be at least 20 characters"),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  answerText: z.string().min(1, "Answer is required"),
  explanation: z.string().optional(),
});

// Subjective Specific Validations
export const subjectiveSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  answerText: z.string().min(1, "Answer is required"),
  explanation: z.string().optional(),
});

// Image Subjective Specific Validations
export const imageSubjectiveSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  questionImageUrl: z.string().min(1, "Question image is required"),
  answerText: z.string().min(1, "Answer is required"),
  explanation: z.string().optional(),
});

// Passage Specific Validations
export const passageSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  passage: z.string().min(20, "Passage must be at least 20 characters"),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  answerText: z.string().min(1, "Answer is required"),
  explanation: z.string().optional(),
});

export type MCQFormValues = z.infer<typeof mcqSchema>;
export type MCQOptionValues = z.infer<typeof mcqOptionSchema>;
export type ImageMCQFormValues = z.infer<typeof imageMCQSchema>;
export type SubjectiveFormValues = z.infer<typeof subjectiveSchema>;
export type ImageSubjectiveFormValues = z.infer<typeof imageSubjectiveSchema>;
export type PassageFormValues = z.infer<typeof passageSchema>;
