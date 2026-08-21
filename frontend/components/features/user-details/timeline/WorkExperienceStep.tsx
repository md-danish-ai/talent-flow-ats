import React from "react";
import { motion } from "framer-motion";
import { Input } from "@components/ui-elements/Input";
import { DatePicker } from "@components/ui-elements/DatePicker";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Trash2, Plus } from "lucide-react";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Radio } from "@components/ui-elements/Radio";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import {
  type PersonalDetailsForm,
  type WorkExperience,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface WorkExperienceStepProps {
  form: PersonalDetailsForm;
}

export function WorkExperienceStep({ form }: WorkExperienceStepProps) {
  const { data: employmentRes, isLoading: isLoadingEmploymentType } =
    useClassifications({
      type: "employment_type",
      is_active: true,
    });

  const employmentTypeOptions = React.useMemo(() => {
    return (employmentRes?.data || []).map(
      (c: { name: string; code: string }) => ({
        id: c.code,
        label: c.name,
      }),
    );
  }, [employmentRes]);

  const handleExperienceTypeChange = (fresher: boolean) => {
    if (fresher) {
      form.setFieldValue("workExp", [
        {
          id: 1,
          company: "Fresher",
          employmentType: "",
          designation: "",
          joinDate: "",
          relieveDate: "",
          reason: "",
          salary: "",
          isPresent: false,
        },
      ]);
    } else {
      const currentExp = form.getFieldValue("workExp") || [];
      if (
        currentExp.length === 0 ||
        (currentExp.length === 1 &&
          (currentExp[0]?.company || "").trim().toLowerCase() === "fresher")
      ) {
        form.setFieldValue("workExp", [
          {
            id: 1,
            company: "",
            employmentType: "",
            designation: "",
            joinDate: "",
            relieveDate: "",
            reason: "",
            salary: "",
            isPresent: false,
          },
        ]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 pt-2"
    >
      <form.Subscribe selector={(state) => [state.values.workExp]}>
        {([workExp]) => {
          const isFresher =
            !workExp ||
            workExp.length === 0 ||
            (workExp.length === 1 &&
              (workExp[0]?.company || "").trim().toLowerCase() === "fresher");

          return (
            <React.Fragment>
              {/* Experience Type Selector (Fresher vs Experienced) */}
              <div className="p-5 border border-border rounded-xl bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    Work Experience Status{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select &quot;Fresher&quot; if you have no prior work
                    experience, or &quot;Experienced&quot; to add company
                    details.
                  </p>
                </div>
                <div className="flex gap-6 items-center">
                  <Radio
                    label="Fresher"
                    name="experienceStatus"
                    checked={isFresher}
                    onChange={() => handleExperienceTypeChange(true)}
                  />
                  <Radio
                    label="Experienced"
                    name="experienceStatus"
                    checked={!isFresher}
                    onChange={() => handleExperienceTypeChange(false)}
                  />
                </div>
              </div>

              {isFresher ? (
                <div className="p-5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm text-center font-medium">
                  You have selected <strong>Fresher</strong>. No work experience
                  details are required. Click <strong>&quot;Next&quot;</strong>{" "}
                  to continue.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <React.Fragment>
                    {workExp.map((exp: WorkExperience, index: number) => {
                      const isLastCompany = index === workExp.length - 1;
                      const isCurrentlyWorking =
                        isLastCompany && Boolean(exp.isPresent);
                      const headerTitle = exp.company
                        ? `Company - ${exp.company}`
                        : `Company ${index + 1}`;
                      let prevRelieveDate: string | undefined = undefined;
                      if (exp.employmentType !== "PART_TIME") {
                        for (let i = index - 1; i >= 0; i--) {
                          if (
                            workExp[i].employmentType !== "PART_TIME" &&
                            workExp[i].relieveDate
                          ) {
                            prevRelieveDate = workExp[i].relieveDate;
                            break;
                          }
                        }
                      }

                      return (
                        <div
                          key={
                            exp.id ? `work-${exp.id}-${index}` : `work-${index}`
                          }
                          className="p-5 border border-border rounded-xl bg-card shadow-sm relative group transition-all hover:shadow-md"
                        >
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                            <h4 className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
                              {headerTitle}
                            </h4>
                            <Tooltip content="Delete Row" side="top">
                              <button
                                type="button"
                                disabled={workExp.length <= 1}
                                onClick={() => {
                                  form.removeFieldValue("workExp", index);
                                }}
                                className="p-2 hover:bg-red-50 rounded-full text-muted-foreground hover:text-red-500 transition-all group inline-flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                                aria-label="Delete row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Name of Company */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Name of Company{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <form.Field name={`workExp[${index}].company`}>
                                {(field) => (
                                  <div className="flex flex-col">
                                    <Input
                                      value={field.state.value}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      onBlur={field.handleBlur}
                                      className=""
                                      placeholder="Enter company name..."
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

                            {/* Employment Type */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Employment Type{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <form.Field
                                name={`workExp[${index}].employmentType`}
                              >
                                {(field) => (
                                  <div className="flex flex-col relative w-full text-center">
                                    <SelectDropdown
                                      options={employmentTypeOptions}
                                      value={field.state.value}
                                      onChange={(val) =>
                                        field.handleChange(val as string)
                                      }
                                      placeholder="Select Employment Type"
                                      disabled={isLoadingEmploymentType}
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

                            {/* Designation */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Designation{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <form.Field
                                name={`workExp[${index}].designation`}
                              >
                                {(field) => (
                                  <div className="flex flex-col">
                                    <Input
                                      value={field.state.value}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      onBlur={field.handleBlur}
                                      className=""
                                      placeholder="Enter designation..."
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

                            {/* Joining Date */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Joining Date{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <form.Field name={`workExp[${index}].joinDate`}>
                                {(field) => (
                                  <div className="flex flex-col relative w-full text-center">
                                    <DatePicker
                                      value={field.state.value}
                                      onChange={(date) =>
                                        field.handleChange(date)
                                      }
                                      onBlur={field.handleBlur}
                                      className="w-full text-sm"
                                      placeholder="Select Date"
                                      disableFuture
                                      minDate={prevRelieveDate}
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

                            {/* Relieving Date */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Relieving Date{" "}
                                {!isCurrentlyWorking && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>
                              <form.Field
                                name={`workExp[${index}].relieveDate`}
                              >
                                {(field) => (
                                  <div className="flex flex-col relative w-full text-center">
                                    <DatePicker
                                      value={
                                        isCurrentlyWorking
                                          ? ""
                                          : field.state.value
                                      }
                                      onChange={(date) =>
                                        field.handleChange(date)
                                      }
                                      onBlur={field.handleBlur}
                                      className="w-full text-sm"
                                      placeholder={
                                        isCurrentlyWorking
                                          ? "Present"
                                          : "Select Date"
                                      }
                                      disabled={isCurrentlyWorking}
                                      disableFuture
                                      minDate={exp.joinDate}
                                      error={
                                        !isCurrentlyWorking &&
                                        field.state.meta.isTouched &&
                                        field.state.meta.errors.length > 0
                                      }
                                    />
                                    {!isCurrentlyWorking &&
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
                              {isLastCompany && (
                                <form.Field
                                  name={`workExp[${index}].isPresent`}
                                >
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
                                              `workExp[${index}].relieveDate`,
                                              "",
                                            );
                                            form.setFieldValue(
                                              `workExp[${index}].reason`,
                                              "",
                                            );
                                          }
                                        }}
                                        className="h-3.5 w-3.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                                      />
                                      <span>Present (Currently Working)</span>
                                    </label>
                                  )}
                                </form.Field>
                              )}
                            </div>

                            {/* Reason of Leaving */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Reason of Leaving{" "}
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  (Optional)
                                </span>
                              </label>
                              <form.Field name={`workExp[${index}].reason`}>
                                {(field) => (
                                  <div className="flex flex-col">
                                    <Input
                                      value={
                                        isCurrentlyWorking
                                          ? ""
                                          : field.state.value
                                      }
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      onBlur={field.handleBlur}
                                      disabled={isCurrentlyWorking}
                                      className=""
                                      placeholder={
                                        isCurrentlyWorking
                                          ? "N/A (Currently Working)"
                                          : "e.g. Better Opportunity"
                                      }
                                      error={
                                        !isCurrentlyWorking &&
                                        field.state.meta.isTouched &&
                                        field.state.meta.errors.length > 0
                                      }
                                    />
                                    {!isCurrentlyWorking &&
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

                            {/* Last Salary Drawn */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Last Salary Drawn{" "}
                                <span className="text-red-500">*</span>
                              </label>
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
                                      className=""
                                      placeholder="e.g. 5,00,000"
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
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>

                  <button
                    type="button"
                    onClick={() => {
                      const currentWorkExp =
                        form.getFieldValue("workExp") || [];
                      const nextId =
                        currentWorkExp.length > 0
                          ? Math.max(
                              ...currentWorkExp.map((w) => Number(w.id) || 0),
                            ) + 1
                          : 1;
                      const updatedWorkExp = currentWorkExp.map((w) => ({
                        ...w,
                        isPresent: false,
                      }));
                      form.setFieldValue("workExp", updatedWorkExp);
                      form.pushFieldValue("workExp", {
                        id: nextId,
                        company: "",
                        employmentType: "",
                        designation: "",
                        joinDate: "",
                        relieveDate: "",
                        reason: "",
                        salary: "",
                        isPresent: false,
                      });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 mt-2 w-fit text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add More Experience
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        }}
      </form.Subscribe>
    </motion.div>
  );
}
