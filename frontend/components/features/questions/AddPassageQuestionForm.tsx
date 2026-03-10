"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import {
  passageSchema,
  type PassageFormValues,
} from "@lib/validations/question";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { cn, getErrorMessage } from "@lib/utils";
import {
  MessageSquareText,
  HelpCircle,
  Loader2,
  BookOpen,
  FileText,
} from "lucide-react";
import { questionsApi } from "@lib/api/questions";
import {
  classificationsApi,
  type Classification,
} from "@lib/api/classifications";
import { type QuestionCreate } from "@lib/api/questions";

export const AddPassageQuestionForm = ({
  initialData,
  questionId,
  onSuccess,
}: {
  initialData?: PassageFormValues;
  questionId?: number;
  onSuccess?: (mode: "created" | "updated") => void;
}) => {
  const [subjects, setSubjects] = React.useState<Classification[]>([]);
  const [examLevels, setExamLevels] = React.useState<Classification[]>([]);

  React.useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const [subjectsRes, examLevelsRes] = await Promise.all([
          classificationsApi.getClassifications({
            type: "subject",
            limit: 100,
          }),
          classificationsApi.getClassifications({
            type: "exam_level",
            limit: 100,
          }),
        ]);
        setSubjects(subjectsRes.data || []);
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
        passage: "",
        questionText: "",
        answerText: "",
        explanation: "",
      } as PassageFormValues),
    validators: {
      onChange: passageSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: Partial<QuestionCreate> = {
          question_type: "PASSAGE_CONTENT",
          subject: value.subject,
          exam_level: value.examLevel,
          passage: value.passage,
          question_text: value.questionText,
          marks: value.marks,
          is_active: true,
          options: [],
          answer: {
            answer_text: value.answerText,
            explanation: value.explanation,
          },
        };

        if (questionId) {
          await questionsApi.updateQuestion(questionId, payload);
          if (onSuccess) onSuccess("updated");
        } else {
          await questionsApi.createQuestion(payload as QuestionCreate);
          form.reset();
          if (onSuccess) onSuccess("created");
        }
      } catch (error) {
        console.error("Failed to process question:", error);
      }
    },
  });

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
                    options={subjects.map((s) => ({
                      id: s.code,
                      label: s.name,
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
                </>
              )}
            </form.Field>
          </div>
          <div className="md:col-span-1">
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
                    placeholder="Select Exam Level"
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
                </>
              )}
            </form.Field>
          </div>
          <div className="md:col-span-1">
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
                </>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      {/* Passage Paragraph Section */}
      <div className="space-y-4">
        <form.Field name="passage">
          {(field) => (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
                  <FileText size={18} />
                </div>
                <Typography variant="body3" weight="bold">
                  Passage Paragraph
                </Typography>
              </div>
              <textarea
                placeholder="Paste or write the passage content here..."
                className={cn(
                  "w-full min-h-[150px] p-4 rounded-md border bg-muted/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/50 overflow-y-auto",
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

      <div className="space-y-4">
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
                placeholder="Enter the main question related to the passage..."
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

      {/* Answer Section */}
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
              <textarea
                placeholder="Write the expected correct answer..."
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

      {/* Explanation Section */}
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
                placeholder="Explain the logic or reasoning behind the correct answer..."
                className={cn(
                  "w-full min-h-[100px] p-4 rounded-md border bg-muted/20 transition-all resize-none text-foreground placeholder:text-muted-foreground/50",
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

      {/* Submit Button */}
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
