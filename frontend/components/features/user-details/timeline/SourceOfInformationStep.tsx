import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Radio } from "@components/ui-elements/Radio";
import { Checkbox } from "@components/ui-elements/Checkbox";

import { type PersonalDetailsForm } from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface SourceOfInformationProps {
  form: PersonalDetailsForm;
}

export function SourceOfInformationStep({ form }: SourceOfInformationProps) {
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
        3. Source of Information
      </Typography>
      <div className="space-y-4 mt-2 max-w-2xl mx-auto">
        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            Have you ever been interviewed in Arcgate?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="interviewedBefore">
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
          <label className="text-sm font-semibold block mb-4">
            Have you Worked in Arcgate before?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="workedBefore">
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
          <label className="text-sm font-semibold block mb-4">
            What is the source of information for showing interest in ARCGATE?
            Please tick the appropriate from the given list.
          </label>
          <div className="flex flex-col gap-3 ml-2">
            <form.Field name="source.campus">
              {(field) => (
                <Checkbox
                  label="Arcgate Campus Drive"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            </form.Field>
            <form.Field name="source.website">
              {(field) => (
                <Checkbox
                  label="Arcgate Website"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            </form.Field>
            <form.Field name="source.employee">
              {(field) => (
                <Checkbox
                  label="Arcgate Employee"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            </form.Field>
            <form.Field name="source.friends">
              {(field) => (
                <Checkbox
                  label="Friends"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            </form.Field>
            <form.Field name="source.newspaper">
              {(field) => (
                <Checkbox
                  label="Newspaper"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            </form.Field>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
