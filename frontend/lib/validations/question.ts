import { z } from "zod";

export const mcqOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string().min(1, "Option content is required"),
  isCorrect: z.boolean(),
});

export const mcqSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(10),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  options: z
    .array(mcqOptionSchema)
    .min(2, "At least two options are required")
    .refine((options) => options.some((opt) => opt.isCorrect), {
      message: "One option must be marked as correct",
    }),
  explanation: z.string().optional().or(z.literal("")),
});

// Image MCQ Specific Validations
export const imageMCQSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  questionImageUrl: z.string().min(1, "Question image is required"),
  // Note: Add image fields here later if required (e.g., questionImage: z.any())
  options: z
    .array(mcqOptionSchema)
    .min(2, "At least two options are required")
    .refine((options) => options.some((opt) => opt.isCorrect), {
      message: "One option must be marked as correct",
    }),
  explanation: z.string().optional().or(z.literal("")),
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

// Typing Test Validations
export const typingTestSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().min(1, "Title is required"),
  passage: z.string().min(10, "Paragraph content is required"),
});

// Lead Generation Validations
export const leadGenerationSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().optional(),
  companyName: z.string().min(1, "Company Name is required"),
  website: z.string().min(1, "Website is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

// Contact Details Validations
export const contactDetailsSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  examLevel: z.string().min(1, "Exam Level is required"),
  marks: z.coerce.number().min(1).max(50),
  questionText: z.string().optional(),
  websiteUrl: z.string().min(1, "Website URL is required"),
  companyName: z.string().min(1, "Company Name is required"),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  companyPhoneNumber: z.string().optional(),
  generalEmail: z.string().optional(),
  facebookPage: z.string().optional(),
});

export type TypingTestFormValues = z.infer<typeof typingTestSchema>;
export type LeadGenerationFormValues = z.infer<typeof leadGenerationSchema>;
export type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>;
