"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "@tanstack/react-form";
import {
  imageMCQSchema,
  type ImageMCQFormValues,
} from "@lib/validations/question";
import { questionsApi, type QuestionCreate } from "@lib/api/questions";
import { classificationsApi, type Classification } from "@lib/api/classifications";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { OptionInput } from "@components/ui-elements/OptionInput";
import { cn, getErrorMessage } from "@lib/utils";
import { Plus, MessageSquareText, HelpCircle, Loader2 } from "lucide-react";

export const AddImageQuestionForm = ({
  questionType = "IMAGE_MULTIPLE_CHOICE",
  questionId,
  initialData,
  onSuccess,
}: {
  questionType?: string;
  questionId?: number | null;
  initialData?: ImageMCQFormValues | null;
  onSuccess?: () => void;
}) => {
  const [toast, setToast] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const [subjects, setSubjects] = React.useState<Classification[]>([]);
  const [examLevels, setExamLevels] = React.useState<Classification[]>([]);
  const [questionTypes, setQuestionTypes] = React.useState<Classification[]>([]);

  React.useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const [subjectsRes, examLevelsRes, questionTypesRes] = await Promise.all([
          classificationsApi.getClassifications({ type: "subject_type", limit: 100 }),
          classificationsApi.getClassifications({ type: "exam_level", limit: 100 }),
          classificationsApi.getClassifications({ type: "question_type", limit: 100 }),
        ]);
        setSubjects(subjectsRes.data || []);
        setExamLevels(examLevelsRes.data || []);
        setQuestionTypes(questionTypesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      }
    };
    fetchClassifications();
  }, []);

  const defaultValues: ImageMCQFormValues = initialData ?? {
    subject: "",
    examLevel: "Beginner",
    marks: 1,
    questionImageUrl: "",
    questionText: "",
    explanation: "",
    options: [
      { id: "A", label: "A", content: "", isCorrect: false },
      { id: "B", label: "B", content: "", isCorrect: false },
      { id: "C", label: "C", content: "", isCorrect: false },
      { id: "D", label: "D", content: "", isCorrect: false },
    ],
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: imageMCQSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          // pick a valid question_type code. Prefer any code that mentions image, else fallback to prop or first known code
          question_type:
            questionTypes.find((q) => /image/i.test(q.code) || /image/i.test(q.name))?.code || questionType || questionTypes[0]?.code,
          subject_type: value.subject,
          exam_level: value.examLevel,
          question_text: value.questionText,
          marks: value.marks,
          image_url: value.questionImageUrl || undefined,
          // Keep is_active undefined for update (backend will keep current), but for create we can set true
          is_active: questionId ? undefined : true,
          options: value.options.map(o => ({
            option_label: o.label,
            option_text: o.content,
            is_correct: o.isCorrect
          })),
          answer: {
            explanation: value.explanation,
            answer_text: value.options
              .filter(o => o.isCorrect)
              .map(o => o.label)
              .join(", ") || "A" 
          }
        } as QuestionCreate;

        if (questionId) {
          // Update existing question
          await questionsApi.updateQuestion(questionId, payload);
          setToast({ type: "success", message: "Question updated successfully." });
        } else {
          await questionsApi.createQuestion(payload as QuestionCreate);
          setToast({ type: "success", message: "Question added successfully." });
          form.reset();
        }

        if (onSuccess) onSuccess();
      } catch (error) {
        console.error(questionId ? "Failed to update question:" : "Failed to create question:", error);
        setToast({
          type: "error",
          message:
            (questionId ? "Failed to update question: " : "Failed to create question: ") + (error as Error).message,
        });
      }
    },
  });

  const [uploading, setUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(String(reader.result));
    };
    reader.readAsDataURL(selectedFile);
    return () => {
      setPreviewUrl(null);
    };
  }, [selectedFile]);

  // file upload is handled by explicit Upload button inside the upload box

  const addOption = () => {
    const currentOptions = form.getFieldValue("options");
    if (currentOptions.length < 6) {
      const nextLabel = String.fromCharCode(65 + currentOptions.length);
      form.setFieldValue("options", [
        ...currentOptions,
        { id: nextLabel, label: nextLabel, content: "", isCorrect: false },
      ]);
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getFieldValue("options");
    if (currentOptions.length > 2) {
      const filtered = currentOptions.filter((_, i) => i !== index);
      const remapped = filtered.map((opt, i) => ({
        ...opt,
        id: String.fromCharCode(65 + i),
        label: String.fromCharCode(65 + i),
      }));
      form.setFieldValue("options", remapped);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8 p-1"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
            <HelpCircle size={18} />
          </div>
          <Typography variant="body3" weight="bold">
            Question Details
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <form.Field name="subject">
              {(field) => (
                <>
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="mb-2 block text-muted-foreground uppercase tracking-wider"
                  >
                    Subject
                  </Typography>
                  <SelectDropdown
                    placeholder="Select Subject"
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val as string)}
                    options={subjects.map((s) => ({ id: s.code, label: s.name }))}
                    className="h-12 bg-muted/20 w-full transition-colors border-border/60 hover:border-border"
                    error={field.state.meta.errors.length > 0}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="text-red-500 mt-1 ml-1 font-medium"
                    >
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  )}
                </>
              )}
            </form.Field>
          </div>
          <div className="md:col-span-1">
            <form.Field name="questionText">
              {(field) => (
                <>
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="mb-2 block text-muted-foreground uppercase tracking-wider"
                  >
                    Question Text
                  </Typography>
                  <Input
                    type="text"
                    placeholder="Enter the main question here..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className="h-12 bg-muted/20 transition-colors border-border/60 hover:border-border"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="text-red-500 mt-1 ml-1 font-medium"
                    >
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  )}
                </>
              )}
            </form.Field>
          </div>
          <div className="md:col-span-1">
            <div className="space-y-2">
              <form.Field name="examLevel">
                {(field) => (
                  <>
                    <Typography
                      variant="body5"
                      weight="semibold"
                      className="mb-2 block text-muted-foreground uppercase tracking-wider"
                    >
                      Exam Level
                    </Typography>
                    <SelectDropdown
                      placeholder="Select Level"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as string)}
                      options={examLevels.map((e) => ({ id: e.code, label: e.name }))}
                      className="h-12 bg-muted/20 w-full transition-colors border-border/60 hover:border-border"
                      error={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Typography
                        variant="body5"
                        className="text-red-500 mt-1 ml-1 font-medium"
                      >
                        {getErrorMessage(field.state.meta.errors[0])}
                      </Typography>
                    )}
                  </>
                )}
              </form.Field>

              <form.Field name="marks">
                {(field) => (
                  <>
                    <Typography
                      variant="body5"
                      weight="semibold"
                      className="mb-2 block text-muted-foreground uppercase tracking-wider"
                    >
                      Marks
                    </Typography>
                    <SelectDropdown
                      placeholder="Select Marks"
                      value={String(field.state.value)}
                      onChange={(val) => field.handleChange(Number(val))}
                      options={Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1), label: String(i + 1) }))}
                      className="h-12 bg-muted/20 w-full transition-colors border-border/60 hover:border-border"
                      error={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Typography
                        variant="body5"
                        className="text-red-500 mt-1 ml-1 font-medium"
                      >
                        {getErrorMessage(field.state.meta.errors[0])}
                      </Typography>
                    )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
            <HelpCircle size={18} />
          </div>
          <Typography variant="body3" weight="bold">
            Question Image
          </Typography>
        </div>

        <form.Field name="questionImageUrl">
          {(field) => (
            <div>
              <div
                className={cn(
                  "w-full rounded-md border-2 border-dashed p-4 flex flex-col items-center justify-center",
                  field.state.value ? "border-border/60 bg-muted/5" : "border-border/40 bg-transparent",
                )}
                style={{ minHeight: 160 }}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer?.files?.[0];
                  if (f) setSelectedFile(f);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="text-center w-full">
                    {field.state.value ? (
                      <div className="flex items-center justify-center">
                        <Image src={field.state.value} alt="question" width={480} height={280} className="max-h-48 rounded-md object-contain" />
                      </div>
                    ) : previewUrl ? (
                      <div className="flex items-center justify-center">
                        <Image src={previewUrl} alt="preview" width={480} height={280} className="max-h-48 rounded-md object-contain" />
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        <Typography variant="body4" className="mb-2">Drag files to upload</Typography>
                        <Typography variant="body5">or select a file to upload</Typography>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      ref={inputRef}
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => inputRef.current?.click()}
                    >
                      Select file
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        if (!selectedFile) {
                          setToast({ type: "error", message: "Please select a file first" });
                          return;
                        }
                        try {
                          setUploading(true);
                          const res = await questionsApi.uploadImage(selectedFile);
                          const typed = res as { image_url?: string };
                          if (typed?.image_url) {
                            form.setFieldValue("questionImageUrl", typed.image_url);
                            setSelectedFile(null);
                            setToast({ type: "success", message: "Image uploaded" });
                          }
                        } catch (err) {
                          console.error("Upload failed", err);
                          setToast({ type: "error", message: "Image upload failed" });
                        } finally {
                          setUploading(false);
                        }
                      }}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>

                    {field.state.value && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => form.setFieldValue("questionImageUrl", "")}>
                        Remove
                      </Button>
                    )}
                  </div>

                  {selectedFile && (
                    <Typography variant="body5" className="text-muted-foreground mt-2">
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
              <Plus size={18} />
            </div>
            <Typography variant="body3" weight="bold">
              Answer Options
            </Typography>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="text-brand-primary hover:bg-brand-primary/5"
          >
            + Add Option
          </Button>
        </div>

        <form.Field name="options">
          {(field) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {field.state.value.map((opt, index) => (
                  <form.Field key={opt.id} name={`options[${index}].content`}>
                    {(subField) => (
                      <div className="relative group flex flex-col gap-1">
                        <OptionInput
                          prefixLabel={opt.label}
                          isCorrect={opt.isCorrect}
                          placeholder={`Type option ${opt.label} content...`}
                          value={opt.content}
                          onChange={(e) => {
                            const newOptions = [...field.state.value];
                            newOptions[index] = {
                              ...opt,
                              content: e.target.value,
                            };
                            field.handleChange(newOptions);
                          }}
                          onBlur={subField.handleBlur}
                          error={
                            subField.state.meta.errors.length > 0 ||
                            field.state.meta.errors.length > 0
                          }
                          onMarkCorrect={() => {
                            const newOptions = field.state.value.map(
                              (o, i) => ({
                                ...o,
                                isCorrect:
                                  i === index ? !o.isCorrect : o.isCorrect,
                              }),
                            );
                            field.handleChange(newOptions);
                          }}
                          onRemove={() => removeOption(index)}
                          showRemove={field.state.value.length > 2}
                        />
                        {subField.state.meta.errors.length > 0 && (
                          <Typography
                            variant="body5"
                            className="text-red-500 font-medium ml-1"
                          >
                            {getErrorMessage(subField.state.meta.errors[0])}
                          </Typography>
                        )}
                      </div>
                    )}
                  </form.Field>
                ))}
              </div>
              {field.state.meta.errors.length > 0 && (
                <Typography
                  variant="body5"
                  className="text-red-500 font-medium ml-1 mt-1"
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </Typography>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-4">
        <form.Field name="explanation">
          {(field) => (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
                  <MessageSquareText size={18} />
                </div>
                <Typography variant="body3" weight="bold">
                  Answer Explanation
                </Typography>
              </div>
              <textarea
                placeholder="Explain why the correct option is the right answer..."
                className={cn(
                  "w-full min-h-[120px] p-4 rounded-md border bg-muted/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/50",
                  field.state.meta.errors.length > 0
                    ? "border-red-500 ring-1 ring-red-500/20 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-border/60 hover:border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
                )}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <Typography
                  variant="body5"
                  className="text-red-500 font-medium ml-1 mt-1"
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </Typography>
              )}
            </>
          )}
        </form.Field>
      </div>

      <div className="bg-card flex justify-end">
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
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Question"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={cn(
              "rounded-xl border px-4 py-3 shadow-lg bg-card min-w-[260px] max-w-sm",
              toast.type === "success"
                ? "border-emerald-300/80 dark:border-emerald-500/60"
                : "border-red-300/80 dark:border-red-500/60",
            )}
          >
            <Typography
              variant="body5"
              weight="bold"
              className={cn(
                "mb-1 uppercase tracking-widest text-[11px]",
                toast.type === "success"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {toast.type === "success" ? "Success" : "Error"}
            </Typography>
            <Typography variant="body4" className="text-foreground">
              {toast.message}
            </Typography>
          </div>
        </div>
      )}
    </form>
  );
};
