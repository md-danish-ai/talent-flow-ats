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
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be under 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Invalid mobile number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  testLevel: z.enum(TEST_LEVELS),
  role: z.enum(ROLES),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// ─── Sign In Schema ─────────────────────────────────────────────────────
export const signInSchema = z.object({
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be under 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Invalid mobile number format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
  role: z.enum(ROLES),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
