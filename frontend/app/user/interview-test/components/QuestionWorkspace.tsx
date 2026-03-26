import { memo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { QuestionInput } from "./QuestionInput";
import type { InterviewQuestion, InterviewSection, TimerZone } from "../types";

interface QuestionWorkspaceProps {
  message: string | null;
  onCloseMessage: () => void;
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
}

export const QuestionWorkspace = memo(function QuestionWorkspace({
  message,
  onCloseMessage,
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
}: QuestionWorkspaceProps) {
  return (
    <MainCard
      title="Question Workspace"
      action={
        <Badge variant="outline" color="primary" className="whitespace-nowrap">
          <Typography variant="span" className="sm:hidden">
            Q {questionIndex + 1}/{currentSection.questions.length}
          </Typography>
          <Typography variant="span" className="hidden sm:inline">
            Question {questionIndex + 1}/{currentSection.questions.length}
          </Typography>
        </Badge>
      }
      bodyClassName="space-y-4"
    >
      {message && (
        <Alert variant="info" description={message} onClose={onCloseMessage} />
      )}

      {timerZone !== "safe" && (
        <motion.div
          animate={{ scale: [1, timerZone === "danger" ? 1.02 : 1.01, 1] }}
          transition={{ duration: timerZone === "danger" ? 0.5 : 1.2, repeat: Infinity }}
          className={`rounded-lg ${
            timerZone === "danger" 
              ? "ring-4 ring-red-500/30 animate-pulse" 
              : "ring-2 ring-yellow-500/20"
          }`}
        >
          <Alert
            variant={timerZone === "danger" ? "error" : "warning"}
            title={timerZone === "danger" ? "Critical Time Warning" : "Time Warning"}
            description={`You have ${remainingTimeText} remaining for this section (${currentSection.title}). Please answer quickly before the section auto-locks.`}
          />
        </motion.div>
      )}

      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-brand-primary" />
          <div>
            <Typography variant="h4" className="text-foreground font-bold">
              {currentQuestion.typeName || (
                (currentQuestion.type === "MULTIPLE_CHOICE" || currentQuestion.type === "IMAGE_MULTIPLE_CHOICE") 
                ? "Multiple Choice" : "Analytical Response"
              )}
            </Typography>
            <Typography variant="body5" className="text-muted-foreground uppercase tracking-widest font-medium">
              Mode: {currentQuestion.type.replace(/_/g, " ")}
            </Typography>
          </div>
        </div>
        {currentQuestion.subjectName && (
          <Badge variant="outline" color="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
            {currentQuestion.subjectName}
          </Badge>
        )}
      </div>

      <QuestionInput
        question={currentQuestion}
        currentAnswer={currentAnswer}
        onChangeAnswer={onAnswerChange}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <Button
          variant="outline"
          color="primary"
          animate="scale"
          onClick={onPrevious}
          disabled={questionIndex === 0}
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
              ? "Finish Interview"
              : "Save & Next Section"
            : "Save & Next"}
        </Button>
      </div>
    </MainCard>
  );
});
