"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { User, Phone, Mail, Loader2, Save } from "lucide-react";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { signUpSchema, type SignUpFormValues, TEST_LEVELS } from "@lib/validations/auth";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useUpdateBasicInfo } from "@lib/react-query/user/use-auth";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { getErrorMessage } from "@lib/utils";

interface UpdateAccountInfoFormProps {
  userId: string | number;
  initialData: {
    username?: string;
    mobile?: string;
    email?: string;
    testlevel?: string;
    department_id?: number | string;
  };
  onSuccess?: () => void;
}

export function UpdateAccountInfoForm({ userId, initialData, onSuccess }: UpdateAccountInfoFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const updateMutation = useUpdateBasicInfo(userId);
  const { data: departments, isLoading: isLoadingDepts } = useDepartments({ is_active: true });

  const levelLabels: Record<string, string> = {
    FRESHER: "Fresher",
    QA: "Quality Analyst",
    TEAMLEAD: "Team Lead",
  };
  const levels = TEST_LEVELS.map((id) => ({ id, label: levelLabels[id] }));

  const deptOptions = (departments || []).map((d) => ({
    id: String(d.id),
    label: d.name,
  }));

  const form = useForm({
    // @ts-expect-error - validatorAdapter types mismatch in this version
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: initialData.username || "",
      mobile: initialData.mobile || "",
      email: initialData.email || "",
      testLevel: (initialData.testlevel?.toUpperCase() as (typeof TEST_LEVELS)[number]) || "FRESHER",
      department_id: initialData.department_id ? String(initialData.department_id) : "",
      role: "user",
    } as SignUpFormValues,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setServerSuccess(null);
      try {
        await updateMutation.mutateAsync(value);
        setServerSuccess("Account information updated successfully!");
        if (onSuccess) onSuccess();
      } catch (err: unknown) {
        setServerError(
          getErrorMessage(err) || "Failed to update account information.",
        );
      }
    },
  });

  return (
    <MainCard
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
            <User size={20} />
          </div>
          <span className="font-bold">Basic Account Information</span>
        </div>
      }
      className="mb-6"
    >
      <div className="p-4">
        {serverError && (
          <Alert
            variant="error"
            description={serverError}
            className="mb-4"
            onClose={() => setServerError(null)}
          />
        )}
        {serverSuccess && (
          <Alert
            variant="success"
            description={serverSuccess}
            className="mb-4"
            onClose={() => setServerSuccess(null)}
          />
        )}

        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {(field) => (
              <div className="group">
                <Typography as="label" variant="h6" className="mb-1.5 block uppercase tracking-wider text-slate-500">
                  Full Name
                </Typography>
                <Input
                  name="name"
                  placeholder="John Doe"
                  startIcon={<User size={18} />}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="mobile">
            {(field) => (
              <div className="group">
                <Typography as="label" variant="h6" className="mb-1.5 block uppercase tracking-wider text-slate-500">
                  Mobile Number
                </Typography>
                <Input
                  name="mobile"
                  placeholder="9999999999"
                  startIcon={<Phone size={18} />}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="group">
                <Typography as="label" variant="h6" className="mb-1.5 block uppercase tracking-wider text-slate-500">
                  Email Address
                </Typography>
                <Input
                  name="email"
                  placeholder="name@company.com"
                  startIcon={<Mail size={18} />}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="testLevel">
            {(field) => (
              <div className="group">
                <Typography as="label" variant="h6" className="mb-1.5 block uppercase tracking-wider text-slate-500">
                  Test Level
                </Typography>
                <SelectDropdown
                  options={levels}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val as (typeof TEST_LEVELS)[number])}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="department_id">
            {(field) => (
              <div className="group">
                <Typography as="label" variant="h6" className="mb-1.5 block uppercase tracking-wider text-slate-500">
                  Department
                </Typography>
                <SelectDropdown
                  options={deptOptions}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(String(val))}
                  placeholder={isLoadingDepts ? "Loading..." : "Select Department"}
                  disabled={isLoadingDepts}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <div className="col-span-full flex justify-end">
            <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
              {([isSubmitting, canSubmit]) => (
                <Button
                  type="submit"
                  variant="primary"
                  color="primary"
                  disabled={isSubmitting || !canSubmit}
                  startIcon={isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                >
                  {isSubmitting ? "Saving..." : "Update Account Info"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </MainCard>
  );
}
