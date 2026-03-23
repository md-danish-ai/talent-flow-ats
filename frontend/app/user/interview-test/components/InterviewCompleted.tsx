import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Alert } from "@components/ui-elements/Alert";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

interface InterviewCompletedProps {
  totalSections: number;
  totalQuestions: number;
  answeredCount: number;
  notAttemptedCount: number;
  completionReason: "manual" | "time_over" | null;
  overallExamDurationMinutes: number;
}

export function InterviewCompleted({
  totalSections,
  totalQuestions,
  answeredCount,
  notAttemptedCount,
  completionReason,
  overallExamDurationMinutes,
}: InterviewCompletedProps) {
  return (
    <MainCard
      title="Interview Completed"
      className="max-w-4xl mx-auto"
      bodyClassName="gap-6"
    >
      <Alert
        variant="success"
        title="Submission Complete"
        description={
          completionReason === "time_over"
            ? `Your paper was auto-submitted because the overall interview time of ${overallExamDurationMinutes} minutes ended. Selected answers were saved as attempted, and unanswered questions were submitted as not attempted.`
            : "All sections are completed. This screen is running with dummy data and UI-only workflow."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
          <Typography variant="body5">Total Sections</Typography>
          <Typography variant="h3" className="text-foreground mt-1">
            {totalSections}
          </Typography>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
          <Typography variant="body5">Total Questions</Typography>
          <Typography variant="h3" className="text-foreground mt-1">
            {totalQuestions}
          </Typography>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
          <Typography variant="body5">Answered</Typography>
          <Typography variant="h3" className="text-foreground mt-1">
            {answeredCount}
          </Typography>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
          <Typography variant="body5">Not Attempted</Typography>
          <Typography variant="h3" className="text-foreground mt-1">
            {notAttemptedCount}
          </Typography>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/user/dashboard">
          <Button
            variant="outline"
            color="default"
            startIcon={<ArrowLeft size={16} />}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </MainCard>
  );
}
