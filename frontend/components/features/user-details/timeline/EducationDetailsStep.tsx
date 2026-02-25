import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";

import {
  type PersonalDetailsForm,
  type Education,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface EducationDetailsStepProps {
  form: PersonalDetailsForm;
}

export function EducationDetailsStep({ form }: EducationDetailsStepProps) {
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
        4. Education Details
      </Typography>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Education Details
              </th>
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                School/College
              </th>
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                Board/University
              </th>
              <th className="p-3 font-semibold text-sm w-[10%] border-r border-[#ffffff40]">
                Year of Passing
              </th>
              <th className="p-3 font-semibold text-sm w-[10%] border-r border-[#ffffff40]">
                Division
              </th>
              <th className="p-3 font-semibold text-sm w-[10%] border-r border-[#ffffff40]">
                %
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] text-center">
                Medium
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <form.Subscribe selector={(state) => [state.values.education]}>
              {([education]) =>
                education.map((item: Education, index: number) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 border-r border-border">
                      <span className="text-sm font-medium">
                        {item.type}
                        {(item.type === "10th Std" ||
                          item.type === "12th Std") && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </span>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`education[${index}].school`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter school/college..."
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
                      <form.Field name={`education[${index}].board`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter board/university..."
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
                      <form.Field name={`education[${index}].year`}>
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
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="YYYY"
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
                      <form.Field name={`education[${index}].division`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="e.g. 1st, 2nd"
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
                      <form.Field name={`education[${index}].percentage`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="e.g. 85%"
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
                    <td className="p-3 text-center">
                      <div className="flex justify-center flex-col xl:flex-row gap-2">
                        <form.Field name={`education[${index}].medium`}>
                          {(field) => (
                            <>
                              <Radio
                                label="English"
                                checked={field.state.value === "English"}
                                onChange={() => field.handleChange("English")}
                              />
                              <Radio
                                label="Hindi"
                                checked={field.state.value === "Hindi"}
                                onChange={() => field.handleChange("Hindi")}
                              />
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-red-500 w-full mt-1">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </>
                          )}
                        </form.Field>
                      </div>
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
