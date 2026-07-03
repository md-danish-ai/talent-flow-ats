import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { DatePicker } from "@components/ui-elements/DatePicker";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Trash2, Plus } from "lucide-react";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
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
    return (employmentRes?.data || []).map((c: { name: string, code: string }) => ({
      id: c.code,
      label: c.name,
    }));
  }, [employmentRes]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h1"
        weight="bold"
        className="text-center mb-1 pb-1"
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
            <div className="flex flex-col gap-4 mt-4">
        <form.Subscribe selector={(state) => [state.values.workExp]}>
          {([workExp]) =>
            workExp.map((exp: WorkExperience, index: number) => {
              const headerTitle = exp.company ? `Company - ${exp.company}` : `Company ${index + 1}`;
              let prevRelieveDate: string | undefined = undefined;
              if (exp.employmentType !== "PART_TIME") {
                for (let i = index - 1; i >= 0; i--) {
                  if (workExp[i].employmentType !== "PART_TIME" && workExp[i].relieveDate) {
                    prevRelieveDate = workExp[i].relieveDate;
                    break;
                  }
                }
              }
              
              return (
                <div
                  key={exp.id}
                  className="p-5 border border-border rounded-xl bg-card shadow-sm relative group transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                    <h4 className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
                      {headerTitle}
                    </h4>
                    <Tooltip
                      content="Delete Row"
                      side="top"
                    >
                      <button
                        type="button"
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
                      <label className="text-xs font-medium text-muted-foreground">Name of Company</label>
                      <form.Field name={`workExp[${index}].company`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-10"
                              placeholder="Enter company name..."
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 mt-1 pl-1">
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Employment Type */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Employment Type</label>
                      <form.Field name={`workExp[${index}].employmentType`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <SelectDropdown
                              options={employmentTypeOptions}
                              value={field.state.value}
                              onChange={(val) => field.handleChange(val as string)}
                              placeholder="Select Employment Type"
                              disabled={isLoadingEmploymentType}
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 w-full mt-1">
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Designation */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Designation</label>
                      <form.Field name={`workExp[${index}].designation`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-10"
                              placeholder="Enter designation..."
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 mt-1 pl-1">
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Joining Date */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Joining Date</label>
                      <form.Field name={`workExp[${index}].joinDate`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <DatePicker
                              value={field.state.value}
                              onChange={(date) => field.handleChange(date)}
                              onBlur={field.handleBlur}
                              className="h-10 w-full text-sm"
                              placeholder="Select Date"
                              disableFuture
                              minDate={prevRelieveDate}
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 w-full mt-1">
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Relieving Date */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Relieving Date</label>
                      <form.Field name={`workExp[${index}].relieveDate`}>
                        {(field) => (
                          <div className="flex flex-col relative w-full text-center">
                            <DatePicker
                              value={field.state.value}
                              onChange={(date) => field.handleChange(date)}
                              onBlur={field.handleBlur}
                              className="h-10 w-full text-sm"
                              placeholder="Select Date"
                              disableFuture
                              minDate={exp.joinDate}
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 w-full mt-1">
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Reason of Leaving */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Reason of Leaving</label>
                      <form.Field name={`workExp[${index}].reason`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-10"
                              placeholder="e.g. Better Opportunity"
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 mt-1 pl-1">
                                {getErrorMessage(field.state.meta.errors[0])}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Last Salary Drawn */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Last Salary Drawn</label>
                      <form.Field name={`workExp[${index}].salary`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-10"
                              placeholder="e.g. 5,00,000"
                              error={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 mt-1 pl-1">
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
            form.pushFieldValue("workExp", {
              id: Date.now(),
              company: "",
              employmentType: "",
              designation: "",
              joinDate: "",
              relieveDate: "",
              reason: "",
              salary: "",
            });
          }}
          className="flex items-center gap-1.5 px-4 py-2 mt-2 w-fit text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add More Experience
        </button>
      </div>
    </motion.div>
  );
}
