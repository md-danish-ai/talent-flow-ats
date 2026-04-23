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
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import Link from "next/link";
import { Card } from "@components/ui-cards/Card";
import type { CurrentUser } from "@lib/auth/user-utils";

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
 * Clean Border Animation Component
 */
function AnimatedBorder({ color, active }: { color: string; active: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="46px"
        ry="46px"
        fill="none"
        stroke={color}
        strokeWidth="6"
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
  const isDecommissioned =
    isInterviewSubmitted ||
    (activeInterviewStatus?.has_attempt && isExpired) ||
    (activeStatus && activeStatus !== "started");

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } as Transition,
    },
  };

  return (
    <div className="min-h-screen dark:bg-[radial-gradient(circle_at_top_right,_rgba(39,39,42,0.1),_transparent_40%)] py-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <Typography
              variant="h1"
              weight="black"
              className="tracking-tighter uppercase italic text-4xl leading-none text-slate-900 dark:text-zinc-100"
            >
              Talent Dashboard
            </Typography>
            <Typography
              variant="body2"
              className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-[10px]"
            >
              Central Command / Application Lifecycle
            </Typography>
          </div>
          <div className="h-0.5 flex-1 mx-12 bg-slate-200/50 dark:bg-zinc-800/30 hidden lg:block mb-5" />
        </div>

        {/* Interview Status Alert */}
        {isInterviewSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-6 relative overflow-hidden group shadow-sm shadow-emerald-500/5"
          >
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="flex-1 space-y-1">
              <Typography
                variant="h4"
                weight="black"
                className="text-emerald-950 dark:text-emerald-400 tracking-tighter uppercase italic leading-none"
              >
                Mission Accomplished
              </Typography>
              <Typography
                variant="body2"
                className="text-emerald-700/80 dark:text-zinc-500 font-medium leading-tight max-w-3xl"
              >
                Your technical assessment has been successfully logged. Our
                recruitment core is now analyzing your performance.
              </Typography>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 animate-pulse" />
              <Typography
                variant="body5"
                weight="black"
                className="text-emerald-600 uppercase tracking-tighter text-[9px]"
              >
                Analysis In Progress
              </Typography>
            </div>
          </motion.div>
        )}

        {/* Action Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {/* Card 1: Candidate Identity */}
          <motion.div variants={itemVariants}>
            <div
              className="h-full relative group"
              onMouseEnter={() => setHoveredCard("identity")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="h-full bg-white dark:bg-zinc-800/30 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800/50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] dark:ring-1 dark:ring-white/10 p-12 flex flex-col items-center text-center relative overflow-hidden transition-all duration-700 hover:border-brand-primary/30">
                <AnimatedBorder
                  color="#f43f5e"
                  active={hoveredCard === "identity"}
                />

                <div className="absolute -top-12 -right-12 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity rotate-12 -z-0 pointer-events-none">
                  <User size={240} strokeWidth={1} />
                </div>

                <div className="relative h-20 w-20 rounded-3xl bg-slate-50 dark:bg-zinc-950 flex items-center justify-center border-2 border-slate-200 dark:border-zinc-800 mb-10 shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <User className="h-10 w-10 text-slate-400 dark:text-zinc-600" />
                  {isDetailsComplete && (
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 border-4 border-white dark:border-zinc-900 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center z-10">
                      <CheckCircle2 className="h-4 w-4 text-white animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3 mb-6 relative z-10">
                  <Typography
                    variant="h3"
                    weight="black"
                    className="text-2xl tracking-tighter uppercase italic"
                  >
                    {user?.username?.split(" ")[0] || "Candidate"}
                  </Typography>
                  <div className="px-4 py-1.5 rounded-full bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20">
                    <Typography
                      variant="body5"
                      weight="black"
                      className="text-brand-primary uppercase tracking-widest text-[9px]"
                    >
                      Operational Profile
                    </Typography>
                  </div>
                </div>

                <Typography
                  variant="body2"
                  className="text-slate-500 dark:text-zinc-500 line-clamp-3 mb-10 leading-relaxed font-medium"
                >
                  {isDetailsComplete
                    ? isInterviewSubmitted
                      ? "Status: Deployed. Assessment archived for review. No pending mission."
                      : "Status: Unlocked. Profile verification complete. Assessment phase pending."
                    : "Status: Restricted. Supplemental data required to authorize assessment phase."}
                </Typography>

                {isDetailsComplete && (
                  <Link
                    href="/user/profile"
                    className="w-full relative z-10 mb-10"
                  >
                    <button className="w-full h-14 flex items-center justify-center gap-3 rounded-[1.2rem] border-2 border-brand-primary text-brand-primary font-black text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-brand-primary/10">
                      Submission Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                )}

                <div className="mt-auto w-full relative z-10">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <Typography
                      variant="body5"
                      weight="black"
                      className="text-slate-400 uppercase tracking-widest text-[9px]"
                    >
                      Completion Level
                    </Typography>
                    <Typography
                      variant="body5"
                      weight="black"
                      className="text-brand-primary uppercase tracking-widest text-[9px]"
                    >
                      {isDetailsComplete ? "100%" : "30%"}
                    </Typography>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-slate-200/50 dark:border-zinc-800/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isDetailsComplete ? "100%" : "30%" }}
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Card 2: Personal Dossier */}
          <motion.div variants={itemVariants}>
            <Link
              href={isDetailsComplete ? "#" : "/user/personal-details"}
              onClick={(event) => isDetailsComplete && event.preventDefault()}
              className={`group relative block h-full ${
                isDetailsComplete ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onMouseEnter={() => setHoveredCard("personal")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                className={`h-full relative overflow-hidden flex flex-col p-12 border transition-all duration-700 rounded-[3rem] bg-white dark:bg-zinc-800/30 backdrop-blur-2xl ${
                  !isDetailsComplete
                    ? "border-slate-200 dark:border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] dark:ring-1 dark:ring-white/10 hover:shadow-[0_45px_100px_rgba(244,63,94,0.1)] dark:hover:shadow-[0_45px_100px_rgba(0,0,0,0.73)] hover:border-emerald-500/40 hover:-translate-y-2"
                    : "border-slate-100 dark:border-zinc-800/40 opacity-90 grayscale-[0.2]"
                }`}
              >
                <AnimatedBorder
                  color="#10b981"
                  active={hoveredCard === "personal"}
                />

                <div className="absolute -top-12 -right-12 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity rotate-6 -z-0 pointer-events-none">
                  <FileText size={240} strokeWidth={1} />
                </div>

                <div className="flex items-start justify-between mb-10 relative z-10">
                  <div
                    className={`h-20 w-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
                      !isDetailsComplete
                        ? "bg-brand-primary/5 border-brand-primary/10 text-brand-primary group-hover:scale-110 shadow-inner"
                        : "bg-slate-50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 text-slate-300"
                    }`}
                  >
                    <FileText className="h-10 w-10" />
                  </div>
                  {isDetailsComplete && (
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] relative">
                      <CheckCircle2 className="h-5 w-5 animate-pulse" />
                      <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/40 animate-[ping_2s_infinite]" />
                    </div>
                  )}
                </div>

                <div className="mb-10 relative z-10">
                  <Typography
                    variant="h3"
                    weight="black"
                    className={`mb-3 text-2xl tracking-tighter uppercase italic ${isDetailsComplete ? "text-slate-400 dark:text-zinc-600" : "text-slate-900 dark:text-white"}`}
                  >
                    Personal Details
                  </Typography>
                  <Typography
                    variant="body2"
                    className={`leading-relaxed font-medium line-clamp-4 ${
                      !isDetailsComplete
                        ? "text-slate-500 dark:text-zinc-500"
                        : "text-slate-300 dark:text-zinc-700"
                    }`}
                  >
                    {isDetailsComplete
                      ? "Your operational data is now locked. No further modifications allowed after clearance."
                      : "Initialize your academy record, professional trail, and contact matrix to gain clearance."}
                  </Typography>
                </div>

                <div
                  className={`mt-auto h-14 flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all relative z-10 ${
                    !isDetailsComplete
                      ? "text-brand-primary group-hover:translate-x-2"
                      : "text-slate-300 dark:text-zinc-800"
                  }`}
                >
                  {isDetailsComplete ? "Cleared" : "Authorize Data"}
                  {!isDetailsComplete && <ArrowRight className="h-4 w-4" />}
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Card 3: Combat/Interview Test */}
          <motion.div variants={itemVariants}>
            <div
              className={`group relative h-full rounded-[3rem] transition-all duration-700 ${!isInterviewEnabled && "opacity-80"}`}
              onMouseEnter={() => setHoveredCard("interview")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link
                href={isInterviewEnabled ? "/user/interview-test" : "#"}
                onClick={(event) =>
                  !isInterviewEnabled && event.preventDefault()
                }
                className={`block h-full ${isInterviewEnabled ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <Card
                  className={`h-full relative overflow-hidden flex flex-col p-12 border transition-all duration-700 rounded-[3rem] bg-white dark:bg-zinc-800/30 backdrop-blur-2xl ${
                    isInterviewEnabled
                      ? "border-slate-200 dark:border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] dark:ring-1 dark:ring-white/10 hover:shadow-[0_45px_100px_rgba(37,99,235,0.12)] dark:hover:shadow-[0_45px_100px_rgba(0,0,0,0.73)] hover:border-blue-400/40 hover:-translate-y-2"
                      : "border-slate-100 dark:border-zinc-800/40 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <AnimatedBorder
                    color="#3b82f6"
                    active={hoveredCard === "interview"}
                  />

                  <div className="absolute -top-12 -right-12 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity rotate-12 -z-0 pointer-events-none">
                    <PlayCircle size={240} strokeWidth={1} />
                  </div>

                  <div className="flex items-start justify-between mb-10 relative z-10">
                    <div
                      className={`h-20 w-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
                        isInterviewEnabled
                          ? "bg-blue-50 dark:bg-blue-900/10 border-blue-400/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 shadow-inner"
                          : "bg-slate-50 dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 text-slate-300"
                      }`}
                    >
                      {isDecommissioned ? (
                        <CheckCircle2
                          className={`h-10 w-10 ${isInterviewSubmitted ? "text-emerald-500" : "text-slate-400"}`}
                        />
                      ) : (
                        <PlayCircle className="h-10 w-10" />
                      )}
                    </div>
                    {isInterviewSubmitted && (
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-white dark:border-zinc-900 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] relative">
                        <CheckCircle2 className="h-5 w-5 animate-pulse" />
                        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/40 animate-[ping_2s_infinite]" />
                      </div>
                    )}
                    {!isInterviewEnabled && !isInterviewSubmitted && (
                      <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-zinc-950 border-2 border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-300">
                        <Lock className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="mb-10 relative z-10">
                    <Typography
                      variant="h3"
                      weight="black"
                      className={`tracking-tight uppercase italic ${
                        !isInterviewEnabled
                          ? "text-slate-400 dark:text-zinc-600"
                          : "text-slate-900 dark:text-zinc-100"
                      }`}
                    >
                      {isDecommissioned
                        ? "Decommissioned"
                        : isResuming
                          ? "Resume Phase"
                          : "Initiate Phase"}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={`leading-relaxed font-medium line-clamp-4 ${
                        isInterviewEnabled
                          ? "text-slate-500 dark:text-zinc-500"
                          : "text-slate-300 dark:text-zinc-700"
                      }`}
                    >
                      {isInterviewSubmitted
                        ? "Interview successfully completed and processed."
                        : isExpired
                          ? "Interview time has expired. Participation closed."
                          : isResuming
                            ? "An active session exists. Resume your core assessment."
                            : "Standard competency evaluation protocols."}
                    </Typography>
                  </div>

                  <div
                    className={`mt-auto h-14 flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all relative z-10 ${
                      isInterviewEnabled
                        ? "text-blue-600 dark:text-blue-400 group-hover:translate-x-2"
                        : "text-slate-300 dark:text-zinc-800"
                    }`}
                  >
                    {isInterviewSubmitted
                      ? "Decommissioned"
                      : isDetailsComplete
                        ? "Initiate Phase"
                        : "Awaiting Clearance"}
                    {isInterviewEnabled && <ArrowRight className="h-4 w-4" />}
                    {isInterviewSubmitted && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </div>
                </Card>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {!isDetailsComplete && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center gap-4 px-6 py-4 rounded-2xl bg-amber-50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 text-amber-700 dark:text-amber-500 text-xs font-black uppercase tracking-widest"
          >
            <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Lock className="h-3 w-3" />
            </div>
            <span>
              Clearance Alert: Complete your profile to authorize the core
              assessment phase.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
