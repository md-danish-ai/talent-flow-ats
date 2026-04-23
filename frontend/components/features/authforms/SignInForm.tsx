"use client";

import {
  ChevronRight,
  Loader2,
  Lock,
  Mail,
  Phone,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { toast } from "@lib/toast";
import { signInSchema, type SignInFormValues } from "@lib/validations/auth";
import { useSignIn } from "@hooks/api/user/use-auth";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Alert } from "@components/ui-elements/Alert";
import { getErrorMessage } from "@lib/utils";

export function SignInForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check both Next.js hook and raw window location
    const urlParams = new URLSearchParams(window.location.search);
    const clearAuth =
      searchParams.get("clear_auth") || urlParams.get("clear_auth");

    if (clearAuth === "1") {
      console.log("Session expiration detected via URL flag");

      // Small delay to ensure ToastProvider is ready and portal is mounted
      const timer = setTimeout(() => {
        toast.error("Session expired. Please sign in again.", {
          title: "Auth Alert",
          duration: 20000,
        });

        // Clean up URL without refreshing
        const url = new URL(window.location.href);
        url.searchParams.delete("clear_auth");
        window.history.replaceState({}, "", url.pathname);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const signInMutation = useSignIn();

  const form = useForm({
    // @ts-expect-error - validatorAdapter types mismatch in this version
    validatorAdapter: zodValidator(),
    defaultValues: {
      mobile: "",
      email: "",
      password: "",
    } as SignInFormValues,
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const response = await signInMutation.mutateAsync(value);

        const userRole = response.user?.role;
        // Store auth token and role in cookies
        document.cookie = `role=${userRole}; path=/`;
        document.cookie = `auth_token=${response.access_token}; path=/`;

        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else if (userRole === "project_lead") {
          router.push("/project-lead/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        setServerError(
          error.message ?? "Sign in failed. Please check your credentials.",
        );
      }
    },
  });

  return (
    <div className="w-full">
      {serverError && (
        <Alert
          variant="error"
          description={serverError}
          className="mb-4"
          onClose={() => setServerError(null)}
        />
      )}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Email Address (Optional)
              </Typography>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  startIcon={<Mail className="h-[18px] w-[18px]" />}
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

        <form.Field name="mobile">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Mobile Number
              </Typography>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="9999999999"
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

        <form.Field name="password">
          {(field) => (
            <div className="group">
              <div className="mb-1.5">
                <Typography
                  as="label"
                  variant="h6"
                  className="uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Password
                </Typography>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  startIcon={<Lock className="h-[18px] w-[18px]" />}
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
              className="w-full py-3.5 text-medium font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <Typography
                    variant="span"
                    weight="bold"
                    className="text-white"
                  >
                    Signing In…
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="span"
                    weight="bold"
                    className="text-white"
                  >
                    Sign In
                  </Typography>
                  <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <Typography
        variant="body4"
        className="mt-6 text-center text-slate-400 dark:text-slate-500"
      >
        New to TalentFlow?{" "}
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-bold text-brand-primary hover:underline"
        >
          Create an account <UserPlus className="h-3.5 w-3.5" />
        </Link>
      </Typography>
    </div>
  );
}
