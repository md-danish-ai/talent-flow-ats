"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import {
  typingTestSchema,
  type TypingTestFormValues,
} from "@lib/validations/question";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { Textarea } from "@components/ui-elements/Textarea";
import { getErrorMessage } from "@lib/utils";
import { HelpCircle, Loader2 } from "lucide-react";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi } from "@lib/api/classifications";
import { type Classification, type QuestionCreate } from "@types";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";

export const TypingTestForm = ({
  initialData,
  questionId,
  onSuccess,
}: {
  initialData?: TypingTestFormValues;
  questionId?: number;
  onSuccess?: (mode: "created" | "updated") => void;
}) => {
  const [subjects, setSubjects] = React.useState<Classification[]>([]);
  const [examLevels, setExamLevels] = React.useState<Classification[]>([]);

  const form = useForm({
    defaultValues:
      initialData ||
      ({
        subject: "",
        examLevel: "",
        marks: 1,
        questionText: "",
        passage: "",
      } as TypingTestFormValues),
    validators: {
      onChange: typingTestSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: Partial<QuestionCreate> = {
          question_type: QUESTION_TYPES.TYPING_TEST,
          subject: value.subject,
          exam_level: value.examLevel,
          question_text: value.questionText,
          passage: value.passage,
          marks: value.marks,
          options: [], // Typing Test has no options
          answer: {
            answer_text: "",
            explanation: "",
          },
        };

        if (!questionId) {
          payload.is_active = true;
        }

        let mode: "created" | "updated";
        if (questionId) {
          await questionsApi.updateQuestion(questionId, payload);
          mode = "updated";
        } else {
          await questionsApi.createQuestion(payload as QuestionCreate);
          mode = "created";
        }

        form.reset();
        if (onSuccess) onSuccess(mode);
      } catch (error) {
        console.error("Failed to process question", error);
      }
    },
  });

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
          QUESTION_TYPES.TYPING_TEST,
        );
        setSubjects(filteredSubjects);

        // Auto-select if there is exactly one match (normal for exclusive subjects)
        if (filteredSubjects.length === 1 && !initialData?.subject) {
          form.setFieldValue("subject", filteredSubjects[0].code);
        }

        setExamLevels(examLevelsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      }
    };
    fetchClassifications();
  }, [form, initialData?.subject]);

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
            Typing Test Details
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
                    disabled
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

        <div className="mt-4">
          <form.Field name="questionText">
            {(field) => (
              <>
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="mb-2 block text-muted-foreground uppercase tracking-wider"
                >
                  Typing Title
                </Typography>
                <Textarea
                  placeholder="Enter the typing title here (e.g. Quality Policy)..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="h-14 bg-muted/20 transition-colors border-border/60 hover:border-border"
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

        <div className="mt-4">
          <form.Field name="passage">
            {(field) => (
              <>
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="mb-2 block text-muted-foreground uppercase tracking-wider"
                >
                  Typing Paragraph
                </Typography>
                <Textarea
                  placeholder="Enter the full paragraph text to be typed..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors.length > 0}
                  className="h-40 bg-muted/20 transition-colors border-border/60 hover:border-border"
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
