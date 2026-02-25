"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";
import { createAdmin } from "@lib/api/auth";
import {
  createAdminSchema,
  type CreateAdminFormValues,
} from "@lib/validations/auth";
import { getErrorMessage } from "@lib/utils";
import { Loader2 } from "lucide-react";

interface AddAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddAdminForm = ({ onSuccess, onCancel }: AddAdminFormProps) => {
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
    } as CreateAdminFormValues,
    validators: {
      onChange: createAdminSchema,
    },
    onSubmit: async ({ value }) => {
      setErrorDetails(null);
      try {
        await createAdmin(value);
        onSuccess();
      } catch (error: unknown) {
        console.error("Failed to create admin:", error);
        setErrorDetails(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 p-1"
    >
      {errorDetails && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
          {errorDetails}
        </div>
      )}

      <div className="space-y-4">
        <form.Field name="name">
          {(field) => (
            <div>
              <Typography
                variant="body5"
                weight="semibold"
                className="mb-2 block text-muted-foreground uppercase tracking-wider"
              >
                Full Name
              </Typography>
              <Input
                type="text"
                placeholder="Enter full name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-12 bg-muted/20 transition-colors border-border/60 hover:border-border"
                error={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <Typography
                  variant="body5"
                  className="text-red-500 mt-1 ml-1 font-medium"
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </Typography>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="mobile">
          {(field) => (
            <div>
              <Typography
                variant="body5"
                weight="semibold"
                className="mb-2 block text-muted-foreground uppercase tracking-wider"
              >
                Mobile Number
              </Typography>
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-12 bg-muted/20 transition-colors border-border/60 hover:border-border"
                maxLength={10}
                error={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <Typography
                  variant="body5"
                  className="text-red-500 mt-1 ml-1 font-medium"
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </Typography>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div>
              <Typography
                variant="body5"
                weight="semibold"
                className="mb-2 block text-muted-foreground uppercase tracking-wider"
              >
                Email Address
              </Typography>
              <Input
                type="email"
                placeholder="Enter email address"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="h-12 bg-muted/20 transition-colors border-border/60 hover:border-border"
                error={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <Typography
                  variant="body5"
                  className="text-red-500 mt-1 ml-1 font-medium"
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </Typography>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="bg-card flex justify-end gap-3 pt-4">
        <Button
          type="button"
          color="primary"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting, canSubmit]) => (
            <Button
              type="submit"
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Create Admin"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};
