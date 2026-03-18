"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { mcqSchema, type MCQFormValues } from "@lib/validations/question";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { OptionInput } from "@components/ui-elements/OptionInput";
import { Alert } from "@components/ui-elements/Alert";
import { cn, getErrorMessage } from "@lib/utils";
import { api } from "@lib/api";
import { questionsApi, type QuestionCreate } from "@lib/api/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { Textarea } from "@components/ui-elements/Textarea";
import { Plus, MessageSquareText, HelpCircle, Loader2, Sparkles, PenTool } from "lucide-react";
import { QUESTION_TYPES } from "@lib/constants/questions";

// Mock fallbacks to ensure UI works even if DB is empty
const MOCK_SUBJECTS = [
  { id: 1, label: "Industry Awareness", code: "IA" },
  { id: 2, label: "Comprehension", code: "COMP" },
  { id: 3, label: "Logical Reasoning", code: "LR" },
];

const MOCK_TYPES = [
  { id: 4, label: "Multiple Choice (Single)", code: "MCQ_SINGLE" },
  { id: 5, label: "Multiple Choice (Multi)", code: "MCQ_MULTI" },
  { id: 6, label: "Subjective", code: "SUBJECTIVE" },
];

const MOCK_LEVELS = [
  { id: 7, label: "Entry Level", code: "ENTRY" },
  { id: 8, label: "Intermediate", code: "INTERMEDIATE" },
  { id: 9, label: "Expert", code: "EXPERT" },
];

