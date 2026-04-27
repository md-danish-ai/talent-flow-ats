"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Textarea } from "@components/ui-elements/Textarea";
import { Button } from "@components/ui-elements/Button";
import { ShieldCheck, CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  evaluationSchema,
  type EvaluationFormValues,
} from "@lib/validations/evaluation";
import { getErrorMessage } from "@lib/utils";
import { Classification } from "@types";

interface EvaluationFormProps {
  initialValues: EvaluationFormValues;
  verdicts: Classification[];
  isCompleted: boolean;
  submitting: boolean;
  onSubmit: (values: EvaluationFormValues) => void;
  onCancel: () => void;
}

const METRICS = [
  "Communication",
  "Domain Knowledge",
  "Critical Thinking",
  "Professionalism",
  "Cultural Fit",
  "Learning Ability",
] as const;

const RATINGS = [
  { id: "Excellent", label: "Excellent" },
  { id: "Good", label: "Good" },
  { id: "Average", label: "Average" },
  { id: "Poor", label: "Poor" },
];

export function EvaluationForm({
  initialValues,
  verdicts,
  isCompleted,
  submitting,
  onSubmit,
  onCancel,
}: EvaluationFormProps) {
  const form = useForm({
    // @ts-expect-error - validatorAdapter types mismatch in this version
    validatorAdapter: zodValidator(),
    defaultValues: initialValues,
    validators: {
      onChange: evaluationSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {METRICS.map((metric) => (
          <form.Field key={metric} name={`evaluation_data.${metric}`}>
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]"
                >
                  {metric}
                </Typography>
                <SelectDropdown
                  options={RATINGS}
                  placeholder={`Rate ${metric}`}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val as string)}
                  disabled={isCompleted}
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="text-red-500 font-medium mt-0.5"
                    >
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  )}
              </div>
            )}
          </form.Field>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <form.Field name="overall_grade">
          {(field) => (
            <div className="space-y-1.5">
              <Typography
                variant="body5"
                className="font-bold uppercase tracking-wider text-brand-primary text-[10px]"
              >
                Overall Grade
              </Typography>
              <SelectDropdown
                options={RATINGS}
                placeholder="Select Grade"
                value={field.state.value}
                onChange={(val) => field.handleChange(val as string)}
                className="border-brand-primary/30"
                disabled={isCompleted}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography
                    variant="body5"
                    className="text-red-500 font-medium mt-0.5"
                  >
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>

        <form.Field name="final_verdict_id">
          {(field) => (
            <div className="space-y-1.5">
              <Typography
                variant="body5"
                className="font-bold uppercase tracking-wider text-emerald-600 text-[10px]"
              >
                Final Verdict
              </Typography>
              <SelectDropdown
                options={verdicts.map((v) => ({ id: v.id, label: v.name }))}
                placeholder="Select Verdict"
                value={field.state.value}
                onChange={(val) => field.handleChange(Number(val))}
                className="border-emerald-500/30"
                disabled={isCompleted}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Typography
                    variant="body5"
                    className="text-red-500 font-medium mt-0.5"
                  >
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="comments">
        {(field) => (
          <div className="space-y-1.5">
            <Typography
              variant="body5"
              className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]"
            >
              Comments & Feedback
            </Typography>
            <Textarea
              placeholder="Detailed feedback..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="min-h-[100px] resize-none p-3 text-sm"
              disabled={isCompleted}
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <Typography
                  variant="body5"
                  className="text-red-500 font-medium mt-0.5"
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </Typography>
              )}
          </div>
        )}
      </form.Field>

      {isCompleted ? (
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
          <CheckCircle className="text-emerald-500 shrink-0" size={20} />
          <Typography
            variant="body5"
            className="font-bold text-emerald-600 uppercase"
          >
            Evaluation Submitted & Locked
          </Typography>
        </div>
      ) : (
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={submitting}
            startIcon={
              submitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ShieldCheck size={18} />
              )
            }
            className="px-8"
          >
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </Button>
        </div>
      )}
    </form>
  );
}
