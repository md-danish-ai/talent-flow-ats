import { z } from "zod";

export const evaluationSchema = z.object({
  evaluation_data: z.object({
    Communication: z.string().optional().or(z.literal("")),
    "Domain Knowledge": z.string().optional().or(z.literal("")),
    "Critical Thinking": z.string().optional().or(z.literal("")),
    Professionalism: z.string().optional().or(z.literal("")),
    "Cultural Fit": z.string().optional().or(z.literal("")),
    "Learning Ability": z.string().optional().or(z.literal("")),
  }),
  overall_grade: z.string().optional().or(z.literal("")),
  final_result_id: z.coerce.number().optional().or(z.literal(0)),
  comments: z.string().optional().or(z.literal("")),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
