import { z } from "zod";

export const paperSubjectConfigSchema = z.object({
  subject_id: z.number(),
  subject_name: z.string(),
  is_selected: z.boolean(),
  question_count: z.number().min(0),
  total_marks: z.number().min(0),
  order: z.number().min(0),
});

export const paperSetupSchema = z.object({
  department_id: z.number().min(1, "Please select a department"),
  test_level_id: z.number().min(1, "Please select a test level"),
  paper_name: z.string().min(3, "Paper name must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  english_test_time: z
    .number({ required_error: "English test time is required" })
    .min(1, "English test time is required"),
  excel_time: z
    .number({ required_error: "Excel time is required" })
    .min(1, "Excel time is required"),
  company_details_time: z
    .number({ required_error: "Company details time is required" })
    .min(1, "Company details time is required"),
  lead_generation_time: z
    .number({ required_error: "Lead generation time is required" })
    .min(1, "Lead generation time is required"),
  typing_test_time: z
    .number({ required_error: "Typing test time is required" })
    .min(1, "Typing test time is required"),
  rpit_test_time: z
    .number({ required_error: "RPIT test time is required" })
    .min(1, "RPIT test time is required"),
  subject_configs: z
    .array(paperSubjectConfigSchema)
    .refine((configs) => configs.some((c) => c.is_selected), {
      message: "At least one subject must be selected",
    }),
});

export type PaperSetupFormValues = z.infer<typeof paperSetupSchema>;
