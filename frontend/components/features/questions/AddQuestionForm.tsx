"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { mcqSchema, type MCQFormValues } from "@lib/validations/question";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { cn, getErrorMessage } from "@lib/utils";
import {
  Plus,
  Trash2,
  CheckCircle2,
  MessageSquareText,
  HelpCircle,
  Loader2,
} from "lucide-react";

export const AddQuestionForm = () => {
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
    } as MCQFormValues,
    validators: {
      onChange: mcqSchema,
    },
    onSubmit: async ({ value }) => {
      // Simulate API call
      console.log("Form submitted:", value);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Question added successfully!");
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
      {/* Section: Basic Info */}
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
                    className={cn(
                      "h-12 border-border/60 hover:border-border rounded-xl bg-muted/20 w-full",
                      field.state.meta.errors.length > 0 && "border-red-500",
                    )}
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
                    className="h-12 border-border/60 hover:border-border rounded-xl bg-muted/20"
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

      {/* Section: Options */}
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
            variant="ghost"
            size="small"
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
                  <div key={opt.id} className="relative group">
                    <div
                      className={cn(
                        "flex items-center gap-3 p-1 rounded-xl border transition-all duration-200",
                        opt.isCorrect
                          ? "border-green-500/50 bg-green-500/5 shadow-sm shadow-green-500/10"
                          : "border-border/60 bg-muted/10 hover:border-border hover:bg-muted/20",
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg font-bold transition-colors",
                          opt.isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-muted-foreground/10 text-muted-foreground",
                        )}
                      >
                        {opt.label}
                      </div>

                      <input
                        type="text"
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
                        className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 h-10 py-1"
                      />

                      <div className="flex items-center gap-1 pr-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = field.state.value.map(
                              (o, i) => ({
                                ...o,
                                isCorrect: i === index,
                              }),
                            );
                            field.handleChange(newOptions);
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            opt.isCorrect
                              ? "text-green-500 bg-green-500/20"
                              : "text-muted-foreground/40 hover:text-green-500 hover:bg-green-500/10",
                          )}
                          title="Mark as correct"
                        >
                          <CheckCircle2 size={18} />
                        </button>

                        {field.state.value.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            title="Remove option"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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

      {/* Section: Explanation */}
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
                  "w-full min-h-[120px] p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none text-foreground placeholder:text-muted-foreground/50",
                  field.state.meta.errors.length > 0 &&
                    "border-red-500 focus:ring-red-500",
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

      <div className="flex justify-end pt-4 border-t border-border mt-6">
        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting, canSubmit]) => (
            <Button
              type="submit"
              variant="primary"
              color="primary"
              size="large"
              shadow
              animate="scale"
              disabled={isSubmitting || !canSubmit}
              className="px-10 rounded-xl font-bold min-w-[180px]"
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
