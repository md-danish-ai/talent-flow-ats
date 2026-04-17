"use client";

import { ChevronRight, Loader2, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@components/ui-elements/Input";
import { signUpSchema, type SignUpFormValues } from "@lib/validations/auth";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useSignUp } from "@lib/react-query/user/use-auth";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { getErrorMessage } from "@lib/utils";

export function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const signUpMutation = useSignUp();
  const { data: departments, isLoading: isLoadingDepts } = useDepartments({
    is_active: true,
  });

  const { data: classificationRes, isLoading: isLoadingLevels } =
    useClassifications({
      type: "exam_level",
      is_active: true,
    });
  const levels = (classificationRes?.data || []).map((c) => ({
    id: String(c.id),
    label: c.name,
  }));

  const deptOptions = (departments || []).map((d) => ({
    id: String(d.id),
    label: d.name,
  }));

  const form = useForm({
    // @ts-expect-error - validatorAdapter types mismatch in this version
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      test_level_id: "",
      department_id: "",
      role: "user",
    } as SignUpFormValues,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const response = await signUpMutation.mutateAsync(value);

        if (onSuccess) {
          onSuccess();
          return;
        }

        // Store auth token and role in cookies
        document.cookie = `role=${response.user?.role ?? "user"}; path=/`;
        document.cookie = `auth_token=${response.access_token}; path=/`;

        router.push("/user/dashboard");
      } catch (err: unknown) {
        setServerError(
          getErrorMessage(err) || "Registration failed. Please try again.",
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
        <form.Field name="name">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
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
                  name="mobile"
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

        <form.Field name="email">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
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

        <form.Field name="test_level_id">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Select Your Test Level
              </Typography>
              <SelectDropdown
                options={levels}
                value={field.state.value}
                onChange={(val) => field.handleChange(String(val))}
                placeholder="Choose Level"
                isLoading={isLoadingLevels}
                disabled={isLoadingLevels}
                placement="top"
              />
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

        <form.Field name="department_id">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Select Department
              </Typography>
              <div className="relative">
                <SelectDropdown
                  options={deptOptions}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(String(val))}
                  placeholder="Choose Department"
                  isLoading={isLoadingDepts}
                  disabled={isLoadingDepts}
                  placement="top"
                />
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
        className="mt-6 flex items-center justify-center gap-1 text-small text-slate-400 dark:text-slate-500 transition-colors hover:text-brand-primary"
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
