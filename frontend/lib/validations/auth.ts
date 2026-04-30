import { z } from "zod";

// ─── Enum Constants (mirrors backend enums — single source of truth) ─────
export const ROLES = ["user", "admin", "project_lead"] as const;

// ─── Sign Up Schema ─────────────────────────────────────────────────────
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  mobile: z
    .string()
    .length(10, "The mobile number must be exactly 10 digits.")
    .regex(/^\d+$/, "The mobile number must contain only digits."),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  test_level_id: z.string().min(1, "Please select a test level"),
  department_id: z.string().min(1, "Please select a department"),
  role: z.enum(ROLES),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// ─── Sign In Schema ─────────────────────────────────────────────────────
export const signInSchema = z.object({
  mobile: z
    .string()
    .length(10, "The mobile number must be exactly 10 digits.")
    .regex(/^\d+$/, "The mobile number must contain only digits.")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

// ─── Create Admin Schema ────────────────────────────────────────────────
export const createAdminSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  mobile: z
    .string()
    .length(10, "The mobile number must be exactly 10 digits.")
    .regex(/^\d+$/, "The mobile number must contain only digits."),
  email: z.string().email("Invalid email address"),
});

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

// ─── Change Password Schema ─────────────────────────────────────────────
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(128, "Password is too long"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
