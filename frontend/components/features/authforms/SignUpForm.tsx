"use client";

import { ChevronRight, Loader2, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "@lib/toast";
import { Input } from "@components/ui-elements/Input";
import { signUpSchema, type SignUpFormValues } from "@lib/validations/auth";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useSignUp } from "@hooks/api/user/use-auth";
import { useDepartments } from "@hooks/api/departments/use-departments";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import {
  getErrorMessage,
  normalizeProperCase,
  normalizeMobile,
  normalizeEmail,
} from "@lib/utils";

export function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const isDeptInitializedRef = useRef(false);
  const isLevelInitializedRef = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clearAuth =
      searchParams.get("clear_auth") || urlParams.get("clear_auth");
    const isInactive =
      searchParams.get("inactive") === "1" || urlParams.get("inactive") === "1";

    if (isInactive) {
      const timer = setTimeout(() => {
        toast.error(
          "Your account is currently inactive. Please contact the administrator.",
          {
            title: "Account Inactive",
            duration: 3000,
          },
        );
        const url = new URL(window.location.href);
        url.searchParams.delete("clear_auth");
        url.searchParams.delete("inactive");
        window.history.replaceState({}, "", url.pathname);
      }, 500);
      return () => clearTimeout(timer);
    } else if (clearAuth === "1") {
      const timer = setTimeout(() => {
        toast.error("Session expired. Please sign up or sign in again.", {
          title: "Auth Alert",
          duration: 3000,
        });
        const url = new URL(window.location.href);
        url.searchParams.delete("clear_auth");
        window.history.replaceState({}, "", url.pathname);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
      onChange: signUpSchema.refine(
        (data) => {
          const dept = departments?.find(
            (d) => String(d.id) === String(data.department_id),
          );
          const needsInterview = dept?.requires_interview ?? true;
          if (needsInterview && !data.test_level_id) {
            return false;
          }
          return true;
        },
        {
          message: "Please select an exam level",
          path: ["test_level_id"],
        },
      ),
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const submitValue: Record<string, unknown> = {
        ...value,
        name: normalizeProperCase(value.name),
        email: normalizeEmail(value.email) || undefined,
        mobile: normalizeMobile(value.mobile),
      };
      if (!submitValue.test_level_id) {
        delete submitValue.test_level_id;
      }

      try {
        const response = await signUpMutation.mutateAsync(
          submitValue as unknown as SignUpFormValues,
        );

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

  // Set default Department (KPO & BPO) on initial load
  useEffect(() => {
    if (
      !isDeptInitializedRef.current &&
      departments &&
      departments.length > 0
    ) {
      const defaultDept =
        departments.find(
          (d) =>
            d.name?.toLowerCase().trim() === "kpo & bpo" ||
            d.name?.toLowerCase().includes("kpo"),
        ) || departments[0];

      if (defaultDept && !form.getFieldValue("department_id")) {
        form.setFieldValue("department_id", String(defaultDept.id));
        isDeptInitializedRef.current = true;
      }
    }
  }, [departments, form]);

  // Set default Exam Level (Fresher) on initial load if department requires interview
  useEffect(() => {
    if (
      !isLevelInitializedRef.current &&
      classificationRes?.data &&
      classificationRes.data.length > 0
    ) {
      const fresherLevel = classificationRes.data.find(
        (c) =>
          c.name?.toLowerCase().trim() === "fresher" ||
          c.code?.toLowerCase().trim() === "fresher",
      );

      if (fresherLevel && !form.getFieldValue("test_level_id")) {
        const currentDeptId = form.getFieldValue("department_id");
        const currentDept = departments?.find(
          (d) => String(d.id) === String(currentDeptId),
        );
        const needsInterview = currentDept
          ? currentDept.requires_interview
          : true;
        if (needsInterview) {
          form.setFieldValue("test_level_id", String(fresherLevel.id));
          isLevelInitializedRef.current = true;
        }
      }
    }
  }, [classificationRes, departments, form]);

  return (
    <div className="w-full">
      {serverError && (
        <Alert
          variant="error"
          description={serverError}
          className="mb-5"
          onClose={() => setServerError(null)}
        />
      )}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Row 1: Name and Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  startIcon={<User size={18} />}
                  error={field.state.meta.errors.length > 0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-11 font-medium"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="mt-1 font-semibold text-red-500"
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
                <Input
                  name="mobile"
                  type="tel"
                  placeholder="9999999999"
                  startIcon={<Phone size={18} />}
                  error={field.state.meta.errors.length > 0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-11 font-medium"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="mt-1 font-semibold text-red-500"
                    >
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  )}
              </div>
            )}
          </form.Field>
        </div>

        {/* Row 2: Email */}
        <form.Field name="email">
          {(field) => (
            <div className="group">
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Email Address{" "}
                <span className="font-normal normal-case opacity-40">
                  (optional)
                </span>
              </Typography>
              <Input
                name="email"
                type="email"
                placeholder="name@company.com"
                startIcon={<Mail size={18} />}
                error={field.state.meta.errors.length > 0}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-11 font-medium"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography
                    variant="body5"
                    className="mt-1 font-semibold text-red-500"
                  >
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>

        {/* Row 3: Department and Exam Level */}
        <form.Subscribe selector={(state) => [state.values.department_id]}>
          {([departmentId]) => {
            const selectedDept = departments?.find(
              (d) => String(d.id) === String(departmentId),
            );
            const needsInterview = selectedDept?.requires_interview ?? true;

            return (
              <div
                className={`grid gap-4 ${needsInterview ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
              >
                <form.Field name="department_id">
                  {(field) => (
                    <div className="group">
                      <Typography
                        as="label"
                        variant="h6"
                        className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
                      >
                        Department
                      </Typography>
                      <SelectDropdown
                        options={deptOptions}
                        value={field.state.value}
                        onChange={(val) => {
                          field.handleChange(String(val));
                          // Reset test level to blank whenever department changes
                          form.setFieldValue("test_level_id", "");
                        }}
                        placeholder="Department"
                        isLoading={isLoadingDepts}
                        disabled={isLoadingDepts}
                        placement="top"
                        className="h-11 py-0"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <Typography
                            variant="body5"
                            className="mt-1 font-semibold text-red-500"
                          >
                            {getErrorMessage(field.state.meta.errors[0])}
                          </Typography>
                        )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="test_level_id">
                  {(field) =>
                    needsInterview ? (
                      <div className="group">
                        <Typography
                          as="label"
                          variant="h6"
                          className="mb-1.5 block uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          Exam Level
                        </Typography>
                        <SelectDropdown
                          options={levels}
                          value={field.state.value}
                          onChange={(val) => field.handleChange(String(val))}
                          placeholder="Exam Level"
                          isLoading={isLoadingLevels}
                          disabled={isLoadingLevels}
                          placement="top"
                          className="h-11 py-0"
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <Typography
                              variant="body5"
                              className="mt-1 font-semibold text-red-500"
                            >
                              {getErrorMessage(field.state.meta.errors[0])}
                            </Typography>
                          )}
                      </div>
                    ) : null
                  }
                </form.Field>
              </div>
            );
          }}
        </form.Subscribe>

        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              color="primary"
              shadow
              disabled={isSubmitting}
              animate="scale"
              className="w-full py-3.5 text-medium font-bold mt-2 shadow-lg shadow-brand-primary/20"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <span>Create Account</span>
                  <ChevronRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 text-center">
        <Typography
          variant="body4"
          className="text-slate-400 dark:text-slate-500 font-medium"
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-brand-primary hover:underline transition-all"
          >
            Sign In
          </Link>
        </Typography>
      </div>
    </div>
  );
}
