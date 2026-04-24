"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { cn, getErrorMessage } from "@lib/utils";
import { api } from "@lib/api";
import { ENDPOINTS } from "@lib/api/endpoints";
import { classificationsApi } from "@lib/api/classifications";
import { Textarea } from "@components/ui-elements/Textarea";
import { Loader2, Sparkles, HelpCircle } from "lucide-react";
import { type Classification, type PaginatedResponse } from "@types";

interface AIFormValues {
  question_type_id: number;
  subject_type_id: number;
  exam_level_id: number;
  number_of_questions: number;
  marks: number;
  additional_context: string;
}

interface AIQuestionFormProps {
  onSuccess?: () => void;
}

export const AIQuestionForm = ({ onSuccess }: AIQuestionFormProps) => {
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [classifications, setClassifications] = useState<{
    subjects: { id: string; label: string; code: string }[];
    types: { id: string; label: string; code: string }[];
    levels: { id: string; label: string; code: string }[];
  }>({
    subjects: [],
    types: [],
    levels: [],
  });

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const [subjectsRes, typesRes, levelsRes] = await Promise.all([
          classificationsApi.getClassifications({
            type: "subject",
            is_active: true,
            limit: 100,
          }),
          classificationsApi.getClassifications({
            type: "question_type",
            is_active: true,
            limit: 100,
          }),
          classificationsApi.getClassifications({
            type: "exam_level",
            is_active: true,
            limit: 100,
          }),
        ]);

        // Helper to handle both PaginatedResponse and direct array response
        const extractData = (
          res: Classification[] | PaginatedResponse<Classification>,
        ) => (Array.isArray(res) ? res : res?.data || []);

        const fetchedSubjects = extractData(subjectsRes).map(
          (c: { id: number; name: string; code: string }) => ({
            id: String(c.id),
            label: c.name,
            code: c.code,
          }),
        );
        const fetchedTypes = extractData(typesRes).map(
          (c: { id: number; name: string; code: string }) => ({
            id: String(c.id),
            label: c.name,
            code: c.code,
          }),
        );
        const fetchedLevels = extractData(levelsRes).map(
          (c: { id: number; name: string; code: string }) => ({
            id: String(c.id),
            label: c.name,
            code: c.code,
          }),
        );

        setClassifications({
          subjects: fetchedSubjects,
          types: fetchedTypes,
          levels: fetchedLevels,
        });
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      }
    };
    fetchClassifications();
  }, []);

  const form = useForm({
    defaultValues: {
      question_type_id: 0,
      subject_type_id: 0,
      exam_level_id: 0,
      number_of_questions: 1,
      marks: 1,
      additional_context: "",
    } as AIFormValues,
    onSubmit: async ({ value }) => {
      setServerMessage(null);
      try {
        const selectedType = classifications.types.find(t => t.id === String(value.question_type_id));
        const selectedSubject = classifications.subjects.find(s => s.id === String(value.subject_type_id));
        const selectedLevel = classifications.levels.find(l => l.id === String(value.exam_level_id));

        const payload = {
          question_type: selectedType,
          subject_type: selectedSubject,
          exam_level: selectedLevel,
          number_of_questions: value.number_of_questions || 1,
          marks: Number(value.marks) || 1,
          additional_context: value.additional_context || undefined,
        };
        await api.post(ENDPOINTS.AI_QUESTIONS.GENERATE, payload);
        setServerMessage({
          type: "success",
          text: `${value.number_of_questions} AI question(s) generated and saved successfully!`,
        });
        form.reset();
        if (onSuccess) onSuccess();
      } catch (error: unknown) {
        console.error("Failed to generate AI questions", error);
        setServerMessage({
          type: "error",
          text: getErrorMessage(error),
        });
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
        <div className="p-2 rounded-xl bg-brand-primary/15 text-brand-primary">
          <Sparkles size={20} />
        </div>
        <div>
          <Typography
            variant="body3"
            weight="bold"
            className="text-brand-primary"
          >
            AI Question Generator
          </Typography>
          <Typography variant="body5" className="text-muted-foreground">
            Generate questions automatically using AI (Llama 3.2)
          </Typography>
        </div>
      </div>

      {/* ── Server Message ── */}
      {serverMessage && (
        <div
          className={cn(
            "p-4 rounded-xl border text-sm font-medium",
            serverMessage.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-600"
              : "bg-destructive/10 border-destructive/30 text-destructive",
          )}
        >
          {serverMessage.text}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* ── Classification Selectors ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
              <HelpCircle size={16} />
            </div>
            <Typography variant="body4" weight="bold">
              Question Parameters
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Question Type */}
            <form.Field name="question_type_id">
              {(field) => (
                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="text-muted-foreground uppercase tracking-wider"
                  >
                    Question Type
                  </Typography>
                  <SelectDropdown
                    placeholder="Select Type"
                    value={field.state.value ? String(field.state.value) : ""}
                    onChange={(val) => field.handleChange(Number(val))}
                    options={classifications.types.map((t) => ({
                      id: t.id,
                      label: t.label,
                    }))}
                    className="h-12 bg-muted/20 w-full border-border/60 hover:border-border"
                  />
                </div>
              )}
            </form.Field>

            {/* Subject */}
            <form.Field name="subject_type_id">
              {(field) => (
                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="text-muted-foreground uppercase tracking-wider"
                  >
                    Subject
                  </Typography>
                  <SelectDropdown
                    placeholder="Select Subject"
                    value={field.state.value ? String(field.state.value) : ""}
                    onChange={(val) => field.handleChange(Number(val))}
                    options={classifications.subjects.map((s) => ({
                      id: s.id,
                      label: s.label,
                    }))}
                    className="h-12 bg-muted/20 w-full border-border/60 hover:border-border"
                  />
                </div>
              )}
            </form.Field>

            {/* Exam Level */}
            <form.Field name="exam_level_id">
              {(field) => (
                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="text-muted-foreground uppercase tracking-wider"
                  >
                    Exam Level
                  </Typography>
                  <SelectDropdown
                    placeholder="Select Level"
                    value={field.state.value ? String(field.state.value) : ""}
                    onChange={(val) => field.handleChange(Number(val))}
                    options={classifications.levels.map((l) => ({
                      id: l.id,
                      label: l.label,
                    }))}
                    className="h-12 bg-muted/20 w-full border-border/60 hover:border-border"
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Number of Questions ── */}
          <form.Field name="number_of_questions">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Number of Questions (1–10)
                </Typography>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="h-12 bg-muted/20 border-border/60 hover:border-border w-full"
                />
              </div>
            )}
          </form.Field>

          {/* ── Marks ── */}
          <form.Field name="marks">
            {(field) => (
              <div className="space-y-1.5">
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Marks per Question
                </Typography>
                <SelectDropdown
                  placeholder="Select Marks"
                  value={String(field.state.value)}
                  onChange={(val) => field.handleChange(Number(val))}
                  options={[
                    { id: "1", label: "1 Mark" },
                    { id: "2", label: "2 Marks" },
                    { id: "5", label: "5 Marks" },
                    { id: "10", label: "10 Marks" },
                  ]}
                  className="h-12 bg-muted/20 border-border/60 hover:border-border w-full"
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* ── Additional Context ── */}
        <form.Field name="additional_context">
          {(field) => (
            <div className="space-y-1.5">
              <Typography
                variant="body5"
                weight="semibold"
                className="text-muted-foreground uppercase tracking-wider"
              >
                Additional Context{" "}
                <span className="normal-case text-[10px] font-normal">
                  (optional)
                </span>
              </Typography>
              <Textarea
                placeholder="E.g. Focus on customer handling, inbound calls, escalation scenarios..."
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="min-h-[100px] bg-muted/10 border-border/40 resize-none rounded-2xl p-4 focus:ring-brand-primary/20"
              />
            </div>
          )}
        </form.Field>

        {/* ── Submit ── */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              setServerMessage(null);
            }}
            className="text-muted-foreground hover:text-foreground rounded-xl"
          >
            Reset
          </Button>

          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="min-w-[200px] h-12 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 bg-brand-primary text-white hover:bg-brand-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    GENERATE WITH AI
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
};
