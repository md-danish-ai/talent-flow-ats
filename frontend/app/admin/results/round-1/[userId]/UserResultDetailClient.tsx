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
import { Round2History } from "./Round2History";
import { UserX, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

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
      <PageContainer>
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

  const ROUND_TABS = [
    {
      id: "round1",
      label: "Round 1 (Technical)",
      icon: <History size={16} />,
      badge: `${totalAttempts} ${totalAttempts === 1 ? "Attempt" : "Attempts"}`,
    },
    {
      id: "round2",
      label: "Round 2 (F2F Interview)",
      icon: <UserCheck size={16} />,
      badge: "F2F",
    },
  ];

  const handleDownloadPdf = async () => {
    const latest = attemptData?.attempts?.[0];
    if (!latest) return;
    setDownloadingPdf(true);
    try {
      const authRow = document.cookie
        .split(";")
        .find((r) => r.trim().startsWith("auth_token="));
      let token = authRow ? authRow.trim().substring("auth_token=".length) : "";
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

      const contentDisposition = res.headers.get("content-disposition");
      let filename = "";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      if (!filename) {
        const username = attemptData?.user?.username || "Candidate";
        const mobile = attemptData?.user?.mobile || "";
        const safeName = username.replace(/\s+/g, "_");
        filename = mobile ? `${safeName}_${mobile}.pdf` : `${safeName}.pdf`;
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
  };

  return (
    <PageContainer className="space-y-8">
      {/* Candidate Overview Card (Designed in PaperOverviewCard Style) */}
      <div
        className={cn(
          "bg-card border border-border/80 shadow-xs p-5 sm:p-6 space-y-5 relative overflow-hidden transition-all",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Top Action Row: Navigation on Left & Actions on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Link href={basePath}>
              <Button
                variant="outline"
                color="primary"
                size="sm"
                animate="scale"
                startIcon={<ArrowLeft size={16} />}
                className="font-bold text-xs"
              >
                Back to User Results
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
            <Button
              variant="outline"
              color="primary"
              size="sm"
              animate="scale"
              className="shadow-sm font-bold text-xs"
              startIcon={
                downloadingPdf ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )
              }
              disabled={!attemptData?.attempts?.length || downloadingPdf}
              onClick={handleDownloadPdf}
            >
              {downloadingPdf ? "Generating PDF..." : "Download Report Sheet"}
            </Button>
            <Link href={basePath}>
              <Button
                color="primary"
                size="sm"
                animate="scale"
                className="shadow-md shadow-brand-primary/20 font-bold text-xs"
              >
                Manage All Results
              </Button>
            </Link>
          </div>
        </div>

        {/* Candidate Profile Row: Identity on Left + 4 Mini UI Info Cards on Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Side: Avatar + Candidate Details */}
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

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Typography
                  variant="h2"
                  weight="black"
                  className="text-foreground tracking-tight text-xl sm:text-2xl font-black leading-tight"
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
                  className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-pointer"
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
                      className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-pointer"
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

          {/* Right Side: 4 Mini UI Cards matching PaperOverviewCard */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Department Card */}
            <div className="flex items-center gap-2.5 px-3.5 h-[52px] rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs transition-colors">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Briefcase size={15} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Department
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {attemptData.user.department || "N/A"}
                </span>
              </div>
            </div>

            {/* Exam Level Card */}
            <div className="flex items-center gap-2.5 px-3.5 h-[52px] rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs transition-colors">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Target size={15} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Level
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {attemptData.user.test_level || "N/A"}
                </span>
              </div>
            </div>

            {/* Attempts Card */}
            <div className="flex items-center gap-2.5 px-3.5 h-[52px] rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers size={15} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Attempts
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {totalAttempts}{" "}
                  <span className="text-[11px] font-normal text-muted-foreground">
                    ({submittedAttempts} Done)
                  </span>
                </span>
              </div>
            </div>

            {/* Last Activity Card */}
            <div className="flex items-center gap-2.5 px-3.5 h-[52px] rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs transition-colors">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Calendar size={15} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Last Activity
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight whitespace-nowrap">
                  {lastAttemptDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation & Attempt History Section */}
      <div className="space-y-6">
        {/* Section Header: Attempt History */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2.5 bg-brand-primary/10 text-brand-primary shadow-sm border border-brand-primary/15",
                STYLE_CONFIG.iconRadius,
              )}
            >
              <History size={20} />
            </div>
            <div>
              <Typography
                variant="h4"
                className="font-bold leading-none text-slate-900 dark:text-white"
              >
                Attempt History
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground mt-1"
              >
                Recent interview attempts, evaluation rounds and scoring
                outcomes.
              </Typography>
            </div>
          </div>
          <Badge
            variant="outline"
            shape="square"
            className="px-3 py-1 font-bold text-xs uppercase tracking-wider"
          >
            {totalAttempts} {totalAttempts === 1 ? "Attempt" : "Attempts"}
          </Badge>
        </div>

        {/* Redesigned Tab Navigation Bar below Attempt History */}
        <div className="flex items-center p-1.5 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-inner backdrop-blur-md w-full sm:w-fit gap-1.5">
          {ROUND_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 select-none outline-none flex-1 sm:flex-initial",
                  isActive
                    ? "text-brand-primary"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeRoundTabIndicator"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-200/80 dark:border-slate-700 z-0"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2.5">
                  <span
                    className={cn(
                      "transition-transform duration-200 shrink-0",
                      isActive && "scale-110 text-brand-primary",
                    )}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors shrink-0",
                        isActive
                          ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                          : "bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700/40",
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "round1" && (
          <div>
            {attemptData.attempts.length === 0 ? (
              <EmptyState
                variant="database"
                title="No attempts found"
                description="This candidate has not started any interview attempts yet. Attempts will appear here once they begin."
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
