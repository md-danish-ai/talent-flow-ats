import { z } from "zod";

export const evaluationSchema = z.object({
  evaluation_data: z.object({
    Communication: z.string().min(1, "Communication rating is required"),
    "Domain Knowledge": z
      .string()
      .min(1, "Domain Knowledge rating is required"),
    "Critical Thinking": z
      .string()
      .min(1, "Critical Thinking rating is required"),
    Professionalism: z.string().min(1, "Professionalism rating is required"),
    "Cultural Fit": z.string().min(1, "Cultural Fit rating is required"),
    "Learning Ability": z
      .string()
      .min(1, "Learning Ability rating is required"),
  }),
  overall_grade: z.string().min(1, "Overall grade is required"),
  final_verdict_id: z.coerce.number().min(1, "Final verdict is required"),
  comments: z.string().optional().or(z.literal("")),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
