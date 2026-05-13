"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  History,
  User,
  Phone,
  LayoutDashboard,
  Clock,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Download, Loader2 } from "lucide-react";
import { toast } from "@lib/toast";
import { BASE_URL } from "@lib/api/client";
import { AttemptHistoryCard } from "@components/ui-cards/AttemptHistoryCard";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { resultsApi, ApiError } from "@lib/api";
import {
  type AdminUserAttemptHistoryItem,
  type AdminUserAttemptsResponse,
} from "@types";
import { cn, formatDate } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { UserResultDetailSkeleton } from "@components/ui-skeleton/UserResultDetailSkeleton";
import { Tabs } from "@components/ui-elements/Tabs";
import { Round2History } from "./Round2History";
import { UserX, RefreshCcw } from "lucide-react";

interface UserResultDetailClientProps {
  userId: number;
  basePath?: string;
}

export function UserResultDetailClient({
  userId,
  basePath = "/admin/results/round-1",
}: UserResultDetailClientProps) {
  const [attemptData, setAttemptData] =
    useState<AdminUserAttemptsResponse | null>(null);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [error, setError] = useState<{
    message: string;
    status?: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("round1");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoadingAttempts(true);
        setError(null);
        const result = await resultsApi.getUserAttempts(userId);
        setAttemptData(result);
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError({ message: err.message, status: err.status });
        } else {
          setError({ message: "An unexpected error occurred." });
        }
      } finally {
        setLoadingAttempts(false);
      }
    };

    void fetchAttempts();
  }, [userId]);

  const renderAttemptStatusBadge = (attempt: AdminUserAttemptHistoryItem) => (
    <Badge
      variant="outline"
      shape="square"
      color={
        attempt.status === "started"
          ? "secondary"
          : attempt.status === "submitted" ||
              attempt.status === "auto_submitted"
            ? "success"
            : attempt.status === "expired"
              ? "error"
              : attempt.status === "system_error"
                ? "warning"
                : "default"
      }
    >
      {attempt.status}
    </Badge>
  );

  if (loadingAttempts) {
    return (
      <PageContainer className="py-6">
        <UserResultDetailSkeleton />
      </PageContainer>
    );
  }

  if (error || !attemptData) {
    return (
      <PageContainer className="py-20">
        <EmptyState
          icon={UserX}
          title={
            error?.status === 404 ? "Candidate Not Found" : "Error Loading Data"
          }
          description={
            error?.message ||
            "Something went wrong while fetching user attempts."
          }
          className="shadow-2xl border-rose-500/10"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              color="primary"
              onClick={() => window.location.reload()}
              className={`px-8 py-6 ${STYLE_CONFIG.buttonRadius} shadow-xl shadow-brand-primary/20`}
              startIcon={<RefreshCcw size={18} />}
              animate="scale"
            >
              Retry Loading
            </Button>
            <Link href={basePath}>
              <Button
                variant="outline"
                color="primary"
                className={`px-8 py-6 ${STYLE_CONFIG.buttonRadius} shadow-xl shadow-brand-primary/20`}
                animate="scale"
              >
                Go Back to Results
              </Button>
            </Link>
          </div>
        </EmptyState>
      </PageContainer>
    );
  }

  const totalAttempts = attemptData.attempts.length;
  const submittedAttempts = attemptData.attempts.filter(
    (a) => a.status === "submitted" || a.status === "auto_submitted",
  ).length;
  const lastAttemptDate = attemptData.attempts[0]?.started_at
    ? formatDate(attemptData.attempts[0].started_at)
    : "N/A";

  const stats = [
    {
      label: "Total Sessions",
      value: totalAttempts,
      subValue: "Interview attempts",
      icon: <LayoutDashboard size={20} />,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      border: "border-brand-primary/20",
    },
    {
      label: "Completed",
      value: submittedAttempts,
      subValue: `${totalAttempts > 0 ? ((submittedAttempts / totalAttempts) * 100).toFixed(0) : 0}% completion rate`,
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Last Activity",
      value: lastAttemptDate,
      subValue: "Most recent attempt",
      icon: <Clock size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  const TABS = [
    {
      value: "round1",
      label: "Round 1 (Technical)",
      icon: <History size={16} />,
    },
    {
      value: "round2",
      label: "Round 2 (F2F Interview)",
      icon: <UserCheck size={16} />,
    },
  ];

  return (
    <PageContainer className="py-6 space-y-8">
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href={basePath}
            className="group flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors mb-2"
          >
            <div className="p-1 rounded-full bg-muted group-hover:bg-brand-primary/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <Typography variant="body5" className="font-medium">
              Back to User Results
            </Typography>
          </Link>
          <Typography variant="h2" className="tracking-tight font-black">
            Interview Analytics
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            color="primary"
            className="shadow-md shadow-brand-primary/10"
            startIcon={
              downloadingPdf ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )
            }
            disabled={!attemptData?.attempts?.length || downloadingPdf}
            onClick={async () => {
              const latest = attemptData?.attempts?.[0];
              if (!latest) return;
              setDownloadingPdf(true);
              try {
                const authRow = document.cookie
                  .split(";")
                  .find((r) => r.trim().startsWith("auth_token="));
                let token = authRow
                  ? authRow.trim().substring("auth_token=".length)
                  : "";
                token = token.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
                try {
                  token = decodeURIComponent(token);
                } catch {
                  /* keep raw */
                }

                const res = await fetch(
                  `${BASE_URL}/admin/results/report/${userId}/${latest.attempt_id}/pdf`,
                  { headers: { Authorization: `Bearer ${token}` } },
                );
                if (!res.ok) throw new Error("PDF failed");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const formattedDate = new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                  .format(new Date())
                  .replace(/ /g, "-");

                const a = document.createElement("a");
                a.href = url;
                a.download = `Report_${attemptData?.user?.username?.replace(/\s+/g, "_")}_${formattedDate}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch {
                toast.error("Failed to download report. Please try again.");
              } finally {
                setDownloadingPdf(false);
              }
            }}
          >
            {downloadingPdf ? "Generating PDF..." : "Download Report Sheet"}
          </Button>
          <Link href={basePath}>
            <Button
              color="primary"
              className="shadow-lg shadow-brand-primary/20"
            >
              Manage All Results
            </Button>
          </Link>
        </div>
      </div>

      {/* User Information Profile Card */}
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-gradient-to-br from-card via-card to-brand-primary/5 p-6 md:p-8 shadow-sm",
          STYLE_CONFIG.cardRadius,
        )}
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <User size={120} />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary p-1 shadow-xl">
              <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <div className="h-full w-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <User size={48} className="opacity-80" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-emerald-500 border-4 border-card" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                <Typography variant="h3" className="font-bold">
                  {attemptData.user.username}
                </Typography>
                <Badge color="success" variant="fill" shape="square">
                  Active Candidate
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-brand-primary" />
                  <Typography variant="body5">
                    {attemptData.user.mobile}
                  </Typography>
                </div>
                <div className="h-1 w-1 rounded-full bg-border md:block hidden" />
                <Typography variant="body5">ID: #{userId}</Typography>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <div
                className={cn(
                  "px-4 py-2 bg-muted/40 border border-border/50 backdrop-blur-sm",
                  STYLE_CONFIG.innerCardRadius,
                )}
              >
                <Typography
                  variant="body5"
                  className="text-muted-foreground font-medium mb-0.5"
                >
                  Primary Skill
                </Typography>
                <Typography variant="body4" className="font-bold">
                  React Developer
                </Typography>
              </div>
              <div
                className={cn(
                  "px-4 py-2 bg-muted/40 border border-border/50 backdrop-blur-sm",
                  STYLE_CONFIG.innerCardRadius,
                )}
              >
                <Typography
                  variant="body5"
                  className="text-muted-foreground font-medium mb-0.5"
                >
                  Applied For
                </Typography>
                <Typography variant="body4" className="font-bold">
                  Senior Web Engineer
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={cn(
              `group relative overflow-hidden border ${stat.border} bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`,
              STYLE_CONFIG.cardRadius,
            )}
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div
                className={cn(
                  `w-12 h-12 ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`,
                  STYLE_CONFIG.iconRadius,
                )}
              >
                {stat.icon}
              </div>
              <div>
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {stat.label}
                </Typography>
                <div className="flex items-baseline gap-2 mt-1">
                  <Typography variant="h2" className="font-black">
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground font-medium"
                  >
                    {stat.subValue}
                  </Typography>
                </div>
              </div>
            </div>
            <div
              className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-50 transition-opacity group-hover:opacity-80`}
            />
          </div>
        ))}
      </div>

      {/* Tabs for Round 1 and Round 2 */}
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="w-full"
      />

      <div className="mt-8">
        {activeTab === "round1" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2.5 bg-brand-primary/10 text-brand-primary shadow-sm",
                    STYLE_CONFIG.iconRadius,
                  )}
                >
                  <History size={20} />
                </div>
                <div>
                  <Typography variant="h4" className="font-bold leading-none">
                    Attempt History
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground mt-1"
                  >
                    Recent interview sessions and their scoring outcomes.
                  </Typography>
                </div>
              </div>
              <Badge variant="outline" shape="square">
                {totalAttempts} Total
              </Badge>
            </div>

            {attemptData.attempts.length === 0 ? (
              <EmptyState
                variant="database"
                title="No attempts found"
                description="This candidate has not started any interview sessions yet. Attempts will appear here once they begin."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {attemptData.attempts.map((attempt, index) => (
                  <AttemptHistoryCard
                    key={attempt.attempt_id}
                    attemptId={attempt.attempt_id}
                    paperId={attempt.paper_id}
                    paperName={attempt.paper_name}
                    userId={userId}
                    index={index}
                    totalAttempts={totalAttempts}
                    status={attempt.status}
                    statusBadge={renderAttemptStatusBadge(attempt)}
                    isAutoSubmitted={attempt.is_auto_submitted}
                    completionReason={attempt.completion_reason ?? undefined}
                    startedAt={attempt.started_at ?? ""}
                    submittedAt={attempt.submitted_at ?? undefined}
                    attemptedCount={attempt.attempted_count}
                    totalQuestions={attempt.total_questions}
                    unattemptedCount={attempt.unattempted_count}
                    typingStats={attempt.typing_stats}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "round2" && <Round2History userId={userId} />}
      </div>
    </PageContainer>
  );
}
