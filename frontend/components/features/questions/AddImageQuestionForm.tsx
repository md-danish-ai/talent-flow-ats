"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import {
  imageMCQSchema,
  type ImageMCQFormValues,
} from "@lib/validations/question";
import { questionsApi } from "@lib/api";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { OptionInput } from "@components/ui-elements/OptionInput";
import { cn, getErrorMessage } from "@lib/utils";
import { Plus, MessageSquareText, HelpCircle, Loader2 } from "lucide-react";

export const AddImageQuestionForm = ({ 
  questionType = "IMAGE_BASED_MCQ",
  onSuccess 
}: { 
  questionType?: string;
  onSuccess?: () => void 
}) => {
  const form = useForm({
    defaultValues: {
      subject: "",
      questionText: "",
      explanation: "",
      options: [
        { id: "A", label: "A", content: "", isCorrect: false },
        { id: "B", label: "B", content: "", isCorrect: false },
        { id: "C", label: "C", content: "", isCorrect: false },
        { id: "D", label: "D", content: "", isCorrect: false },
      ],
    } as ImageMCQFormValues,
    validators: {
      onChange: imageMCQSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          question_type: questionType,
          subject_type: value.subject,
          exam_level: "Beginner",
          question_text: value.questionText,
          marks: 1,
          is_active: true, // It's only for create here, so keep it or let backend default. I'll keep it for create.
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
        };

        await questionsApi.createQuestion(payload as any);
        alert("Question added successfully!");
        form.reset();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to create question:", error);
        alert("Failed to create question: " + (error as Error).message);
      }
    },
  });

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
                    options={[
                      { id: "Industry Awareness", label: "Industry Awareness" },
                      { id: "Comprehension", label: "Comprehension" },
                      { id: "Logical Reasoning", label: "Logical Reasoning" },
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
                </>
              )}
            </form.Field>
          </div>
          <div className="md:col-span-2">
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
        </div>
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
    </form>
  );
};
