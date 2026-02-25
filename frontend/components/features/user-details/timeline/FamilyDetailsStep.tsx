import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";

import {
  type PersonalDetailsForm,
  type FamilyMember,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface FamilyDetailsStepProps {
  form: PersonalDetailsForm;
}

export function FamilyDetailsStep({ form }: FamilyDetailsStepProps) {
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
        2. Family Details
      </Typography>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[25%] border-r border-[#ffffff40]">
                Relation
              </th>
              <th className="p-3 font-semibold text-sm w-[35%] border-r border-[#ffffff40]">
                Name
              </th>
              <th className="p-3 font-semibold text-sm w-[25%] border-r border-[#ffffff40]">
                Occupation
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] text-center">
                Dependent Y/N
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <form.Subscribe selector={(state) => [state.values.family]}>
              {([family]) =>
                family.map((member: FamilyMember, index: number) => (
                  <tr
                    key={member.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 border-r border-border">
                      {member.relationLabel === "Brother/Sister" ? (
                        <div className="flex gap-4">
                          <form.Field name={`family[${index}].relation`}>
                            {(field) => (
                              <>
                                <Radio
                                  label="Brother"
                                  checked={field.state.value === "Brother"}
                                  onChange={() => field.handleChange("Brother")}
                                />
                                <Radio
                                  label="Sister"
                                  checked={field.state.value === "Sister"}
                                  onChange={() => field.handleChange("Sister")}
                                />
                                {field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0 && (
                                    <p className="text-[10px] text-red-500 mt-1">
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </>
                            )}
                          </form.Field>
                        </div>
                      ) : (
                        <span className="text-sm font-medium">
                          {member.relationLabel}
                          {(member.relationLabel === "Father" ||
                            member.relationLabel === "Mother") && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`family[${index}].name`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter name..."
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
                      <form.Field name={`family[${index}].occupation`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                              placeholder="Enter occupation..."
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
                      <div className="flex justify-center gap-4">
                        <form.Field name={`family[${index}].dependent`}>
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
                                  <p className="text-[10px] text-red-500 mt-1">
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
