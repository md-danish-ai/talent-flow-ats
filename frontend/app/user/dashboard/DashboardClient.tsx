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
import { useRouter } from "next/navigation";
import { Typography } from "@components/ui-elements/Typography";
import Link from "next/link";
import { Card } from "@components/ui-cards/Card";
import type { CurrentUser } from "@lib/auth/user-utils";

interface DashboardClientProps {
  user: CurrentUser | null;
  isDetailsComplete: boolean;
}

/**
 * Clean Border Animation Component
 */
function AnimatedBorder({ color, active }: { color: string; active: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="12px"
        ry="12px"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function DashboardClient({
  user,
  isDetailsComplete,
}: DashboardClientProps) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);



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
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } as Transition,
    },
  };

  return (
    <div className="min-h-full bg-slate-50/50 dark:bg-zinc-950/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* PROFESSIONAL Welcome Back Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Avatar */}
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700">
                <User className="h-10 w-10 md:h-12 md:w-12 text-slate-400 dark:text-zinc-500" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-4 border-white dark:border-zinc-900" />
              </div>

              {/* Text Info */}
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <Typography
                    variant="h2"
                    weight="bold"
                    className="text-2xl md:text-3xl"
                  >
                    Welcome, {user?.username || "Candidate"}
                  </Typography>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 w-fit mx-auto md:mx-0">
                    Active
                  </span>
                </div>
                <Typography
                  variant="body1"
                  className="text-slate-500 dark:text-zinc-400"
                >
                  {isDetailsComplete
                    ? "Your profile is fully complete. You can proceed to the assessments."
                    : "Complete your personal details to unlock the interview assessment phase."}
                </Typography>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* Card 1: Personal Details */}
          <motion.div variants={itemVariants}>
            <Link
              href={isDetailsComplete ? "#" : "/user/personal-details"}
              onClick={(event) => isDetailsComplete && event.preventDefault()}
              className={`group relative block h-full ${isDetailsComplete ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              onMouseEnter={() =>
                !isDetailsComplete && setHoveredCard("personal")
              }
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                className={`h-full relative overflow-hidden flex flex-col p-8 md:p-10 border transition-all duration-500 bg-white dark:bg-zinc-900 ${!isDetailsComplete
                  ? "border-slate-200 dark:border-zinc-800 shadow-[0_30px_80px_-15px_rgba(111,86,229,0.12),0_15px_30px_-10px_rgba(111,86,229,0.08)] dark:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_45px_100px_-12px_rgba(111,86,229,0.2)] hover:border-brand-primary/40 hover:-translate-y-2"
                  : "border-slate-100 dark:border-zinc-800/40 opacity-90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]"
                  }`}
              >
                {!isDetailsComplete && (
                  <AnimatedBorder
                    color="var(--color-brand-primary)"
                    active={hoveredCard === "personal"}
                  />
                )}

                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`h-14 w-14 rounded-xl flex items-center justify-center ${!isDetailsComplete
                      ? "bg-brand-primary/5 text-brand-primary"
                      : "bg-slate-50 dark:bg-zinc-800 text-slate-400"
                      }`}
                  >
                    <FileText className="h-7 w-7" />
                  </div>
                  {isDetailsComplete && (
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <Typography
                    variant="h3"
                    weight="bold"
                    className={`mb-2 ${isDetailsComplete && "text-slate-400"}`}
                  >
                    Personal Details
                  </Typography>
                  <Typography
                    variant="body2"
                    className={`leading-relaxed ${!isDetailsComplete
                      ? "text-slate-500 dark:text-zinc-500"
                      : "text-slate-300 dark:text-zinc-600"
                      }`}
                  >
                    {isDetailsComplete
                      ? "Your assessment profile is locked as it has been successfully submitted."
                      : "Update your academic history, work experience, and contact information."}
                  </Typography>
                </div>

                <div
                  className={`mt-auto flex items-center gap-2 font-semibold text-sm transition-all ${!isDetailsComplete
                    ? "text-brand-primary group-hover:gap-3"
                    : "text-slate-300 dark:text-zinc-700 font-medium"
                    }`}
                >
                  {isDetailsComplete ? "Submitted" : "Complete Profile"}
                  {!isDetailsComplete && <ArrowRight className="h-4 w-4" />}
                  {isDetailsComplete && <CheckCircle2 className="h-4 w-4" />}
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Card 2: Interview Test */}
          <motion.div variants={itemVariants}>
            <div
              className="group relative h-full"
              onMouseEnter={() => setHoveredCard("interview")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link
                href={isDetailsComplete ? "/user/interview-test" : "#"}
                onClick={(event) => !isDetailsComplete && event.preventDefault()}
                className={`block h-full ${isDetailsComplete ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <Card
                  className={`h-full relative overflow-hidden flex flex-col p-8 md:p-10 border transition-all duration-500 bg-white dark:bg-zinc-900 ${isDetailsComplete
                    ? "border-slate-200 dark:border-zinc-800 shadow-[0_30px_80px_-15px_rgba(37,99,235,0.12),0_15px_30px_-10px_rgba(37,99,235,0.08)] dark:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_45px_100px_-12px_rgba(37,99,235,0.2)] hover:border-blue-400/40 hover:-translate-y-2"
                    : "border-slate-100 dark:border-zinc-800/40 opacity-90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]"
                    }`}
                >
                  {isDetailsComplete && (
                    <AnimatedBorder
                      color="var(--color-brand-secondary)"
                      active={hoveredCard === "interview"}
                    />
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`h-14 w-14 rounded-xl flex items-center justify-center ${isDetailsComplete
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "bg-slate-50 dark:bg-zinc-800 text-slate-400"
                        }`}
                    >
                      {isDetailsComplete ? (
                        <PlayCircle className="h-7 w-7" />
                      ) : (
                        <Lock className="h-6 w-6" />
                      )}
                    </div>
                  </div>

                  <div className="mb-8">
                    <Typography
                      variant="h3"
                      weight="bold"
                      className={`mb-2 ${!isDetailsComplete && "text-slate-400"}`}
                    >
                      Interview Test
                    </Typography>
                    <Typography
                      variant="body2"
                      className={`leading-relaxed ${isDetailsComplete
                        ? "text-slate-500 dark:text-zinc-500"
                        : "text-slate-300 dark:text-zinc-600"
                        }`}
                    >
                      Technical assessment to evaluate your core engineering and
                      problem-solving skills.
                    </Typography>
                  </div>

                  <div
                    className={`mt-auto flex items-center gap-2 font-semibold text-sm transition-all ${isDetailsComplete
                      ? "text-blue-600 dark:text-blue-400 group-hover:gap-3"
                      : "text-slate-300 dark:text-zinc-700 font-medium"
                      }`}
                  >
                    {isDetailsComplete ? "Start Assessment" : "Locked"}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {!isDetailsComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-500 text-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Profile completion is required to unlock the Interview Test phase.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
