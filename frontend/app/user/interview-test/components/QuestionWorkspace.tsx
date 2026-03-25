import { memo } from "react";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { QuestionInput } from "./QuestionInput";
import type { InterviewQuestion, InterviewSection, TimerZone } from "../types";

interface QuestionWorkspaceProps {
  message: string | null;
  onCloseMessage: () => void;
  sectionIndex: number;
  totalSections: number;
  currentSection: InterviewSection;
  questionIndex: number;
  progressPercent: number;
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
  sectionIndex,
  totalSections,
  currentSection,
  questionIndex,
  progressPercent,
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
      title={
        <div className="flex items-center gap-2">
          <span>Question Workspace</span>
        </div>
      }
      action={
        <Badge variant="outline" color="primary" className="whitespace-nowrap">
          <span className="sm:hidden">
            Q {questionIndex + 1}/{currentSection.questions.length}
          </span>
          <span className="hidden sm:inline">
            Question {questionIndex + 1}/{currentSection.questions.length}
          </span>
        </Badge>
      }
      bodyClassName="space-y-4"
    >
      {message && (
        <Alert variant="info" description={message} onClose={onCloseMessage} />
      )}

      <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" color="secondary">
            Section {sectionIndex + 1}/{totalSections}
          </Badge>
          <Badge variant="outline" color="primary">
            {currentSection.title}
          </Badge>
          <Badge variant="outline" color="default">
            Progress {progressPercent}%
          </Badge>
          <Badge
            variant="outline"
            color={
              timerZone === "danger"
                ? "error"
                : timerZone === "warn"
                  ? "warning"
                  : "success"
            }
            icon={<Clock3 size={12} />}
            className="font-mono"
          >
            {remainingTimeText}
          </Badge>
        </div>

        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {timerZone === "danger" && (
        <Alert
          variant="error"
          title="Time Warning"
          description={`You have ${remainingTimeText} left in the interview. Please answer quickly, otherwise remaining unanswered questions will be auto-submitted as not attempted.`}
        />
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <QuestionInput
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onChangeAnswer={onAnswerChange}
        />
      </div>

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
