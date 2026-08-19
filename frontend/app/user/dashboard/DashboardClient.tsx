"use client";

import React, { useState } from "react";
import { motion, Variants, Transition } from "framer-motion";
import {
  User,
  FileText,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  HelpCircle,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import Link from "next/link";
import { cn } from "@lib/utils";
import type { CurrentUser } from "@lib/auth/user-utils";
import { useUserTour } from "@lib/tour";

interface DashboardClientProps {
  user: CurrentUser | null;
  isDetailsComplete: boolean;
  isInterviewSubmitted: boolean;
  activeInterviewStatus?: {
    has_attempt: boolean;
    status: string | null;
    is_expired: boolean;
  };
}

/**
 * Animated SVG Border on Card Hover
 */
function AnimatedBorder({ color, active }: { color: string; active: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="24px"
        ry="24px"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function DashboardClient({
  user,
  isDetailsComplete,
  isInterviewSubmitted,
  activeInterviewStatus,
}: DashboardClientProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { runTourManually } = useUserTour({
    user,
    isDetailsComplete,
    isInterviewSubmitted,
    activeInterviewStatus,
  });

  const requiresInterview = user?.requires_interview !== false;

  const activeStatus = activeInterviewStatus?.status;
  const isExpired = activeInterviewStatus?.is_expired;

  // Enabled if details are complete AND (no attempt yet OR attempt is started and not expired)
  // AND NOT already submitted
  const isInterviewEnabled =
    isDetailsComplete &&
    !isInterviewSubmitted &&
    (!activeInterviewStatus?.has_attempt ||
      (activeStatus === "started" && !isExpired));

  const isResuming =
    activeInterviewStatus?.has_attempt &&
    activeStatus === "started" &&
    !isExpired;

  const candidateFirstName = user?.username?.split(" ")[0] || "Candidate";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } as Transition,
    },
  };

  return (
    <div className="w-full min-h-full py-2 px-2 sm:px-4 lg:px-6">
      <div className="w-full space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div id="user-dashboard-header" className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                Candidate Portal
              </span>
            </div>
            <Typography
              variant="h1"
              weight="bold"
              className="text-2xl sm:text-3xl text-slate-900 dark:text-zinc-100 font-bold tracking-tight"
            >
              Welcome, {candidateFirstName}!
            </Typography>
            <Typography
              variant="body2"
              className="text-slate-600 dark:text-zinc-400 font-normal text-sm"
            >
              Follow the 3 simple steps below to complete your application
              process.
            </Typography>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Quick Guide Tour Button */}
            <button
              id="tour-help-trigger"
              type="button"
              onClick={() => runTourManually()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700/60 text-slate-700 dark:text-zinc-200 font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer active:scale-95"
              title="Quick Guide Walkthrough"
            >
              <HelpCircle className="h-4 w-4 text-brand-primary" />
              <span>Quick Guide</span>
            </button>
          </div>
        </div>

        {/* Assessment Submitted Success Alert Banner */}
        {requiresInterview && isInterviewSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-start sm:items-center gap-4 shadow-sm"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <Typography
                variant="h4"
                weight="bold"
                className="text-emerald-900 dark:text-emerald-300 text-base sm:text-lg font-bold"
              >
                Assessment Submitted Successfully!
              </Typography>
              <Typography
                variant="body2"
                className="text-emerald-700 dark:text-emerald-400/90 text-sm font-normal"
              >
                Your technical test responses have been logged. Our recruitment
                team is currently reviewing your profile and will update you on
                the next steps.
              </Typography>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shrink-0">
              <Clock className="h-3.5 w-3.5" />
              Under Review
            </div>
          </motion.div>
        )}

        {/* Step Cards Grid - Full View (1fr per card) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid grid-cols-1 gap-6 ${
            !requiresInterview
              ? "md:grid-cols-2"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {/* ============================================================
              STEP 1: Personal Details Form
              ============================================================ */}
          <motion.div id="step-card-personal-details" variants={itemVariants}>
            <div
              className={cn(
                "h-full relative group",
                !isDetailsComplete ? "cursor-pointer" : "cursor-not-allowed",
              )}
              onMouseEnter={() =>
                !isDetailsComplete && setHoveredCard("personal")
              }
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={cn(
                  "h-full relative overflow-hidden flex flex-col p-6 sm:p-7 rounded-3xl transition-all duration-300 border bg-card dark:bg-zinc-900/90 shadow-sm",
                  !isDetailsComplete
                    ? "border-emerald-500/50 dark:border-emerald-500/60 shadow-md shadow-emerald-500/10 hover:shadow-xl dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "border-slate-200/90 dark:border-zinc-800",
                )}
              >
                {/* Animated Border on Hover */}
                <AnimatedBorder
                  color="#10b981"
                  active={hoveredCard === "personal"}
                />

                {/* Step Header & Badge */}
                <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                    Step 1
                  </span>
                  {isDetailsComplete ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 animate-pulse">
                      Action Required
                    </span>
                  )}
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div
                    className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300",
                      !isDetailsComplete
                        ? "bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-500/30 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-105"
                        : "bg-emerald-500/10 dark:bg-emerald-950/50 border-emerald-500/20 dark:border-emerald-700/40 text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {isDetailsComplete ? (
                      <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <Typography
                      variant="h3"
                      weight="bold"
                      className="text-lg sm:text-xl text-slate-900 dark:text-zinc-100 font-bold"
                    >
                      Personal Details
                    </Typography>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                      Personal, Education & Experience
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 font-normal relative z-10">
                  {isDetailsComplete
                    ? "Your personal information, educational background, and work history have been saved and locked."
                    : "Fill out your personal information, contact details, educational background, and work experience."}
                </p>

                {/* Card Action CTA */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                  {!isDetailsComplete ? (
                    <Link
                      href="/user/personal-details"
                      className="w-full block"
                    >
                      <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] cursor-pointer">
                        <span>Fill Application Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-medium text-sm cursor-not-allowed"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Details Submitted & Locked</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================
              STEP 2: Review Submitted Application Profile (Primary Color)
              ============================================================ */}
          <motion.div id="step-card-profile" variants={itemVariants}>
            <div
              className={cn(
                "h-full relative group",
                isDetailsComplete ? "cursor-pointer" : "cursor-not-allowed",
              )}
              onMouseEnter={() =>
                isDetailsComplete && setHoveredCard("identity")
              }
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={cn(
                  "h-full relative overflow-hidden flex flex-col p-6 sm:p-7 rounded-3xl transition-all duration-300 border bg-card dark:bg-zinc-900/90 shadow-sm",
                  isDetailsComplete
                    ? "border-brand-primary/40 dark:border-brand-primary/50 shadow-md hover:border-brand-primary hover:shadow-xl dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:dark:border-brand-primary/90"
                    : "border-slate-200/90 dark:border-zinc-800 opacity-60 cursor-not-allowed",
                )}
              >
                {/* Animated Border on Hover (Primary Brand Color) */}
                <AnimatedBorder
                  color="#f43f5e"
                  active={hoveredCard === "identity"}
                />

                {/* Step Header & Badge */}
                <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                    Step 2
                  </span>
                  {isDetailsComplete ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/15 dark:bg-brand-primary/25 text-brand-primary dark:text-rose-300 border border-brand-primary/30 dark:border-brand-primary/50">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>
                  )}
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div
                    className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105",
                      isDetailsComplete
                        ? "bg-brand-primary/10 dark:bg-brand-primary/20 border-brand-primary/30 dark:border-brand-primary/50 text-brand-primary dark:text-rose-400"
                        : "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500",
                    )}
                  >
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <Typography
                      variant="h3"
                      weight="bold"
                      className="text-lg sm:text-xl text-slate-900 dark:text-zinc-100 font-bold"
                    >
                      Review Profile
                    </Typography>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                      View Submitted Information
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 font-normal relative z-10">
                  {isDetailsComplete
                    ? "Cross-check and review your submitted candidate details, education, experience, and profile summary anytime."
                    : "This section unlocks after you submit your Personal Details form in Step 1."}
                </p>

                {/* Card Action CTA */}
                <div
                  id="step-submission-button"
                  className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800/80 relative z-10"
                >
                  {isDetailsComplete ? (
                    <Link href="/user/profile" className="w-full block">
                      <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-brand-primary/40 dark:border-brand-primary/60 hover:border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 hover:bg-brand-primary/20 dark:hover:bg-brand-primary/35 text-brand-primary dark:text-rose-200 font-bold text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer">
                        <span>View Submitted Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-medium text-sm cursor-not-allowed"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Locked (Complete Step 1)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================
              STEP 3: Online Assessment (Interview Test)
              ============================================================ */}
          {requiresInterview && (
            <motion.div id="step-card-interview-test" variants={itemVariants}>
              <div
                className={cn(
                  "h-full relative group",
                  isInterviewEnabled ? "cursor-pointer" : "cursor-not-allowed",
                )}
                onMouseEnter={() =>
                  isInterviewEnabled && setHoveredCard("interview")
                }
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={cn(
                    "h-full relative overflow-hidden flex flex-col p-6 sm:p-7 rounded-3xl transition-all duration-300 border bg-card dark:bg-zinc-900/90 shadow-sm",
                    isInterviewEnabled
                      ? "border-blue-500/40 dark:border-blue-500/60 shadow-md shadow-blue-500/10 hover:shadow-xl dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                      : "border-slate-200/90 dark:border-zinc-800",
                  )}
                >
                  {/* Animated Border on Hover */}
                  <AnimatedBorder
                    color="#3b82f6"
                    active={hoveredCard === "interview"}
                  />

                  {/* Step Header & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
                      Step 3
                    </span>
                    {isInterviewSubmitted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    ) : isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
                        Expired
                      </span>
                    ) : isResuming ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 animate-pulse">
                        In Progress
                      </span>
                    ) : isInterviewEnabled ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping inline-block" />
                        Ready to Start
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105",
                        isInterviewSubmitted
                          ? "bg-emerald-500/10 dark:bg-emerald-950/50 border-emerald-500/20 dark:border-emerald-700/40 text-emerald-600 dark:text-emerald-400"
                          : isInterviewEnabled
                            ? "bg-blue-500/10 dark:bg-blue-950/60 border-blue-500/30 dark:border-blue-700/60 text-blue-600 dark:text-blue-400"
                            : "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500",
                      )}
                    >
                      {isInterviewSubmitted ? (
                        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <PlayCircle className="h-7 w-7" />
                      )}
                    </div>
                    <div>
                      <Typography
                        variant="h3"
                        weight="bold"
                        className="text-lg sm:text-xl text-slate-900 dark:text-zinc-100 font-bold"
                      >
                        Online Assessment
                      </Typography>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                        Technical Evaluation
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 font-normal relative z-10">
                    {isInterviewSubmitted
                      ? "You have successfully completed and submitted your online assessment."
                      : isExpired
                        ? "The assessment time has expired. Please reach out to recruitment for assistance."
                        : isResuming
                          ? "You have an ongoing test session. Click below to resume your assessment."
                          : isDetailsComplete
                            ? "Your assessment is ready! Click below to enter the test room and start your evaluation."
                            : "Complete your Personal Details (Step 1) to unlock this online assessment."}
                  </p>

                  {/* Card Action CTA */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
                    {isInterviewEnabled ? (
                      <Link
                        href="/user/interview-test"
                        className="w-full block"
                      >
                        <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer">
                          <span>
                            {isResuming
                              ? "Resume Assessment"
                              : "Start Assessment"}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    ) : isInterviewSubmitted ? (
                      <button
                        disabled
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-medium text-sm cursor-not-allowed"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Assessment Submitted & Locked</span>
                      </button>
                    ) : isExpired ? (
                      <div className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 font-medium text-sm">
                        <Lock className="h-4 w-4" />
                        <span>Assessment Closed</span>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-medium text-sm cursor-not-allowed"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Locked (Complete Step 1)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Helper Callout */}
        {!isDetailsComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 text-xs sm:text-sm font-medium shadow-sm"
          >
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Next Step:</strong> Please complete your{" "}
              <strong>Personal Details (Step 1)</strong> to unlock your online
              assessment.
            </span>
          </motion.div>
        )}

        {isDetailsComplete && !isInterviewSubmitted && requiresInterview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/30 text-blue-800 dark:text-blue-400 text-xs sm:text-sm font-medium shadow-sm"
          >
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Great job!</strong> Your personal details are submitted.
              You are ready to start your{" "}
              <strong>Online Assessment (Step 3)</strong>.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
