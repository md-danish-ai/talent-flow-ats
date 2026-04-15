"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import {
  imageSubjectiveSchema,
  type ImageSubjectiveFormValues,
} from "@lib/validations/question";
import { questionsApi, type QuestionCreate } from "@lib/api/questions";
import {
  classificationsApi,
  type Classification,
} from "@lib/api/classifications";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { Textarea } from "@components/ui-elements/Textarea";
import { cn, getErrorMessage } from "@lib/utils";
import {
  MessageSquareText,
  HelpCircle,
  Loader2,
  Upload,
  FileImage,
  X,
  BookOpen,
} from "lucide-react";
import { toast } from "@lib/toast";
import Image from "next/image";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";

export const AddImageSubjectiveQuestionForm = ({
  questionId,
  initialData,
  onSuccess,
}: {
  questionId?: number;
  initialData?: ImageSubjectiveFormValues;
  onSuccess?: () => void;
}) => {
  const [subjects, setSubjects] = React.useState<Classification[]>([]);
  const [examLevels, setExamLevels] = React.useState<Classification[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getCanonicalImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    ) {
      return url;
    }
    const base = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"
    ).replace(/\/$/, "");
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  React.useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const [subjectsRes, examLevelsRes] = await Promise.all([
          classificationsApi.getClassifications({
            type: "subject",
            is_active: true,
            limit: 100,
          }),
          classificationsApi.getClassifications({
            type: "exam_level",
            is_active: true,
            limit: 100,
          }),
        ]);
        const filteredSubjects = filterSubjectsForQuestionType(
          subjectsRes.data || [],
          QUESTION_TYPES.IMAGE_SUBJECTIVE,
          subjectsRes.data || [],
        );
        setSubjects(filteredSubjects);
        setExamLevels(examLevelsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      }
    };
    fetchClassifications();
  }, []);

  const form = useForm({
    defaultValues:
      initialData ||
      ({
        subject: "",
        examLevel: "",
        marks: 1,
        questionImageUrl: "",
        questionText: "",
        answerText: "",
        explanation: "",
      } as ImageSubjectiveFormValues),
    validators: {
      onChange: imageSubjectiveSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: Partial<QuestionCreate> = {
          question_type: QUESTION_TYPES.IMAGE_SUBJECTIVE,
          subject: value.subject,
          exam_level: value.examLevel,
          image_url: value.questionImageUrl,
          question_text: value.questionText,
          marks: value.marks,
          is_active: true,
          options: [], // Subjective has no options
          answer: {
            answer_text: value.answerText,
            explanation: value.explanation,
          },
        };

        if (questionId) {
          await questionsApi.updateQuestion(questionId, payload);
        } else {
          await questionsApi.createQuestion(payload as QuestionCreate);
          form.reset();
        }
        // client.ts fires success toast automatically with backend message
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to process question:", error);
        // client.ts fires error toast automatically with backend message
      }
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await questionsApi.uploadImage(file);
      form.setFieldValue("questionImageUrl", result.image_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed: " + (error as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 p-1"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image Section */}
          <div className="lg:col-span-5 space-y-4">
            <form.Field name="questionImageUrl">
              {(field) => (
                <>
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="mb-2 block text-muted-foreground uppercase tracking-wider"
                  >
                    Question Image
                  </Typography>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    title="Upload question image"
                  />
                  <div className="flex flex-col gap-2">
                    {field.state.value ? (
                      <div className="flex flex-col gap-2">
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted/30 group shadow-sm transition-all hover:border-brand-primary/30">
                          <Image
                            src={
                              getCanonicalImageUrl(field.state.value) as string
                            }
                            alt="Preview"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => field.handleChange("")}
                              className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all scale-90 group-hover:scale-100 shadow-xl"
                              title="Remove Image"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                          <FileImage size={14} />
                          <span className="truncate flex-1">
                            {field.state.value
                              .split("/")
                              .pop()
                              ?.replace(/^[0-9a-f]{32}_/, "")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={cn(
                          "w-full aspect-[4/3] rounded-lg border-2 border-dashed border-border/60 bg-muted/10 hover:bg-brand-primary/[0.03] hover:border-brand-primary transition-all flex flex-col items-center justify-center gap-3 group",
                          isUploading && "animate-pulse",
                        )}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <div className="p-3 rounded-full bg-background border border-border group-hover:border-brand-primary/50 transition-all shadow-sm">
                          {isUploading ? (
                            <Loader2
                              size={24}
                              className="animate-spin text-brand-primary"
                            />
                          ) : (
                            <Upload
                              size={24}
                              className="text-muted-foreground group-hover:text-brand-primary"
                            />
                          )}
                        </div>
                        <div className="text-center">
                          <Typography
                            variant="body4"
                            weight="bold"
                            className="text-muted-foreground group-hover:text-brand-primary transition-colors"
                          >
                            {isUploading ? "Uploading..." : "Click to Upload"}
                          </Typography>
                          <Typography
                            variant="body5"
                            className="text-muted-foreground/50 mt-1 uppercase tracking-widest text-[9px] font-bold"
                          >
                            JPG, PNG or GIF (16:9 recommended)
                          </Typography>
                        </div>
                      </button>
                    )}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="text-red-500 mt-1.5 ml-1 font-medium"
                    >
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  )}
                </>
              )}
            </form.Field>
          </div>

          {/* Right Column: Metadata & Text Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <form.Field name="subject">
                {(field) => (
                  <div className="space-y-2">
                    <Typography
                      variant="body5"
                      weight="semibold"
                      className="block text-muted-foreground uppercase tracking-wider"
                    >
                      Subject
                    </Typography>
                    <SelectDropdown
                      placeholder="Select Subject"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as string)}
                      options={[
                        { id: "", label: "Select Subject" },
                        ...subjects.map((s) => ({ id: s.code, label: s.name })),
                      ]}
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
                  </div>
                )}
              </form.Field>

              <form.Field name="examLevel">
                {(field) => (
                  <div className="space-y-2">
                    <Typography
                      variant="body5"
                      weight="semibold"
                      className="block text-muted-foreground uppercase tracking-wider"
                    >
                      Exam Level
                    </Typography>
                    <SelectDropdown
                      placeholder="Select Level"
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as string)}
                      options={examLevels.map((e) => ({
                        id: e.code,
                        label: e.name,
                      }))}
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
                  </div>
                )}
              </form.Field>

              <div className="sm:col-span-1">
                <form.Field name="marks">
                  {(field) => (
                    <div className="space-y-2">
                      <Typography
                        variant="body5"
                        weight="semibold"
                        className="block text-muted-foreground uppercase tracking-wider"
                      >
                        Marks
                      </Typography>
                      <SelectDropdown
                        placeholder="Select Marks"
                        value={String(field.state.value)}
                        onChange={(val) => field.handleChange(Number(val))}
                        options={Array.from({ length: 50 }, (_, i) => ({
                          id: String(i + 1),
                          label: String(i + 1),
                        }))}
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
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <form.Field name="questionText">
              {(field) => (
                <div className="space-y-2">
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="block text-muted-foreground uppercase tracking-wider"
                  >
                    Question Text
                  </Typography>
                  <Textarea
                    placeholder="Enter the main question here..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.length > 0}
                    className="h-28 bg-muted/20 transition-colors border-border/60 hover:border-border"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Typography
                      variant="body5"
                      className="text-red-500 mt-1 ml-1 font-medium"
                    >
                      {getErrorMessage(field.state.meta.errors[0])}
                    </Typography>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      {/* Answer & Explanation Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <form.Field name="answerText">
            {(field) => (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                    <BookOpen size={18} />
                  </div>
                  <Typography variant="body3" weight="bold">
                    Correct Answer
                  </Typography>
                </div>
                <Textarea
                  placeholder="Write the expected correct answer..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="bg-muted/20 min-h-[150px]"
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
                <Textarea
                  placeholder="Explain the logic or reasoning behind the correct answer..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="bg-muted/20 min-h-[150px]"
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
    </form>
  );
};
