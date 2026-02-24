"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { DatePicker } from "@components/ui-elements/DatePicker";

import { type PersonalDetailsForm } from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface OtherDetailsStepProps {
  form: PersonalDetailsForm;
}

export function OtherDetailsStep({ form }: OtherDetailsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h1"
        weight="bold"
        className="text-center mb-6 text-gray-800"
      >
        6. Other Details
      </Typography>
      <div className="mt-2 max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            Are you willing for 1 Year Service Commitment?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="serviceCommitment">
              {(field) => (
                <>
                  <Radio
                    label="Yes"
                    checked={field.state.value === "Yes"}
                    onChange={() => field.handleChange("Yes")}
                  />
                  <Radio
                    label="No"
                    checked={field.state.value === "No"}
                    onChange={() => field.handleChange("No")}
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 ml-2 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </>
              )}
            </form.Field>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            Do you agree for 1 month salary as security deposit?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="securityDeposit">
              {(field) => (
                <>
                  <Radio
                    label="Yes"
                    checked={field.state.value === "Yes"}
                    onChange={() => field.handleChange("Yes")}
                  />
                  <Radio
                    label="No"
                    checked={field.state.value === "No"}
                    onChange={() => field.handleChange("No")}
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 ml-2 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </>
              )}
            </form.Field>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            What is your preferred shift time for work at Arcgate?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="shiftTime">
              {(field) => (
                <>
                  <Radio
                    label="Day"
                    checked={field.state.value === "Day"}
                    onChange={() => field.handleChange("Day")}
                  />
                  <Radio
                    label="Night"
                    checked={field.state.value === "Night"}
                    onChange={() => field.handleChange("Night")}
                  />
                  <Radio
                    label="Any"
                    checked={field.state.value === "Any"}
                    onChange={() => field.handleChange("Any")}
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 ml-2 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </>
              )}
            </form.Field>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
            <div>
              <form.Field name="expectedJoiningDate">
                {(field) => (
                  <>
                    <DatePicker
                      label={
                        <span>
                          On selection, please mention the expected joining
                          date. <span className="text-red-500">*</span>
                        </span>
                      }
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0
                      }
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          {getErrorMessage(field.state.meta.errors[0])}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                Expected Salary <span className="text-red-500">*</span>
              </label>
              <form.Field name="expectedSalary">
                {(field) => (
                  <>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter expected salary..."
                      error={
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0
                      }
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          {getErrorMessage(field.state.meta.errors[0])}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
