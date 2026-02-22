"use client";

import { ChevronRight, Loader2, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@components/ui-elements/Input";
import {
  signUpSchema,
  type SignUpFormValues,
  TEST_LEVELS,
} from "@lib/validations/auth";
import { useSignUp } from "@lib/react-query/user/use-auth";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error)
    return String((error as { message: string }).message);
  return "Invalid value";
}

export function SignUpForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const signUpMutation = useSignUp();

  const form = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      testLevel: "fresher",
      role: "user",
    } as SignUpFormValues,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await signUpMutation.mutateAsync(value);
        router.push("/sign-in");
      } catch (err: unknown) {
        const error = err as { message?: string };
        setServerError(
          error.message ?? "Registration failed. Please try again.",
        );
      }
    },
  });

  const levelLabels: Record<(typeof TEST_LEVELS)[number], string> = {
    fresher: "Fresher",
    QA: "Quality Analyst",
    "team-lead": "Team Lead",
  };
  const levels = TEST_LEVELS.map((id) => ({ id, label: levelLabels[id] }));

  return (
    <div className="w-full">
      {/* Server Error */}
      {serverError && (
        <Alert
          variant="error"
          description={serverError}
          className="mb-4"
          onClose={() => setServerError(null)}
        />
      )}

      {/* Form */}
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Full Name */}
        <form.Field name="name">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500"
              >
                Full Name
              </Typography>
              <div className="relative">
                <Input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  startIcon={<User className="h-[18px] w-[18px]" />}
                  error={field.state.meta.errors.length > 0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography
                    variant="body5"
                    className="mt-1 font-medium text-red-500"
                  >
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>

        {/* Mobile Number */}
        <form.Field name="mobile">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500"
              >
                Mobile Number
              </Typography>
              <div className="relative">
                <Input
                  name="mobile"
                  type="tel"
                  placeholder="+91 98765 43210"
                  startIcon={<Phone className="h-[18px] w-[18px]" />}
                  error={field.state.meta.errors.length > 0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography
                    variant="body5"
                    className="mt-1 font-medium text-red-500"
                  >
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500"
              >
                Email Address{" "}
                <Typography
                  variant="body5"
                  as="span"
                  className="font-normal normal-case opacity-50"
                >
                  (optional)
                </Typography>
              </Typography>
              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  startIcon={<Mail className="h-[18px] w-[18px]" />}
                  error={field.state.meta.errors.length > 0}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography
                    variant="body5"
                    className="mt-1 font-medium text-red-500"
                  >
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>

        {/* Test Level Dropdown */}
        <form.Field name="testLevel">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500"
              >
                Select Your Test Level
              </Typography>
              <SelectDropdown
                options={levels}
                value={field.state.value}
                onChange={(val) =>
                  field.handleChange(val as (typeof TEST_LEVELS)[number])
                }
                placement="top"
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting, canSubmit]) => (
            <Button
              type="submit"
              variant="primary"
              color="primary"
              shadow
              disabled={isSubmitting || !canSubmit}
              animate="scale"
              className="w-full py-3.5 text-medium font-bold mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <Typography
                    variant="span"
                    weight="bold"
                    className="text-white"
                  >
                    Creating Account…
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="span"
                    weight="bold"
                    className="text-white"
                  >
                    Create Account
                  </Typography>
                  <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <Link
        href="/sign-in"
        className="mt-6 flex items-center justify-center gap-1 text-small text-slate-400 transition-colors hover:text-brand-primary"
      >
        Already have an account?{" "}
        <Typography
          variant="body3"
          weight="bold"
          as="span"
          className="text-brand-primary"
        >
          Sign In
        </Typography>
      </Link>
    </div>
  );
}