export const AddQuestionForm = ({
  questionType: initialQuestionType = "MULTIPLE_CHOICE",
  initialData,
  questionId,
  onSuccess,
}: {
  questionType?: string;
  initialData?: any;
  questionId?: number;
  onSuccess?: (mode: "created" | "updated") => void;
}) => {
  const [isAIMode, setIsAIMode] = useState(!initialData && !questionId);
  const [isLoadingClassifications, setIsLoadingClassifications] = useState(true);
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [classifications, setClassifications] = useState<{
    subjects: { id: string | number; label: string; code: string }[];
    types: { id: string | number; label: string; code: string }[];
    levels: { id: string | number; label: string; code: string }[];
  }>({ 
    subjects: MOCK_SUBJECTS.map(s => ({ ...s, id: String(s.id) })), 
    types: MOCK_TYPES.map(t => ({ ...t, id: String(t.id) })), 
    levels: MOCK_LEVELS.map(l => ({ ...l, id: String(l.id) })) 
  });

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        setIsLoadingClassifications(true);
        const [subjectsRes, typesRes, levelsRes] = await Promise.all([
          classificationsApi.getClassifications({ type: "subject_type", is_active: true, limit: 100 }),
          classificationsApi.getClassifications({ type: "question_type", is_active: true, limit: 100 }),
          classificationsApi.getClassifications({ type: "exam_level", is_active: true, limit: 100 }),
        ]);

        const fetchedSubjects = (subjectsRes.data || []).map((c: any) => ({ id: String(c.id), label: c.name, code: c.code }));
        const fetchedTypes = (typesRes.data || []).map((c: any) => ({ id: String(c.id), label: c.name, code: c.code }));
        const fetchedLevels = (levelsRes.data || []).map((c: any) => ({ id: String(c.id), label: c.name, code: c.code }));

        setClassifications({
          subjects: fetchedSubjects.length > 0 ? fetchedSubjects : classifications.subjects,
          types: fetchedTypes.length > 0 ? fetchedTypes : classifications.types,
          levels: fetchedLevels.length > 0 ? fetchedLevels : classifications.levels,
        });
      } catch (error) {
        console.error("Failed to fetch classifications, using mocks:", error);
      } finally {
        setIsLoadingClassifications(false);
      }
    };
    fetchClassifications();
  }, []);

  const form = useForm({
    defaultValues: initialData || {
      question_type_id: "",
      subject_type_id: "",
      exam_level_id: "",
      question_text: "",
      explanation: "",
      source: isAIMode ? "AI" : "Manual",
      marks: 1,
      options: [
        { option_label: "A", option_text: "", is_correct: false },
        { option_label: "B", option_text: "", is_correct: false },
        { option_label: "C", option_text: "", is_correct: false },
        { option_label: "D", option_text: "", is_correct: false },
      ],
      number_of_questions: 1,
      additional_context: ""
    } as any,
    validators: {
      onChange: isAIMode ? undefined : mcqSchema,
    },
    onSubmit: async ({ value }) => {
      setServerMessage(null);
      try {
        if (isAIMode) {
          const payload = {
            question_type_id: Number(value.question_type_id),
            subject_type_id: Number(value.subject_type_id),
            exam_level_id: Number(value.exam_level_id),
            number_of_questions: value.number_of_questions || 1,
            additional_context: value.additional_context
          };
          await api.post("/ai_questions/generate", payload);
          setServerMessage({ type: "success", text: "AI Questions generated and saved successfully!" });
        } else {
          const question_type = classifications.types.find(t => String(t.id) === String(value.question_type_id))?.code || "";
          const subject = classifications.subjects.find(s => String(s.id) === String(value.subject_type_id))?.code || "";
          const exam_level = classifications.levels.find(l => String(l.id) === String(value.exam_level_id))?.code || "";

          const payload: QuestionCreate = {
            question_type,
            subject,
            exam_level,
            question_text: value.question_text,
            marks: value.marks || 1,
            options: value.options.map((opt: any) => ({
              option_label: opt.option_label,
              option_text: opt.option_text,
              is_correct: opt.is_correct,
            })),
            is_active: true,
            answer: {
              explanation: value.explanation,
            },
          };

          let mode: "created" | "updated";
          if (questionId) {
            await questionsApi.updateQuestion(questionId, payload as any);
            mode = "updated";
          } else {
            await questionsApi.createQuestion(payload);
            mode = "created";
          }
          setServerMessage({ type: "success", text: `Question ${questionId ? 'updated' : 'added'} successfully!` });
          if (onSuccess) onSuccess(mode);
        }
        if (!questionId) form.reset();
      } catch (error: any) {
        console.error("Failed to process question", error);
        setServerMessage({
          type: "error",
          text: getErrorMessage(error)
        });
      }
    },
  });

  const addOption = () => {
    const currentOptions = form.getFieldValue("options") as any[];
    if (currentOptions.length < 6) {
      const nextLabel = String.fromCharCode(65 + currentOptions.length);
      form.setFieldValue("options", [
        ...currentOptions,
        { option_label: nextLabel, option_text: "", is_correct: false },
      ]);
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getFieldValue("options") as any[];
    if (currentOptions.length > 2) {
      const filtered = currentOptions.filter((_: any, i: number) => i !== index);
      const remapped = filtered.map((opt: any, i: number) => ({
        ...opt,
        option_label: String.fromCharCode(65 + i),
      }));
      form.setFieldValue("options", remapped);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Toggle Header */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-dashed border-border/60">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl transition-all duration-300",
            isAIMode ? "bg-brand-primary/10 text-brand-primary shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.1)]" : "bg-muted text-muted-foreground"
          )}>
            {isAIMode ? <Sparkles size={22} className="animate-pulse" /> : <PenTool size={22} />}
          </div>
          <div>
            <Typography variant="body3" weight="bold" className="block leading-tight">
              {isAIMode ? "AI Intelligent Generation" : "Step-by-Step Manual Entry"}
            </Typography>
            <Typography variant="body5" className="text-muted-foreground">
              {isAIMode 
                ? "Let Gemini generate high-quality questions for you." 
                : "Create questions manually with full control."}
            </Typography>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setIsAIMode(!isAIMode);
            setServerMessage(null);
          }}
          className="rounded-xl border-border/60 hover:bg-muted font-bold text-xs px-4"
        >
          {isAIMode ? "SWITCH TO MANUAL" : "TRY AI GENERATOR"}
        </Button>
      </div>

      {serverMessage && (
        <Alert 
          variant={serverMessage.type === "success" ? "success" : "error"}
          description={serverMessage.text}
          className="rounded-2xl border-none"
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Core Classifications Section */}
        <div className="p-6 rounded-3xl bg-muted/10 border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
              <HelpCircle size={18} />
            </div>
            <Typography variant="body3" weight="bold">Basic Metadata</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form.Field
              name="subject_type_id"
              children={(field) => (
                <div className="space-y-2">
                  <Typography variant="body5" weight="semibold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Subject</Typography>
                  <SelectDropdown
                    placeholder="Select Subject"
                    value={String(field.state.value)}
                    onChange={(val) => field.handleChange(val as string)}
                    options={classifications.subjects}
                    className="h-12 bg-white dark:bg-muted/20 border-border/40 rounded-xl"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-bold text-destructive ml-1">{getErrorMessage(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="question_type_id"
              children={(field) => (
                <div className="space-y-2">
                  <Typography variant="body5" weight="semibold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Category</Typography>
                  <SelectDropdown
                    placeholder="Select Type"
                    value={String(field.state.value)}
                    onChange={(val) => field.handleChange(val as string)}
                    options={classifications.types}
                    className="h-12 bg-white dark:bg-muted/20 border-border/40 rounded-xl"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-bold text-destructive ml-1">{getErrorMessage(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="exam_level_id"
              children={(field) => (
                <div className="space-y-2">
                  <Typography variant="body5" weight="semibold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Level</Typography>
                  <SelectDropdown
                    placeholder="Select Level"
                    value={String(field.state.value)}
                    onChange={(val) => field.handleChange(val as string)}
                    options={classifications.levels}
                    className="h-12 bg-white dark:bg-muted/20 border-border/40 rounded-xl"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-bold text-destructive ml-1">{getErrorMessage(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {isAIMode ? (
          /* AI Mode Fields */
          <div className="p-6 rounded-3xl bg-brand-primary/[0.03] border border-brand-primary/20 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <form.Field
                  name="number_of_questions"
                  children={(field) => (
                    <div className="space-y-2">
                      <Typography variant="body5" weight="semibold" className="text-brand-primary/80 uppercase tracking-widest ml-1">Quantity</Typography>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="h-12 bg-white dark:bg-muted/20 border-brand-primary/20 rounded-xl focus-visible:ring-brand-primary/20 font-bold"
                      />
                    </div>
                  )}
                />
              </div>
              <div className="md:col-span-3">
                <form.Field
                  name="additional_context"
                  children={(field) => (
                    <div className="space-y-2">
                      <Typography variant="body5" weight="semibold" className="text-brand-primary/80 uppercase tracking-widest ml-1">Prompt Context (Optional)</Typography>
                      <Input
                        placeholder="e.g. Focus on Python decorators and async/await..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-12 bg-white dark:bg-muted/20 border-brand-primary/20 rounded-xl focus-visible:ring-brand-primary/20"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Manual Mode Fields */
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-white dark:bg-muted/5 border border-border/40 shadow-sm space-y-6">
              <form.Field
                name="question_text"
                children={(field) => (
                  <div className="space-y-2">
                    <Typography variant="body5" weight="semibold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Question Content</Typography>
                    <Textarea 
                      placeholder="Type your question prompt here..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-[120px] bg-muted/5 border-border/30 resize-none rounded-2xl p-4 focus:ring-brand-primary/20"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[10px] font-bold text-destructive ml-1">{getErrorMessage(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="body5" weight="semibold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Options</Typography>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addOption}
                    className="h-8 rounded-lg text-[10px] font-black tracking-tighter"
                  >
                    + ADD OPTION
                  </Button>
                </div>

                <form.Field
                  name="options"
                  children={(field) => 
                    field.state.value.map((opt: any, index: number) => (
                      <div key={index} className="group relative bg-muted/5 border border-border/30 rounded-2xl overflow-hidden transition-all hover:border-brand-primary/30">
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border-b border-border/20">
                          <span className="text-xs font-black text-brand-primary italic">Option {opt.option_label}</span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group/label">
                              <span className="text-[10px] font-bold text-muted-foreground group-hover/label:text-brand-primary transition-colors">CORRECT?</span>
                              <input
                                type="checkbox"
                                checked={opt.is_correct}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newOpts = field.state.value.map((o: any, i: number) => ({
                                    ...o,
                                    is_correct: i === index ? e.target.checked : false,
                                  }));
                                  field.handleChange(newOpts);
                                }}
                                className="h-4 w-4 rounded-md border-border/60 text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
                              />
                            </label>
                            {field.state.value.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                >
                                  <Plus size={16} className="rotate-45" />
                                </button>
                              )}
                          </div>
                        </div>
                        <div className="p-4">
                          <Textarea
                            placeholder={`Text for option ${opt.option_label}...`}
                            value={opt.option_text}
                            onChange={(e) => {
                              const newOpts = [...field.state.value];
                              newOpts[index].option_text = e.target.value;
                              field.handleChange(newOpts);
                            }}
                            className="w-full min-h-[80px] bg-transparent border-none shadow-none focus-visible:ring-0 resize-none p-0 text-sm leading-relaxed"
                          />
                        </div>
                      </div>
                    ))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-border/30">
                <div className="md:col-span-3">
                  <form.Field
                    name="explanation"
                    children={(field) => (
                      <div className="space-y-2">
                        <Typography variant="body5" weight="bold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Answer Explanation</Typography>
                        <Textarea
                          placeholder="Explain why the selected option is correct?..."
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="min-h-[100px] bg-muted/10 border-border/40 resize-none rounded-2xl p-4 focus:ring-brand-primary/20"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-[10px] font-bold text-destructive ml-1">{getErrorMessage(field.state.meta.errors[0])}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="md:col-span-1">
                  <form.Field
                    name="marks"
                    children={(field) => (
                      <div className="space-y-2">
                        <Typography variant="body5" weight="bold" className="text-muted-foreground/80 uppercase tracking-widest ml-1">Marks</Typography>
                        <div className="p-4 rounded-2xl bg-muted/10 border border-border/40 flex items-center gap-3">
                          <Input
                            type="number"
                            min={1}
                            max={50}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            className="h-10 bg-transparent border-none focus-visible:ring-0 text-center font-black text-lg p-0"
                          />
                          <div className="h-8 w-px bg-border/40" />
                          <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-tight">Points</span>
                        </div>
                      </div>
                    )}
                  />
                </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-8 border-t border-border/30">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => form.reset()}
            className="text-muted-foreground hover:text-foreground rounded-xl"
          >
            Reset All
          </Button>
          <form.Subscribe
             selector={(state) => [state.isSubmitting, state.canSubmit]}
             children={([isSubmitting, canSubmit]) => (
               <Button 
                 type="submit" 
                 disabled={!canSubmit || isSubmitting}
                 className={cn(
                   "min-w-[180px] h-12 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95",
                   isAIMode ? "bg-brand-primary text-white hover:bg-brand-primary/90" : "bg-brand-primary/90 text-white hover:bg-brand-primary"
                 )}
               >
                 {isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     {isAIMode ? "GENERATING..." : "SAVING..."}
                   </>
                 ) : (
                   <>
                     {isAIMode ? <Sparkles size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                     {isAIMode ? "GENERATE WITH AI" : (questionId ? "SAVE CHANGES" : "ADD TO DATABASE")}
                   </>
                 )}
               </Button>
             )}
           />
        </div>
      </form>
    </div>
  );
};
