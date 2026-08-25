"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  History,
  User,
  UserCheck,
  Download,
  Loader2,
  Calendar,
  Layers,
  Briefcase,
  Target,
  Copy,
  Mail,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
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

  if (attemptData) {
    console.log("DEBUG - is_active value:", attemptData.user.is_active);
    console.log("DEBUG - is_active type:", typeof attemptData.user.is_active);
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

                const contentDisposition = res.headers.get(
                  "content-disposition",
                );
                let filename = "";
                if (contentDisposition) {
                  const match = contentDisposition.match(
                    /filename=["']?([^"';]+)["']?/i,
                  );
                  if (match && match[1]) {
                    filename = match[1];
                  }
                }

                if (!filename) {
                  const username = attemptData?.user?.username || "Candidate";
                  const mobile = attemptData?.user?.mobile || "";
                  const safeName = username.replace(/\s+/g, "_");
                  filename = mobile
                    ? `${safeName}_${mobile}.pdf`
                    : `${safeName}.pdf`;
                }

                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
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

      {/* User Information Profile Card - Compact & Space Efficient */}
      <div
        className={cn(
          "bg-card border border-border/70 p-5 md:p-6 shadow-sm space-y-4",
          STYLE_CONFIG.cardRadius,
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar + Candidate Details */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-14 w-14 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xl shadow-inner">
                {attemptData.user.username?.charAt(0).toUpperCase() || (
                  <User size={24} />
                )}
              </div>
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
                  attemptData.user.is_active === false
                    ? "bg-rose-500"
                    : "bg-emerald-500",
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Typography
                  variant="h3"
                  className="font-bold text-foreground text-lg sm:text-xl"
                >
                  {attemptData.user.username}
                </Typography>
                {attemptData.user.is_active === false ? (
                  <Badge
                    variant="outline"
                    color="error"
                    shape="square"
                    className="text-[10px] font-bold"
                  >
                    DEACTIVATED
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    color="success"
                    shape="square"
                    className="text-[10px] font-bold"
                  >
                    ACTIVE
                  </Badge>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40">
                  ID: #{userId}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium pt-0.5">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(attemptData.user.mobile);
                    toast.success("Mobile number copied!");
                  }}
                  className="flex items-center gap-1.5 hover:text-brand-primary transition-colors"
                  title="Click to copy mobile"
                >
                  <Smartphone size={13} className="text-orange-500" />
                  <span>{attemptData.user.mobile}</span>
                  <Copy size={11} className="opacity-50" />
                </button>

                {attemptData.user.email && (
                  <>
                    <span className="text-border">•</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          attemptData.user.email || "",
                        );
                        toast.success("Email address copied!");
                      }}
                      className="flex items-center gap-1.5 hover:text-brand-primary transition-colors"
                      title="Click to copy email"
                    >
                      <Mail size={13} className="text-brand-primary" />
                      <span>{attemptData.user.email}</span>
                      <Copy size={11} className="opacity-50" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: 4 Metadata Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2 text-xs">
            {/* Department */}
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/5 border border-orange-500/20 rounded-xl">
              <Briefcase
                size={15}
                className="text-orange-600 dark:text-orange-400 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Department
                </span>
                <span className="font-bold text-foreground truncate max-w-[120px] block">
                  {attemptData.user.department || "N/A"}
                </span>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <Target
                size={15}
                className="text-blue-600 dark:text-blue-400 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Level
                </span>
                <span className="font-bold text-foreground truncate max-w-[100px] block">
                  {attemptData.user.test_level || "N/A"}
                </span>
              </div>
            </div>

            {/* Sessions */}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <Layers
                size={15}
                className="text-emerald-600 dark:text-emerald-400 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Sessions
                </span>
                <span className="font-bold text-foreground">
                  {totalAttempts}{" "}
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    ({submittedAttempts} Done)
                  </span>
                </span>
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border border-border/50 rounded-xl">
              <Calendar size={15} className="text-brand-primary shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Last Activity
                </span>
                <span className="font-bold text-foreground whitespace-nowrap">
                  {lastAttemptDate}
                </span>
              </div>
            </div>
          </div>
        </div>
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
                    activeDurationSeconds={attempt.active_duration_seconds}
                    overallGrade={attempt.overall_grade}
                    interviewDate={attempt.started_at}
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
