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
}

export const PaperSetupForm: React.FC<PaperSetupFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [testLevels, setTestLevels] = useState<Classification[]>([]);

  // Helpers for time conversion
  const parseTimeToMinutes = (timeStr: string | undefined): number => {
    if (!timeStr || typeof timeStr !== "string") return 0;
    const parts = timeStr.split(":").map((p) => parseInt(p) || 0);
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1]; // Convert HH:MM:SS to total minutes
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(timeStr) || 0;
  };

  const minutesToHHMMSS = (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
  };

  const form = useForm({
    defaultValues: {
      department_id: initialData?.department_id || 0,
      test_level_id: initialData?.test_level_id || 0,
      paper_name: initialData?.paper_name || "",
      description: initialData?.description || "",
      english_test_time: parseTimeToMinutes(initialData?.english_test_time),
      excel_time: parseTimeToMinutes(initialData?.excel_time),
      company_details_time: parseTimeToMinutes(
        initialData?.company_details_time,
      ),
      lead_generation_time: parseTimeToMinutes(
        initialData?.lead_generation_time,
      ),
      typing_test_time: parseTimeToMinutes(initialData?.typing_test_time),
      rpit_test_time: parseTimeToMinutes(initialData?.rpit_test_time),
      subject_configs: initialData?.subject_configs || [],
    } as PaperSetupFormValues,
    validators: {
      onChange: paperSetupSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: PaperSetupCreate = {
        ...value,
        description: value.description || "",
        english_test_time: minutesToHHMMSS(value.english_test_time),
        excel_time: minutesToHHMMSS(value.excel_time),
        company_details_time: minutesToHHMMSS(value.company_details_time),
        lead_generation_time: minutesToHHMMSS(value.lead_generation_time),
        typing_test_time: minutesToHHMMSS(value.typing_test_time),
        rpit_test_time: minutesToHHMMSS(value.rpit_test_time),
        subject_configs: value.subject_configs
          .filter((c) => c.is_selected)
          .map((c) => {
            const {
              subject_id,
              is_selected,
              question_count,
              total_marks,
              order,
            } = c;
            return {
              subject_id,
              is_selected,
              question_count,
              total_marks,
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

        if (!initialData?.id) {
          const initialConfigs = (subRes.data || []).map(
            (sub: Classification) => ({
              subject_id: sub.id,
              subject_name: sub.name,
              is_selected: false,
              question_count: 0,
              total_marks: 0,
              order: 0,
            }),
          );
          form.setFieldValue("subject_configs", initialConfigs);
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
    formValues.subject_configs
      ?.filter((c: PaperSubjectConfig) => c.is_selected)
      .reduce(
        (sum: number, c: PaperSubjectConfig) =>
          sum + (Number(c.total_marks) || 0),
        0,
      ) || 0;

  const totalTimeMinutes =
    (formValues.english_test_time || 0) +
    (formValues.excel_time || 0) +
    (formValues.company_details_time || 0) +
    (formValues.lead_generation_time || 0) +
    (formValues.typing_test_time || 0) +
    (formValues.rpit_test_time || 0);

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
          Paper Setting - Control Panel
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
                  value={field.state.value || 0}
                  options={testLevels.map((l) => ({ id: l.id, label: l.name }))}
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

          <form.Field name="description">
            {(field) => (
              <div className="md:col-span-1 space-y-1.5">
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
                  rows={1}
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

          <form.Field name="english_test_time">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  English Test Time (Mins)
                </Typography>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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

          <form.Field name="excel_time">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Excel Time (Mins)
                </Typography>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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

          <form.Field name="company_details_time">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Company Details Time (Mins)
                </Typography>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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

          <form.Field name="lead_generation_time">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Lead Generation Time (Mins)
                </Typography>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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

          <form.Field name="typing_test_time">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Typing Test Time (Mins)
                </Typography>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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

          <form.Field name="rpit_test_time">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  RPIT Test Time (Mins)
                </Typography>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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

          <div className="space-y-1.5">
            <Typography
              variant="body5"
              weight="bold"
              className="text-muted-foreground uppercase tracking-wider"
            >
              Total Time (HH:MM:SS)
            </Typography>
            <Input
              disabled
              value={minutesToHHMMSS(totalTimeMinutes)}
              className="bg-slate-50"
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 px-1">
            <Typography
              variant="h4"
              weight="bold"
              className="text-slate-800 dark:text-slate-200"
            >
              Set Required type of questions:
            </Typography>
            <div className="bg-slate-50 dark:bg-slate-800/40 px-5 py-2.5 rounded-xl border border-border/60 shadow-sm flex items-center gap-3">
              <Typography
                variant="body4"
                weight="bold"
                className="text-slate-500 uppercase tracking-widest text-[11px]"
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

          <form.Field name="subject_configs">
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
                        Question Required?
                      </TableHead>
                      <TableHead className="text-white font-bold px-6">
                        Total Marks
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
                        <TableCell className="font-bold text-slate-700">
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
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
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
                            disabled={!config.is_selected}
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell>
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
                            disabled={!config.is_selected}
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell>
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
                            disabled={!config.is_selected}
                            className="h-9"
                          />
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
