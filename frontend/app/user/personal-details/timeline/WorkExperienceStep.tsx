import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";

import {
  type PersonalDetailsForm,
  type WorkExperience,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface WorkExperienceStepProps {
  form: PersonalDetailsForm;
}

export function WorkExperienceStep({ form }: WorkExperienceStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h1"
        weight="bold"
        className="text-center mb-1 pb-1 text-gray-800"
      >
        5. Work Experience Details
      </Typography>
      <Typography
        variant="body2"
        className="text-center text-brand-success font-semibold mb-5 "
      >
        If you are fresher then no need to fill this form and click
        &quot;Next&quot; to continue
      </Typography>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                Name of Company
              </th>
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                Designation
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Joining Date
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Relieving Date
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Reason of Leaving
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] text-center">
                Last Salary Drawn
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <form.Subscribe selector={(state) => [state.values.workExp]}>
              {([workExp]) =>
                workExp.map((exp: WorkExperience, index: number) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-2 border-r border-border">
                      <form.Field name={`workExp[${index}].company`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter company name..."
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`workExp[${index}].designation`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter designation..."
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`workExp[${index}].joinDate`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input text-xs [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`workExp[${index}].relieveDate`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input text-xs [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`workExp[${index}].reason`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Reason for leaving..."
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2">
                      <form.Field name={`workExp[${index}].salary`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(
                                  e.target.value.replace(/\D/g, ""),
                                )
                              }
                              onBlur={field.handleBlur}
                              className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter last salary..."
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                  </tr>
                ))
              }
            </form.Subscribe>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
