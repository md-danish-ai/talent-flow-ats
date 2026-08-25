"use client";

import { memo } from "react";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Alert } from "@components/ui-elements/Alert";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { QuestionInput } from "./QuestionInput";
import { QuestionInstructionBanner } from "./QuestionInstructionBanner";
import { humanizeString, cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import type { InterviewQuestion, InterviewSection, TimerZone } from "../types";

interface QuestionWorkspaceProps {
  currentSection: InterviewSection;
  questionIndex: number;
  timerZone: TimerZone;
  remainingTimeText: string;
  currentQuestion: InterviewQuestion;
  currentAnswer: string;
  isLastQuestionInSection: boolean;
  isLastSection: boolean;
  onAnswerChange: (value: string) => void;
  onPrevious: () => void;
  onSaveAndNext: () => void;
  onRunTour?: () => void;
}

export const QuestionWorkspace = memo(function QuestionWorkspace({
  currentSection,
  questionIndex,
  timerZone,
  remainingTimeText,
  currentQuestion,
  currentAnswer,
  isLastQuestionInSection,
  isLastSection,
  onAnswerChange,
  onPrevious,
  onSaveAndNext,
  onRunTour,
}: QuestionWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card border border-border/60 shadow-sm p-4 sm:p-6 space-y-4 transition-colors overflow-hidden",
        STYLE_CONFIG.cardRadius,
      )}
    >
      {timerZone !== "safe" && (
        <motion.div
          animate={{ scale: [1, timerZone === "danger" ? 1.02 : 1.01, 1] }}
          transition={{
            duration: timerZone === "danger" ? 0.5 : 1.2,
            repeat: Infinity,
          }}
          className={`rounded-lg ${
            timerZone === "danger"
              ? "ring-4 ring-red-500/30 animate-pulse"
              : "ring-2 ring-yellow-500/20"
          }`}
        >
          <Alert
            variant={timerZone === "danger" ? "error" : "warning"}
            title={
              timerZone === "danger" ? "Critical Time Warning" : "Time Warning"
            }
            description={`You have ${remainingTimeText} remaining for this section (${currentSection.title}). Please answer quickly before the section auto-locks.`}
          />
        </motion.div>
      )}

      {/* Header Row: Subject, Mode, Question Badge & Quick Guide */}
      <div
        id="interview-active-question-type"
        className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-1.5 rounded-full bg-brand-primary shrink-0" />
          <div>
            <Typography
              variant="h4"
              className="text-foreground font-bold leading-tight text-base sm:text-lg"
            >
              {currentQuestion.typeName ||
                (currentQuestion.type === "MULTIPLE_CHOICE" ||
                currentQuestion.type === "IMAGE_MULTIPLE_CHOICE"
                  ? "Multiple Choice"
                  : "Analytical Response")}
            </Typography>
            <Typography
              variant="body5"
              className="text-muted-foreground uppercase tracking-widest font-medium text-[11px]"
            >
              Mode: {humanizeString(currentQuestion.type)}
            </Typography>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {currentQuestion.subjectName && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-xs">
              {currentQuestion.subjectName}
            </span>
          )}

          <span
            id="interview-active-question-badge"
            className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs"
          >
            <span className="sm:hidden">
              Q {questionIndex + 1}/{currentSection.questions.length}
            </span>
            <span className="hidden sm:inline">
              Question {questionIndex + 1}/{currentSection.questions.length}
            </span>
          </span>

          {onRunTour && (
            <Button
              id="interview-active-help-trigger"
              size="sm"
              variant="primary"
              color="primary"
              animate="scale"
              startIcon={<HelpCircle size={14} />}
              onClick={onRunTour}
              className="h-7 px-2.5 text-xs font-semibold shadow-xs"
            >
              Quick Guide
            </Button>
          )}
        </div>
      </div>

      <div id="interview-active-instruction">
        <QuestionInstructionBanner
          subjectName={currentQuestion.subjectName}
          type={currentQuestion.type}
        />
      </div>

      <div id="interview-active-workspace-content">
        <QuestionInput
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onChangeAnswer={onAnswerChange}
        />
      </div>

      <div
        id="interview-active-nav-actions"
        className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1"
      >
        <Button
          variant="outline"
          color="primary"
          animate="scale"
          onClick={onPrevious}
          disabled={
            questionIndex === 0 || currentQuestion.type === "TYPING_TEST"
          }
          startIcon={<ArrowLeft size={16} />}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>

        <Button
          onClick={onSaveAndNext}
          color="primary"
          animate="scale"
          endIcon={<ArrowRight size={16} />}
          className="w-full sm:w-auto"
        >
          {isLastQuestionInSection
            ? isLastSection
              ? "Submit Test"
              : "Save & Next Section"
            : "Save & Next"}
        </Button>
      </div>
    </div>
  );
});
