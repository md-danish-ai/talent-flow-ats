import { z } from "zod";

export const paperSubjectConfigSchema = z
  .object({
    subject_id: z.number(),
    subject_name: z.string(),
    is_selected: z.boolean(),
    question_count: z.number().min(0),
    total_marks: z.number().min(0),
    time_minutes: z.number().min(0),
    order: z.number().min(0),
  })
  .superRefine((data, ctx) => {
    if (data.is_selected) {
      if (data.question_count <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Questions required",
          path: ["question_count"],
        });
      }
      if (data.total_marks <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Marks required",
          path: ["total_marks"],
        });
      }
      if (data.time_minutes <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time required",
          path: ["time_minutes"],
        });
      }
      if (data.order <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Order required",
          path: ["order"],
        });
      }
    }
  });

export const paperSetupSchema = z.object({
  department_id: z.number().min(1, "Please select a department"),
  test_level_id: z.number().min(1, "Please select a test level"),
  paper_name: z.string().min(3, "Paper name must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  subject_configs: z
    .array(paperSubjectConfigSchema)
    .refine((configs) => configs.some((c) => c.is_selected), {
      message: "At least one subject must be selected",
    }),
});

export type PaperSetupFormValues = z.infer<typeof paperSetupSchema>;
