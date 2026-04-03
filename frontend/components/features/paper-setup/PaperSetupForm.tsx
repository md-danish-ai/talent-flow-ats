import React, { useState, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Textarea } from "@components/ui-elements/Textarea";
import { Checkbox } from "@components/ui-elements/Checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Classification, classificationsApi } from "@lib/api/classifications";
import { Department, departmentsApi } from "@lib/api/departments";
import {
  PaperSetup,
  PaperSubjectConfig,
  PaperSetupCreate,
} from "@lib/api/papers";
import {
  paperSetupSchema,
  type PaperSetupFormValues,
} from "@lib/validations/paper";
import { getErrorMessage } from "@lib/utils";

interface PaperSetupFormProps {
  initialData?: Partial<PaperSetup>;
  onSubmit: (data: PaperSetupCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
}

export const PaperSetupForm: React.FC<PaperSetupFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  title = "Paper Setting - Control Panel",
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [testLevels, setTestLevels] = useState<Classification[]>([]);

  // Helper to check for field errors in subject_configs array
  const getFieldError = (
    errors: unknown[] | undefined,
    idx: number,
    fieldName: string,
  ) => {
    if (!errors) return undefined;
    const found = errors.find((err) => {
      const e = err as { path?: (string | number)[] };
      const path = e?.path || [];
      const isFormLevelMatch = path[1] === idx && path[2] === fieldName;
      const isFieldLevelMatch = path[0] === idx && path[1] === fieldName;
      return isFormLevelMatch || isFieldLevelMatch;
    });
    return found as { message?: string } | undefined;
  };

  // Helpers for time conversion

  const minutesToHHMMSS = (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
  };

  const form = useForm({
    defaultValues: {
      department_id: initialData?.department_id || 0,
      test_level_id: initialData?.test_level_id || "",
      paper_name: initialData?.paper_name || "",
      description: initialData?.description || "",
      subject_ids_data: initialData?.subject_ids_data || [],
    } as PaperSetupFormValues,
    validators: {
      onChange: paperSetupSchema,
      onBlur: paperSetupSchema,
    },
    onSubmit: async ({ value }) => {
      const selectedConfigs = value.subject_ids_data
        .filter((c) => c.is_selected)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      const totalTimeMins = selectedConfigs.reduce(
        (sum, c) => sum + (Number(c.time_minutes) || 0),
        0,
      );
      const calculatedTotalMarks = selectedConfigs.reduce(
        (sum, c) => sum + (Number(c.total_marks) || 0),
        0,
      );

      const payload: PaperSetupCreate = {
        department_id: value.department_id,
        test_level_id: value.test_level_id,
        paper_name: value.paper_name,
        description: value.description || "",
        total_time: minutesToHHMMSS(totalTimeMins),
        total_marks: calculatedTotalMarks,
        subject_ids_data: selectedConfigs.map((c) => {
          const {
            subject_id,
            is_selected,
            question_count,
            total_marks,
            time_minutes,
            order,
          } = c;
          return {
            subject_id,
            is_selected,
            question_count,
            total_marks,
            time_minutes,
            order,
          };
        }),
      };
      onSubmit(payload);
    },
  });

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const [deptRes, levelRes, subRes] = await Promise.all([
          departmentsApi.getDepartments({ is_active: true, limit: 100 }),
          classificationsApi.getClassifications({
            type: "exam_level",
            is_active: true,
            limit: 100,
          }),
          classificationsApi.getClassifications({
            type: "subject",
            is_active: true,
            limit: 100,
          }),
        ]);
        setDepartments(deptRes.data || []);
        setTestLevels(levelRes.data || []);

        const masterSubjects = subRes.data || [];

        // Merge strategy:
        // 1. Start with all subjects from the master list.
        // 2. If initialData has a config for a subject, use it (and it's marked as selected).
        // 3. Otherwise, use a default unselected config.

        const mergedConfigs = masterSubjects.map((sub: Classification) => {
          const existingConfig = initialData?.subject_ids_data?.find(
            (c) => c.subject_id === sub.id,
          );

          if (existingConfig) {
            return {
              ...existingConfig,
              subject_name: sub.name, // Ensure name is always present from master list
              is_selected: true,
            };
          }

          return {
            subject_id: sub.id,
            subject_name: sub.name,
            is_selected: false,
            question_count: 0,
            total_marks: 0,
            time_minutes: 0,
            order: 0,
          };
        });

