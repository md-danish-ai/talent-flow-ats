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
      return { id: c.name, label: c.name };
    });

    // Ensure 10th / High School, 12th / Intermediate, and Graduation exist even before loading finishes
    if (
      !apiOptions.some(
        (o: { id: string; label: string }) =>
          o.id === "10th / High School" || o.id === "10th Std",
      )
    ) {
      apiOptions.unshift({
        id: "10th / High School",
        label: "10th / High School",
      });
    }
    if (
      !apiOptions.some(
        (o: { id: string; label: string }) =>
          o.id === "12th / Intermediate" || o.id === "12th Std",
      )
    ) {
      apiOptions.splice(1, 0, {
        id: "12th / Intermediate",
        label: "12th / Intermediate",
      });
    }
    if (
      !apiOptions.some(
        (o: { id: string; label: string }) => o.id === "Graduation",
      )
    ) {
      apiOptions.splice(2, 0, { id: "Graduation", label: "Graduation" });
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
          {([education]) => {
            const lastEligibleIndex = education.reduce(
              (lastIdx: number, item: Education, idx: number) => {
                const isSchool =
                  item.type === "10th / High School" ||
                  item.type === "10th Std" ||
                  item.type === "12th / Intermediate" ||
                  item.type === "12th Std";
                return !isSchool ? idx : lastIdx;
              },
              -1,
            );

            return (
              <React.Fragment>
                {education.map((item: Education, index: number) => {
                  const isMandatory = index < 3;
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
                  const isSchool =
                    item.type === "10th / High School" ||
                    item.type === "10th Std" ||
                    item.type === "12th / Intermediate" ||
                    item.type === "12th Std";
                  const isLastEligible =
                    !isSchool && index === lastEligibleIndex;
                  const isPursuing = isLastEligible && Boolean(item.isPursuing);

                  const currentYear = new Date().getFullYear();
                  const endYrNum = parseInt(item.endYear || "", 10);
                  const isFutureEndYear =
                    !isNaN(endYrNum) && endYrNum > currentYear;
                  const isPercentageRequired =
                    !isPursuing &&
                    (isMandatory || isEducationSelected) &&
                    (isSchool || !isFutureEndYear);

                  return (
                    <div
                      key={item.id ? `edu-${item.id}-${index}` : `edu-${index}`}
                      className="p-5 border border-border rounded-xl bg-card shadow-sm relative group transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                        <h4 className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
                          {headerTitle}{" "}
                          {isMandatory && (
                            <span className="text-red-500">*</span>
                          )}
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
                            Education <span className="text-red-500">*</span>
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
                                          (meta) => ({
                                            ...meta,
                                            isTouched: true,
                                          }),
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
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Education Details */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            Education Details{" "}
                            {(isMandatory || isEducationSelected) && (
                              <span className="text-red-500">*</span>
                            )}
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
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* School/College */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            School/College{" "}
                            {(isMandatory || isEducationSelected) && (
                              <span className="text-red-500">*</span>
                            )}
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
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Board/University */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            Board/University{" "}
                            {(isMandatory || isEducationSelected) && (
                              <span className="text-red-500">*</span>
                            )}
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
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Start Year */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            Start Year{" "}
                            {(isMandatory || isEducationSelected) && (
                              <span className="text-red-500">*</span>
                            )}
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
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* End Year */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            End Year{" "}
                            {!isPursuing &&
                              (isMandatory || isEducationSelected) && (
                                <span className="text-red-500">*</span>
                              )}
                          </label>
                          <form.Field name={`education[${index}].endYear`}>
                            {(field) => (
                              <div className="flex flex-col relative w-full text-center">
                                <YearPicker
                                  value={isPursuing ? "" : field.state.value}
                                  onChange={(val) => field.handleChange(val)}
                                  placeholder={isPursuing ? "Pursuing" : "End"}
                                  disabled={isPursuing || !isEducationSelected}
                                  disableFuture={true}
                                  minYear={
                                    item.startYear
                                      ? parseInt(item.startYear, 10) + 1
                                      : undefined
                                  }
                                  className="w-full"
                                  error={
                                    !isPursuing &&
                                    field.state.meta.isTouched &&
                                    field.state.meta.errors.length > 0
                                  }
                                />
                                {!isPursuing &&
                                  field.state.meta.isTouched &&
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
                          {isLastEligible && (
                            <form.Field name={`education[${index}].isPursuing`}>
                              {(field) => (
                                <label className="flex items-center gap-2 mt-1 cursor-pointer text-xs font-medium text-foreground select-none">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(field.state.value)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      field.handleChange(checked);
                                      if (checked) {
                                        form.setFieldValue(
                                          `education[${index}].endYear`,
                                          "",
                                        );
                                        form.setFieldValue(
                                          `education[${index}].percentage`,
                                          "",
                                        );
                                      }
                                    }}
                                    className="h-3.5 w-3.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                                  />
                                  <span>Pursuing (Currently Studying)</span>
                                </label>
                              )}
                            </form.Field>
                          )}
                        </div>

                        {/* Percentage (%) / CGPA */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-muted-foreground">
                              {item.gradingType || "Percentage"}{" "}
                              {item.gradingType === "CGPA"
                                ? "(Out of 10)"
                                : "(%)"}{" "}
                              {isPercentageRequired ? (
                                <span className="text-red-500">*</span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  (Optional)
                                </span>
                              )}
                            </label>
                            <form.Field
                              name={`education[${index}].gradingType`}
                            >
                              {(typeField) => (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextType =
                                      typeField.state.value === "CGPA"
                                        ? "Percentage"
                                        : "CGPA";
                                    typeField.handleChange(nextType);
                                  }}
                                  className="text-xs font-semibold text-brand-primary underline hover:text-brand-primary/80 transition-colors cursor-pointer"
                                >
                                  Switch to{" "}
                                  {typeField.state.value === "CGPA"
                                    ? "Percentage"
                                    : "CGPA"}
                                </button>
                              )}
                            </form.Field>
                          </div>
                          <form.Field name={`education[${index}].percentage`}>
                            {(field) => (
                              <div className="flex flex-col">
                                <Input
                                  value={isPursuing ? "" : field.state.value}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(
                                      /[^0-9.]/g,
                                      "",
                                    );
                                    const parts = val.split(".");
                                    if (parts.length > 2) {
                                      val =
                                        parts[0] +
                                        "." +
                                        parts.slice(1).join("");
                                    }
                                    field.handleChange(val);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={isPursuing || !isEducationSelected}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                                  placeholder={
                                    isPursuing
                                      ? "N/A (Pursuing)"
                                      : item.gradingType === "CGPA"
                                        ? "e.g. 8.5"
                                        : "e.g. 85"
                                  }
                                  error={
                                    !isPursuing &&
                                    field.state.meta.isTouched &&
                                    field.state.meta.errors.length > 0
                                  }
                                />
                                {!isPursuing &&
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0 && (
                                    <p className="text-[10px] text-red-500 mt-1 pl-1">
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Medium */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            Medium{" "}
                            {(isMandatory || isEducationSelected) && (
                              <span className="text-red-500">*</span>
                            )}
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
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          }}
        </form.Subscribe>
        <button
          type="button"
          onClick={() => {
            const education = form.getFieldValue("education") || [];
            const nextId =
              education.length > 0
                ? Math.max(...education.map((e) => Number(e.id) || 0)) + 1
                : 1;
            const updatedEducation = education.map((e) => ({
              ...e,
              isPursuing: false,
            }));
            form.setFieldValue("education", updatedEducation);
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
              gradingType: "Percentage",
              isPursuing: false,
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
