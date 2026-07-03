import React from "react";
import type { DeepKeys } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Trash2, Plus } from "lucide-react";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { YearPicker } from "@components/ui-elements/YearPicker";
import { useClassifications } from "@hooks/api/classifications/use-classifications";

import {
  type PersonalDetailsForm,
  type PersonalDetailsFormValues,
  type Education,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface EducationDetailsStepProps {
  form: PersonalDetailsForm;
}

export function EducationDetailsStep({ form }: EducationDetailsStepProps) {
  const { data: educationRes, isLoading: isLoadingEducation } =
    useClassifications({
      type: "education_category",
      is_active: true,
    });
    
  const { data: languageRes, isLoading: isLoadingLanguage } =
    useClassifications({
      type: "language",
      is_active: true,
    });
  
  const languageOptions = React.useMemo(() => {
    return (languageRes?.data || []).map((c: { name: string }) => ({
      id: c.name,
      label: c.name,
    }));
  }, [languageRes]);

  const educationOptions = React.useMemo(() => {
    const apiOptions = (educationRes?.data || []).map((c: { name: string }) => {
      let id = c.name;
      let label = c.name;
      
      // Map backend values to our internal constants to avoid duplicates
      if (c.name === "10th / High School" || c.name === "10th Std") {
        id = "10th Std";
        label = "10th / High School";
      } else if (c.name === "12th / Intermediate" || c.name === "12th Std") {
        id = "12th Std";
        label = "12th / Intermediate";
      }
      
      return { id, label };
    });
    
    // Ensure 10th and 12th Std exist even before loading finishes
    if (!apiOptions.some((o: { id: string; label: string }) => o.id === "10th Std")) {
      apiOptions.unshift({ id: "10th Std", label: "10th / High School" });
    }
    if (!apiOptions.some((o: { id: string; label: string }) => o.id === "12th Std")) {
      apiOptions.splice(1, 0, { id: "12th Std", label: "12th / Intermediate" });
    }
    return apiOptions;
  }, [educationRes]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="relative flex items-center justify-center mb-6">
        <Typography
          variant="h1"
          weight="bold"
        >
          4. Education Details
        </Typography>
        <button
          type="button"
          onClick={() => {
            form.pushFieldValue("education", {
              id: Date.now(),
              type: "",
              school: "",
              board: "",
              startYear: "",
              endYear: "",
              division: "",
              percentage: "",
              medium: "",
              details: "",
            });
          }}
          className="absolute right-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add More
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-left border-r border-white/20 min-w-[160px]">
                Education
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-left border-r border-white/20 min-w-[180px]">
                Education Details
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-left border-r border-white/20 min-w-[180px]">
                School/College
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-left border-r border-white/20 min-w-[200px]">
                Board/University
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-center border-r border-white/20 w-32">
                Start Year
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-center border-r border-white/20 w-32">
                End Year
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-center border-r border-white/20 min-w-[100px]">
                Div
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-center border-r border-[#ffffff40] min-w-[80px]">
                %
              </th>
              <th className="p-3 text-sm font-semibold uppercase tracking-wider text-center border-r border-[#ffffff40] min-w-[140px]">
                Medium
              </th>
              <th className="p-3 font-semibold text-sm w-[6%] text-center min-w-[70px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <form.Subscribe selector={(state) => [state.values.education]}>
              {([education]) =>
                education.map((item: Education, index: number) => {
                  const isMandatory = index < 2;
                  const isEducationSelected = Boolean(
                    item.type &&
                      (isLoadingEducation ||
                        educationOptions.some(
                          (opt: { id: string | number }) => String(opt.id) === String(item.type)
                        ))
                  );
                  const prevEndYear = index > 0 ? education[index - 1]?.endYear : undefined;
                  return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 border-r border-border">
                      <form.Field name={`education[${index}].type`}>
                        {(field) => (
                          <div className="flex flex-col relative">
                            <SelectDropdown
                              options={educationOptions}
                              value={field.state.value}
                              onChange={(val) => {
                                field.handleChange(val as string);
                                if (val) {
                                  const fieldsToTouch = [
                                    "details",
                                    "school",
                                    "board",
                                    "startYear",
                                    "endYear",
                                    "division",
                                    "percentage",
                                    "medium"
                                  ];
                                  fieldsToTouch.forEach((f) => {
                                    form.setFieldMeta(`education[${index}].${f}` as DeepKeys<PersonalDetailsFormValues>, (meta) => ({
                                      ...meta,
                                      isTouched: true,
                                    }));
                                  });
                                }
                              }}
                              placeholder="Select Education"
                              isLoading={isLoadingEducation}
                              disabled={isMandatory}
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {isMandatory && (
                              <span className="text-red-500 absolute -top-1 -right-1 text-xs">*</span>
                            )}
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
                      <form.Field name={`education[${index}].details`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              disabled={!isEducationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="e.g. Science, Arts, B.Tech..."
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
                      <form.Field name={`education[${index}].school`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              disabled={!isEducationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={!isEducationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <form.Field name={`education[${index}].startYear`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <YearPicker
                              value={field.state.value}
                              onChange={(val) => field.handleChange(val)}
                              placeholder="Start"
                              disabled={!isEducationSelected}
                              minYear={prevEndYear}
                              className="h-10 py-2"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 w-full mt-1">
                                  {getErrorMessage(
                                    field.state.meta.errors[0],
                                  )}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`education[${index}].endYear`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <YearPicker
                              value={field.state.value}
                              onChange={(val) => field.handleChange(val)}
                              placeholder="End"
                              disabled={!isEducationSelected}
                              minYear={item.startYear ? parseInt(item.startYear, 10) + 1 : undefined}
                              className="h-10 py-2"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 w-full mt-1">
                                  {getErrorMessage(
                                    field.state.meta.errors[0],
                                  )}
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
                              disabled={!isEducationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={!isEducationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <td className="p-2 border-r border-border">
                      <form.Field name={`education[${index}].medium`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-left min-w-[120px]">
                            <SelectDropdown
                              options={languageOptions}
                              value={field.state.value}
                              onChange={(val) => field.handleChange(val as string)}
                              placeholder="Select Medium"
                              isLoading={isLoadingLanguage}
                              disabled={!isEducationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input py-2"
                              wrapperClassName="w-full"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 w-full mt-1 pl-1">
                                  {getErrorMessage(
                                    field.state.meta.errors[0],
                                  )}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 text-center">
                      <Tooltip
                        content={
                          isMandatory ? "Required Row" : "Delete Row"
                        }
                        side="top"
                      >
                        <button
                          type="button"
                          disabled={isMandatory}
                          onClick={() => {
                            form.removeFieldValue("education", index);
                          }}
                          className="p-2 hover:bg-red-50 rounded-full text-muted-foreground hover:text-red-500 transition-all group inline-flex items-center justify-center mx-auto disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                          aria-label="Delete row"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </form.Subscribe>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