        // If editing, sort selected ones to top or by their defined order
        if (initialData?.id) {
          mergedConfigs.sort((a, b) => {
            if (a.is_selected && !b.is_selected) return -1;
            if (!a.is_selected && b.is_selected) return 1;
            return (a.order || 0) - (b.order || 0);
          });
        }

        form.setFieldValue("subject_ids_data", mergedConfigs);

        // Reset other fields if in Edit mode
        if (initialData?.id) {
          form.setFieldValue("department_id", initialData.department_id || 0);
          form.setFieldValue("test_level_id", initialData.test_level_id || "");
          form.setFieldValue("paper_name", initialData.paper_name || "");
          form.setFieldValue("description", initialData.description || "");
        }
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      }
    };
    fetchClassifications();
  }, [initialData, form]);

  // Derived states
  const formValues = useStore(form.store, (state) => state.values);

  const totalMarks =
    formValues.subject_ids_data
      ?.filter((c: PaperSubjectConfig) => c.is_selected)
      .reduce(
        (sum: number, c: PaperSubjectConfig) =>
          sum + (Number(c.total_marks) || 0),
        0,
      ) || 0;

  const totalTimeMinutes =
    formValues.subject_ids_data
      ?.filter((c: PaperSubjectConfig) => c.is_selected)
      .reduce(
        (sum: number, c: PaperSubjectConfig) =>
          sum + (Number(c.time_minutes) || 0),
        0,
      ) || 0;

  return (
    <MainCard
      title={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <ArrowLeft size={18} />
          </Button>
          {title}
        </div>
      }
      className="mb-6 overflow-visible"
      bodyClassName="p-6"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form.Field name="paper_name">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Name of Test Paper
                </Typography>
                <Input
                  placeholder="Name of Test Paper"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="text-red-500 mt-1">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="department_id">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Please Select Department
                </Typography>
                <SelectDropdown
                  placeholder="Please Select Department"
                  value={field.state.value || 0}
                  options={departments.map((d) => ({
                    id: d.id,
                    label: d.name,
                  }))}
                  onChange={(val) => field.handleChange(Number(val))}
                  error={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="text-red-500 mt-1">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="test_level_id">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Please Select Test Level
                </Typography>
                <SelectDropdown
                  placeholder="Please Select Test Level"
                  value={field.state.value || ""}
                  options={testLevels.map((l) => ({
                    id: l.code,
                    label: l.name,
                  }))}
                  onChange={(val) => field.handleChange(String(val))}
                  error={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="text-red-500 mt-1">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="md:col-span-3 space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Description of Test Paper
                </Typography>
                <Textarea
                  placeholder="Description of Test Paper"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={2}
                  error={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <Typography variant="body5" className="text-red-500 mt-1">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </Typography>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 px-1">
            <Typography variant="h4" weight="bold" className="text-foreground">
              Set Required type of questions:
            </Typography>
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 px-5 py-2.5 rounded-xl border border-border/60 shadow-sm flex items-center gap-3">
                <Typography
                  variant="body4"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest text-[11px]"
                >
                  Total Time :
                </Typography>
                <Typography
                  variant="h4"
                  weight="black"
                  className="text-brand-primary tabular-nums"
                >
                  {minutesToHHMMSS(totalTimeMinutes)}
                </Typography>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 px-5 py-2.5 rounded-xl border border-border/60 shadow-sm flex items-center gap-3">
                <Typography
                  variant="body4"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest text-[11px]"
                >
                  Total Marks :
                </Typography>
                <Typography
                  variant="h4"
                  weight="black"
                  className="text-red-500 tabular-nums"
                >
                  {totalMarks.toFixed(2)}
                </Typography>
              </div>
            </div>
          </div>

          <form.Field
            name="subject_ids_data"
            validators={{
              onChange: paperSetupSchema.shape.subject_ids_data,
              onBlur: paperSetupSchema.shape.subject_ids_data,
            }}
          >
            {(field) => (
              <div className="border border-border/60 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader className="bg-slate-900 dark:bg-slate-900 hover:bg-slate-900">
                    <TableRow className="border-b-0 hover:bg-transparent h-14">
                      <TableHead className="text-white font-bold px-6">
                        Subject
                      </TableHead>
                      <TableHead className="text-white font-bold text-center w-[120px] px-6">
                        Select
                      </TableHead>
                      <TableHead className="text-white font-bold px-6">
                        No. of Ques.
                      </TableHead>
                      <TableHead className="text-white font-bold px-6">
                        Total Marks
                      </TableHead>
                      <TableHead className="text-white font-bold px-6">
                        Time (Mins)
                      </TableHead>
                      <TableHead className="text-white font-bold px-6">
                        Order
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {field.state.value.map((config, index) => (
                      <TableRow
                        key={config.subject_id}
                        className={
                          config.is_selected ? "bg-brand-primary/5" : ""
                        }
                      >
                        <TableCell className="font-bold text-foreground/90">
                          {config.subject_name}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={config.is_selected}
                              onChange={() => {
                                const newConfigs = [...field.state.value];
                                newConfigs[index] = {
                                  ...newConfigs[index],
                                  is_selected: !config.is_selected,
                                };
                                field.handleChange(newConfigs);
                                field.handleBlur();
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const err = getFieldError(
                              field.state.meta.errors,
                              index,
                              "question_count",
                            );
                            return (
                              <div className="space-y-1">
                                <Input
                                  placeholder="Qty"
                                  type="number"
                                  value={config.question_count || ""}
                                  onChange={(e) => {
                                    const newConfigs = [...field.state.value];
                                    newConfigs[index] = {
                                      ...newConfigs[index],
                                      question_count: Number(e.target.value),
                                    };
                                    field.handleChange(newConfigs);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={!config.is_selected}
                                  className={`h-9 ${
                                    err
                                      ? "border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                />
                                {err && (
                                  <Typography
                                    variant="body5"
                                    className="text-red-500 text-[10px]"
                                  >
                                    {err.message}
                                  </Typography>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const err = getFieldError(
                              field.state.meta.errors,
                              index,
                              "total_marks",
                            );
                            return (
                              <div className="space-y-1">
                                <Input
                                  placeholder="Marks"
                                  type="number"
                                  value={config.total_marks || ""}
                                  onChange={(e) => {
                                    const newConfigs = [...field.state.value];
                                    newConfigs[index] = {
                                      ...newConfigs[index],
                                      total_marks: Number(e.target.value),
                                    };
                                    field.handleChange(newConfigs);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={!config.is_selected}
                                  className={`h-9 ${
                                    err
                                      ? "border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                />
                                {err && (
                                  <Typography
                                    variant="body5"
                                    className="text-red-500 text-[10px]"
                                  >
                                    {err.message}
                                  </Typography>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const err = getFieldError(
                              field.state.meta.errors,
                              index,
                              "time_minutes",
                            );
                            return (
                              <div className="space-y-1">
                                <Input
                                  placeholder="Time"
                                  type="number"
                                  value={config.time_minutes || ""}
                                  onChange={(e) => {
                                    const newConfigs = [...field.state.value];
                                    newConfigs[index] = {
                                      ...newConfigs[index],
                                      time_minutes: Number(e.target.value),
                                    };
                                    field.handleChange(newConfigs);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={!config.is_selected}
                                  className={`h-9 ${
                                    err
                                      ? "border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                />
                                {err && (
                                  <Typography
                                    variant="body5"
                                    className="text-red-500 text-[10px]"
                                  >
                                    {err.message}
                                  </Typography>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const err = getFieldError(
                              field.state.meta.errors,
                              index,
                              "order",
                            );
                            return (
                              <div className="space-y-1">
                                <Input
                                  placeholder="Order"
                                  type="number"
                                  value={config.order || ""}
                                  onChange={(e) => {
                                    const newConfigs = [...field.state.value];
                                    newConfigs[index] = {
                                      ...newConfigs[index],
                                      order: Number(e.target.value),
                                    };
                                    field.handleChange(newConfigs);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={!config.is_selected}
                                  className={`h-9 ${
                                    err
                                      ? "border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                />
                                {err && (
                                  <Typography
                                    variant="body5"
                                    className="text-red-500 text-[10px]"
                                  >
                                    {err.message}
                                  </Typography>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {field.state.meta.errors.length > 0 && (
                  <div className="p-4 text-center">
                    <Typography variant="body5" className="text-red-500">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            color="primary"
            size="md"
            shadow
            animate="scale"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <Button
                type="submit"
                variant="primary"
                color="primary"
                size="md"
                shadow
                animate="scale"
                disabled={isSubmitting || !canSubmit || isLoading}
                startIcon={
                  isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )
                }
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </MainCard>
  );
};
