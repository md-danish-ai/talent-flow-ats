import React from "react";
import { motion } from "framer-motion";
import { Radio } from "@components/ui-elements/Radio";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Input } from "@components/ui-elements/Input";

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
      className="space-y-5 pt-2"
    >
      <div className="space-y-5">
        <div className="rounded-2xl p-6 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            Have You Ever Been Interviewed By Arcgate In Past?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="interviewedBefore">
              {(field) => (
                <>
                  <Radio
                    label="Yes"
                    checked={Boolean(field.state.value)}
                    onChange={() => field.handleChange(true)}
                  />
                  <Radio
                    label="No"
                    checked={!field.state.value}
                    onChange={() => field.handleChange(false)}
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

        <div className="rounded-2xl p-6 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            Have You Worked In Arcgate Before?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <form.Field name="workedBefore">
              {(field) => (
                <>
                  <Radio
                    label="Yes"
                    checked={Boolean(field.state.value)}
                    onChange={() => field.handleChange(true)}
                  />
                  <Radio
                    label="No"
                    checked={!field.state.value}
                    onChange={() => field.handleChange(false)}
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

        <div className="rounded-2xl p-6 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            What is the source of information for showing interest in ARCGATE?
            Please tick the appropriate from the given list.{" "}
            <span className="text-red-500">*</span>
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
            <form.Field name="source.others">
              {(field) => (
                <div className="space-y-2">
                  <Checkbox
                    label="Others"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  {field.state.value && (
                    <form.Field name="source.otherDetails">
                      {(otherField) => (
                        <div className="ml-6 mt-2 max-w-md">
                          <Input
                            value={otherField.state.value || ""}
                            onChange={(e) =>
                              otherField.handleChange(e.target.value)
                            }
                            onBlur={otherField.handleBlur}
                            placeholder="Please specify source..."
                            error={
                              otherField.state.meta.isTouched &&
                              otherField.state.meta.errors.length > 0
                            }
                          />
                          {otherField.state.meta.isTouched &&
                            otherField.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 mt-1 pl-1">
                                {getErrorMessage(
                                  otherField.state.meta.errors[0],
                                )}
                              </p>
                            )}
                        </div>
                      )}
                    </form.Field>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="source">
              {(field) =>
                field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 ? (
                  <p className="text-xs text-red-500 mt-1">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                ) : null
              }
            </form.Field>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
