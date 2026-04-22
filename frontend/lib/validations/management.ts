import { z } from "zod";

/**
 * Schema for creating/updating a Department
 */
export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(100, "Department name is too long"),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

/**
 * Schema for creating/updating a Classification (Subject/Level)
 */
export const classificationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
  is_exclusive: z.boolean().optional(),
});

export type ClassificationFormValues = z.infer<typeof classificationSchema>;
