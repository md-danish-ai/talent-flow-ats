import React from "react";
import type { DeepKeys } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Input } from "@components/ui-elements/Input";
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
    if (
      !apiOptions.some(
        (o: { id: string; label: string }) => o.id === "10th Std",
      )
    ) {
      apiOptions.unshift({ id: "10th Std", label: "10th / High School" });
    }
    if (
      !apiOptions.some(
        (o: { id: string; label: string }) => o.id === "12th Std",
      )
    ) {
      apiOptions.splice(1, 0, { id: "12th Std", label: "12th / Intermediate" });
    }
    return apiOptions;
  }, [educationRes]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 pt-2"
    >
      <div className="flex flex-col gap-5">
        <form.Subscribe selector={(state) => [state.values.education]}>
          {([education]) =>
            education.map((item: Education, index: number) => {
              const isMandatory = index < 2;
              const isEducationSelected = Boolean(
                item.type &&
                (isLoadingEducation ||
                  educationOptions.some(
                    (opt: { id: string | number }) =>
                      String(opt.id) === String(item.type),
                  )),
              );
              const prevEndYear =
                index > 0 ? education[index - 1]?.endYear : undefined;
              const selectedLabel = educationOptions.find(
                (opt: { id: string | number; label: string }) =>
                  String(opt.id) === String(item.type),
              )?.label;
              const headerTitle = selectedLabel
                ? `Education - ${selectedLabel}`
                : `Education ${index + 1}`;
              return (
                <div
                  key={item.id}
                  className="p-5 border border-border rounded-xl bg-card shadow-sm relative group transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                    <h4 className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
                      {headerTitle}{" "}
                      {isMandatory && <span className="text-red-500">*</span>}
                    </h4>
                    <Tooltip
                      content={isMandatory ? "Required Row" : "Delete Row"}
                      side="top"
                    >
                      <button
                        type="button"
                        disabled={isMandatory}
                        onClick={() => {
                          form.removeFieldValue("education", index);
                        }}
                        className="p-2 hover:bg-red-50 rounded-full text-muted-foreground hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {/* Education Type */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Education
                      </label>
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
                                    "medium",
                                  ];
                                  fieldsToTouch.forEach((f) => {
                                    form.setFieldMeta(
                                      `education[${index}].${f}` as DeepKeys<PersonalDetailsFormValues>,
                                      (meta) => ({ ...meta, isTouched: true }),
                                    );
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
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Education Details */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Education Details
                      </label>
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
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>

                    {/* School/College */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        School/College
                      </label>
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
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>

                    {/* Board/University */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Board/University
                      </label>
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
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>

                    {/* Start Year */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Start Year
                      </label>
                      <form.Field name={`education[${index}].startYear`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <YearPicker
                              value={field.state.value}
                              onChange={(val) => field.handleChange(val)}
                              placeholder="Start"
                              disabled={!isEducationSelected}
                              minYear={prevEndYear}
                              className="w-full"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 w-full mt-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* End Year */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        End Year
                      </label>
                      <form.Field name={`education[${index}].endYear`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <YearPicker
                              value={field.state.value}
                              onChange={(val) => field.handleChange(val)}
                              placeholder="End"
                              disabled={!isEducationSelected}
                              minYear={
                                item.startYear
                                  ? parseInt(item.startYear, 10) + 1
                                  : undefined
                              }
                              className="w-full"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 w-full mt-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Division */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Division
                      </label>
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
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>

                    {/* Percentage */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Percentage (%)
                      </label>
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
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>

                    {/* Medium */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Medium
                      </label>
                      <form.Field name={`education[${index}].medium`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-left">
                            <SelectDropdown
                              options={languageOptions}
                              value={field.state.value}
                              onChange={(val) =>
                                field.handleChange(val as string)
                              }
                              placeholder="Select Medium"
                              isLoading={isLoadingLanguage}
                              disabled={!isEducationSelected}
                              className="w-full"
                              wrapperClassName="w-full"
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 w-full mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </form.Subscribe>
        <button
          type="button"
          onClick={() => {
            const education = form.getFieldValue("education") || [];
            const nextId =
              education.length > 0
                ? Math.max(...education.map((e) => Number(e.id) || 0)) + 1
                : 1;
            form.pushFieldValue("education", {
              id: nextId,
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
          className="flex items-center gap-1.5 px-4 py-2 mt-2 w-fit text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add More Education
        </button>
      </div>
    </motion.div>
  );
}
