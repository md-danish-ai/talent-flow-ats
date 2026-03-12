"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Eye,
  History,
  CheckCircle2,
  CircleAlert,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import {
  resultsApi,
  type AdminUserAttemptHistoryItem,
  type AdminUserAttemptsResponse,
} from "@lib/api/results";

interface UserResultDetailClientProps {
  userId: number;
}

export function UserResultDetailClient({ userId }: UserResultDetailClientProps) {
  const [attemptData, setAttemptData] = useState<AdminUserAttemptsResponse | null>(
    null,
  );
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoadingAttempts(true);
        setError(null);
        const result = await resultsApi.getUserAttempts(userId);
        setAttemptData(result);
      } catch {
        setError("Failed to load user attempts.");
      } finally {
        setLoadingAttempts(false);
      }
    };

    void fetchAttempts();
  }, [userId]);

  const renderAttemptStatusBadge = (attempt: AdminUserAttemptHistoryItem) => (
    <Badge
      variant="outline"
      color={
        attempt.status === "auto_submitted"
          ? "warning"
          : attempt.status === "submitted"
            ? "success"
            : "default"
      }
    >
      {attempt.status}
    </Badge>
  );

  const totalAttempts = attemptData?.attempts.length ?? 0;
  const submittedAttempts =
    attemptData?.attempts.filter((attempt) => attempt.status === "submitted").length ?? 0;
  const autoSubmittedAttempts =
    attemptData?.attempts.filter((attempt) => attempt.status === "auto_submitted").length ??
    0;

  const summaryCards = [
    {
      key: "total",
      label: "Total Attempts",
      value: totalAttempts,
      icon: <FileText size={16} />,
      tone: "from-brand-primary/15 to-brand-primary/5",
      iconTone: "bg-brand-primary/15 text-brand-primary",
    },
    {
      key: "submitted",
      label: "Submitted",
      value: submittedAttempts,
      icon: <CheckCircle2 size={16} />,
      tone: "from-emerald-500/15 to-emerald-500/5",
      iconTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "auto",
      label: "Auto Submitted",
      value: autoSubmittedAttempts,
      icon: <CircleAlert size={16} />,
      tone: "from-amber-500/15 to-amber-500/5",
      iconTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <PageContainer className="py-2 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="User Interview Result"
          description="Select any attempt to view detailed question-wise outcome."
          className="mb-0"
        />
        <Link href="/admin/results/user-results">
          <Button variant="outline" color="default" startIcon={<ArrowLeft size={14} />}>
            Back to User Results
          </Button>
        </Link>
      </div>

      {loadingAttempts && <Typography variant="body4">Loading attempts...</Typography>}
      {error && <Alert variant="error" description={error} />}

      {!loadingAttempts && attemptData && (
        <>
          <div className="rounded-2xl border border-border bg-gradient-to-r from-brand-primary/10 via-background to-background p-5">
            <Typography variant="h4" className="text-foreground">
              {attemptData.user.username} ({attemptData.user.mobile})
            </Typography>
            <Typography variant="body5" className="mt-1">
              Complete attempt history for this user is listed below.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {summaryCards.map((stat) => (
              <div
                key={stat.key}
                className={`rounded-2xl border border-border bg-gradient-to-br ${stat.tone} p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${stat.iconTone}`}>{stat.icon}</div>
                  <div>
                    <Typography variant="body5">{stat.label}</Typography>
                    <Typography variant="h3">{stat.value}</Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <MainCard
            title="Attempt History"
            bodyClassName="space-y-4"
          >
            <div className="rounded-xl border border-border bg-gradient-to-r from-brand-primary/10 to-card px-4 py-3 flex items-center gap-2">
              <History size={16} className="text-brand-primary" />
              <Typography variant="body4" className="text-foreground font-medium">
                Attempt History ({attemptData.attempts.length})
              </Typography>
            </div>

            {attemptData.attempts.length === 0 ? (
              <Alert variant="warning" description="No attempts found for this user." />
            ) : (
              <div className="space-y-3">
                {attemptData.attempts.map((attempt) => {
                  return (
                    <div
                      key={attempt.attempt_id}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background to-muted/10 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-primary/35 hover:shadow-md"
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-primary/70 to-brand-primary/25 opacity-70 transition-opacity group-hover:opacity-100" />
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                          <Typography variant="body4" className="font-semibold text-foreground">
                            Attempt #{attempt.attempt_id}
                          </Typography>
                          <div className="flex flex-wrap items-center gap-2">
                            {renderAttemptStatusBadge(attempt)}
                            <Badge variant="outline" color="default" icon={<Clock3 size={12} />}>
                              {attempt.submitted_at ? "Submitted" : "In Progress"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Typography
                              variant="body5"
                              className="rounded-lg bg-muted/40 px-2 py-1 text-muted-foreground"
                            >
                              Attempted: {attempt.attempted_count}/{attempt.total_questions}
                            </Typography>
                            <Typography
                              variant="body5"
                              className="rounded-lg bg-muted/40 px-2 py-1 text-muted-foreground"
                            >
                              Not Attempted: {attempt.unattempted_count}
                            </Typography>
                          </div>
                        </div>

                        <Link
                          href={`/admin/results/user-results/${userId}/attempts/${attempt.attempt_id}`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            color="default"
                            startIcon={<Eye size={14} />}
                          >
                            View Attempt
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </MainCard>
        </>
      )}
    </PageContainer>
  );
}
