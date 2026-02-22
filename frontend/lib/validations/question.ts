import { z } from "zod";

export const mcqOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string().min(1, "Option content is required"),
  isCorrect: z.boolean(),
});

export const mcqSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  options: z
    .array(mcqOptionSchema)
    .min(2, "At least two options are required")
    .refine((options) => options.some((opt) => opt.isCorrect), {
      message: "One option must be marked as correct",
    }),
  explanation: z.string().min(5, "Explanation must be at least 5 characters"),
});

export type MCQFormValues = z.infer<typeof mcqSchema>;
export type MCQOptionValues = z.infer<typeof mcqOptionSchema>;
