import { z } from "zod";

// ─── Enum Constants (mirrors backend enums — single source of truth) ─────
export const TEST_LEVELS = ["fresher", "QA", "team-lead"] as const;
export const ROLES = ["user", "admin"] as const;

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
  testLevel: z.enum(TEST_LEVELS),
  role: z.enum(ROLES),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// ─── Sign In Schema ─────────────────────────────────────────────────────
export const signInSchema = z
  .object({
    mobile: z
      .string()
      .length(10, "The mobile number must be exactly 10 digits.")
      .regex(/^\d+$/, "The mobile number must contain only digits.")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password is too long"),
    role: z.enum(ROLES),
  })
  .superRefine((data, ctx) => {
    if (data.role === "user") {
      if (!data.mobile || data.mobile.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The mobile number is required for user login.",
          path: ["mobile"],
        });
      }
    } else if (data.role === "admin") {
      if (
        (!data.mobile || data.mobile.trim() === "") &&
        (!data.email || data.email.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Either a mobile or email address is required for admin login.",
          path: ["mobile"],
        });
      }
    }
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
