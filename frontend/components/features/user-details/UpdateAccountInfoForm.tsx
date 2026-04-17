"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { User, Phone, Mail, Loader2, Save } from "lucide-react";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { signUpSchema, type SignUpFormValues } from "@lib/validations/auth";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useUpdateBasicInfo } from "@lib/react-query/user/use-auth";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";
import { getErrorMessage } from "@lib/utils";

interface UpdateAccountInfoFormProps {
  userId: string | number;
  initialData: {
    username?: string;
    mobile?: string;
    email?: string;
    test_level_id?: number | string;
    test_level_name?: string;
    department_id?: number | string;
  };
  onSuccess?: () => void;
}

export function UpdateAccountInfoForm({
  userId,
  initialData,
  onSuccess,
}: UpdateAccountInfoFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const updateMutation = useUpdateBasicInfo(userId);
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
      name: initialData.username || "",
      mobile: initialData.mobile || "",
      email: initialData.email || "",
      test_level_id: initialData.test_level_id
        ? String(initialData.test_level_id)
        : "",
      department_id: initialData.department_id
        ? String(initialData.department_id)
        : "",
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
    <div className="space-y-6">
      {serverError && (
        <Alert
          variant="error"
          description={serverError}
          onClose={() => setServerError(null)}
        />
      )}
      {serverSuccess && (
        <Alert
          variant="success"
          description={serverSuccess}
          onClose={() => setServerSuccess(null)}
        />
      )}

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
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
                className="mb-1.5 block uppercase tracking-wider text-slate-500 font-bold text-[10px]"
              >
                Full Name
              </Typography>
              <Input
                name="name"
                placeholder="John Doe"
                startIcon={<User size={18} />}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
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
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 font-bold text-[10px]"
              >
                Mobile Number
              </Typography>
              <Input
                name="mobile"
                placeholder="9999999999"
                startIcon={<Phone size={18} />}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
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
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 font-bold text-[10px]"
              >
                Email Address
              </Typography>
              <Input
                name="email"
                placeholder="name@company.com"
                startIcon={<Mail size={18} />}
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
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
                className="mb-1.5 block uppercase tracking-wider text-slate-500 font-bold text-[10px]"
              >
                Test Level
              </Typography>
              <SelectDropdown
                options={levels}
                value={field.state.value}
                onChange={(val) => field.handleChange(String(val))}
                placeholder="Choose Level"
                isLoading={isLoadingLevels}
                disabled={isLoadingLevels}
                placement="bottom"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
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
              <Typography
                as="label"
                variant="h6"
                className="mb-1.5 block uppercase tracking-wider text-slate-500 font-bold text-[10px]"
              >
                Department
              </Typography>
              <SelectDropdown
                options={deptOptions}
                value={field.state.value}
                onChange={(val) => field.handleChange(String(val))}
                placeholder="Choose Department"
                isLoading={isLoadingDepts}
                disabled={isLoadingDepts}
                placement="bottom"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="mt-1 text-red-500">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>

        <div className="col-span-full pt-4 flex justify-end">
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <Button
                type="submit"
                variant="primary"
                color="primary"
                disabled={isSubmitting || !canSubmit}
                startIcon={
                  isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )
                }
                className="w-full md:w-auto h-12 px-8 font-bold uppercase tracking-widest text-[11px]"
              >
                {isSubmitting ? "Saving..." : "Update Account Info"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
