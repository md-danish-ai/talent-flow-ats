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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { signInSchema, type SignInFormValues } from "@lib/validations/auth";
import { useSignIn } from "@lib/react-query/user/use-auth";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Alert } from "@components/ui-elements/Alert";
import { getErrorMessage } from "@lib/utils";

export function SignInForm() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [serverError, setServerError] = useState<string | null>(null);

  const signInMutation = useSignIn();

  const form = useForm({
    defaultValues: {
      mobile: "",
      email: "",
      password: "",
      role: role as "user" | "admin",
    } as SignInFormValues,
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // Only send email for admin role
        const payload = { ...value };
        if (value.role === "user") {
          delete payload.email;
        }

        const response = await signInMutation.mutateAsync(payload);

        // Store auth token and role in cookies
        document.cookie = `role=${response.user?.role ?? value.role}; path=/`;
        document.cookie = `auth_token=${response.access_token}; path=/`;
        // Store user info for profile display
        document.cookie = `user_info=${encodeURIComponent(JSON.stringify(response.user))}; path=/`;

        const userRole = response.user?.role ?? value.role;
        if (userRole === "admin") {
          router.push("/admin/dashboard");
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
        <form.Field name="role">
          {(field) => (
            <div>
              <Typography
                as="label"
                variant="h6"
                className="mb-2 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Select Your Role
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                <Typography
                  as="label"
                  className={`flex cursor-pointer items-center justify-center rounded-md border-2 py-2.5 text-small font-bold transition-all ${
                    field.state.value === "user"
                      ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                      : "border-slate-100 dark:border-border text-slate-400 hover:border-brand-primary/20 hover:bg-brand-primary/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    className="hidden"
                    checked={field.state.value === "user"}
                    onChange={(e) => {
                      field.handleChange(e.target.value as "admin" | "user");
                      setRole(e.target.value);
                    }}
                  />
                  <Typography variant="body4" weight="bold" as="span">
                    User
                  </Typography>
                </Typography>
                <Typography
                  as="label"
                  className={`flex cursor-pointer items-center justify-center rounded-md border-2 py-2.5 text-small font-bold transition-all ${
                    field.state.value === "admin"
                      ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                      : "border-slate-100 dark:border-border text-slate-400 hover:border-brand-primary/20 hover:bg-brand-primary/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    className="hidden"
                    checked={field.state.value === "admin"}
                    onChange={(e) => {
                      field.handleChange(e.target.value as "admin" | "user");
                      setRole(e.target.value);
                    }}
                  />
                  <Typography variant="body4" weight="bold" as="span">
                    Admin
                  </Typography>
                </Typography>
              </div>
            </div>
          )}
        </form.Field>

        {role === "admin" && (
          <form.Field name="email">
            {(field) => (
              <div className="group">
                <Typography
                  as="label"
                  variant="h6"
                  className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Email Address
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
        )}

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

      {role === "user" && (
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
      )}
    </div>
  );
}
