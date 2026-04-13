"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Minus,
  Plus,
  AlertCircle,
  ChevronRight,
  Loader2,
  Wand2,
} from "lucide-react";
import { toast } from "@lib/toast";
import { PaperSubjectConfig } from "@lib/api/papers";
import { Classification } from "@lib/api/classifications";
import { filterQuestionTypesForSubject } from "@lib/utils/exclusivity";

interface SubjectAssignmentCardProps {
  subj: PaperSubjectConfig;
  subjCode: string;
  counts: Record<string, Record<number, number>>;
  subjectReqs: Record<string, Record<number, number>>;
  isCollapsed: boolean;
  currentTotal: number;
  currentMarksTotal: number;
  questionTypes: Classification[];
  paperId: number | string;
  isSaving: boolean;
  subjects: Classification[];
  onToggle: () => void;
  onQtyChange: (
    subjectCode: string,
    typeCode: string,
    marks: number,
    val: number,
  ) => void;
  onAutoAssign: () => void;
}

export function SubjectAssignmentCard({
  subj,
  subjCode,
  counts,
  subjectReqs,
  isCollapsed,
  currentTotal,
  currentMarksTotal,
  questionTypes,
  paperId,
  isSaving,
  subjects,
  onToggle,
  onQtyChange,
  onAutoAssign,
}: SubjectAssignmentCardProps) {
  const router = useRouter();

  const isCountPerfect = currentTotal === subj.question_count;
  const isMarksPerfect = currentMarksTotal === subj.total_marks;
  const isPerfect = isCountPerfect && isMarksPerfect;
  const isTargetReached = currentTotal >= subj.question_count;

  return (
    <MainCard
      onHeaderClick={onToggle}
      title={
        <div className="flex items-center gap-3 group/header">
          <div
            className={`w-1.5 h-6 rounded-full transition-all duration-500 ${isPerfect ? "bg-brand-success shadow-[0_0_10px_rgba(var(--brand-success-rgb),0.5)]" : "bg-brand-primary group-hover/header:h-8"}`}
          />
          <div className="flex flex-col">
            <Typography
              variant="body1"
              weight="black"
              className="text-slate-800 dark:text-white uppercase tracking-tight group-hover/header:text-brand-primary transition-colors"
            >
              {(subj.subject_name || `Subject ${subjCode}`).replace(/_/g, " ")}
            </Typography>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (currentTotal / subj.question_count) * 100)}%`,
                    }}
                    className={`h-full ${isCountPerfect ? "bg-brand-success" : currentTotal > subj.question_count ? "bg-red-500" : "bg-brand-primary"}`}
                  />
                </div>
                <Typography
                  variant="body5"
                  weight="bold"
                  className={`text-[9px] uppercase tracking-widest ${isCountPerfect ? "text-brand-success" : currentTotal > subj.question_count ? "text-red-500" : "text-slate-400"}`}
                >
                  {currentTotal} / {subj.question_count} Qs
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (currentMarksTotal / subj.total_marks) * 100)}%`,
                    }}
                    className={`h-full ${isMarksPerfect ? "bg-blue-500" : currentMarksTotal > subj.total_marks ? "bg-red-500" : "bg-blue-400"}`}
                  />
                </div>
                <Typography
                  variant="body5"
                  weight="bold"
                  className={`text-[9px] uppercase tracking-widest ${isMarksPerfect ? "text-blue-500" : currentMarksTotal > subj.total_marks ? "text-red-500" : "text-slate-400"}`}
                >
                  {currentMarksTotal} / {subj.total_marks} Marks
                </Typography>
              </div>
            </div>
          </div>
        </div>
      }
      action={
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex flex-col items-end px-3 border-r border-border/50">
              <Typography
                variant="body5"
                weight="black"
                className="text-[9px] text-slate-400 uppercase tracking-[0.2em]"
              >
                Target
              </Typography>
              <Typography
                variant="body4"
                weight="black"
                className="text-brand-primary"
              >
                {subj.question_count} Qs
              </Typography>
            </div>
            <div className="flex flex-col items-end px-3">
              <Typography
                variant="body5"
                weight="black"
                className="text-[9px] text-slate-400 uppercase tracking-[0.2em]"
              >
                Weight
              </Typography>
              <Typography
                variant="body4"
                weight="black"
                className="text-blue-500"
              >
                {subj.total_marks} Marks
              </Typography>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={`w-10 h-10 rounded-xl transition-all duration-300 ${isCollapsed ? "bg-slate-100 dark:bg-slate-800" : "bg-brand-primary/10 text-brand-primary"}`}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </Button>
        </div>
      }
      className={`overflow-hidden border-none shadow-2xl transition-all duration-500 ${isPerfect ? "ring-2 ring-brand-success/30 shadow-brand-success/10" : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"}`}
      bodyClassName={isCollapsed ? "p-0" : "p-5"}
    >
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 pb-6"
            >
              {filterQuestionTypesForSubject(
                questionTypes,
                subjCode,
                subjects,
              ).map((type) => {
                const markCounts = counts[type.code] || {};
                const markReqs = subjectReqs[type.code] || {};

                // Get all mark values that have either availability or an existing selection
                const availableMarks = Array.from(
                  new Set([
                    ...Object.keys(markCounts).map(Number),
                    ...Object.keys(markReqs).map(Number),
                  ]),
                ).sort((a, b) => a - b);

                if (availableMarks.length === 0) availableMarks.push(0);

                return (
                  <motion.div
                    key={type.code}
                    variants={{
                      hidden: { y: 10, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className={`relative p-5 rounded-[2rem] border transition-all duration-500 group overflow-hidden ${
                      Object.values(markReqs).some((v) => v > 0)
                        ? "border-brand-primary/50 bg-brand-primary/[0.03] dark:bg-brand-primary/[0.07] ring-1 ring-brand-primary/20"
                        : "border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50"
                    } ${isTargetReached && !Object.values(markReqs).some((v) => v > 0) ? "opacity-40 scale-[0.98]" : "hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/5"}`}
                  >
                    <div className="flex flex-col gap-5 relative z-10">
                      <div className="flex flex-col gap-1">
                        <Typography
                          variant="body5"
                          weight="black"
                          className={`uppercase tracking-[0.15em] text-[8px] transition-colors ${Object.values(markReqs).some((v) => v > 0) ? "text-brand-primary" : "text-slate-400 dark:text-slate-500"}`}
                        >
                          {type.name}
                        </Typography>
                      </div>

                      <div className="space-y-6">
                        {availableMarks.map((mark) => {
                          const availability = markCounts[mark] || 0;
                          const val = markReqs[mark] || 0;
                          const isUsed = val > 0;
                          const isAvailable = availability > 0;

                          return (
                            <div key={mark} className="space-y-3">
                              <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className={`w-1 h-1 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-slate-400"}`}
                                  />
                                  <Typography
                                    variant="body5"
                                    className="text-[10px] text-slate-400 font-medium"
                                  >
                                    {mark} Marks • Availability:{" "}
                                    <span className="font-mono text-slate-600 dark:text-slate-300">
                                      {availability}
                                    </span>
                                  </Typography>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-950/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                                <button
                                  onClick={() =>
                                    onQtyChange(
                                      subjCode,
                                      type.code,
                                      mark,
                                      val - 1,
                                    )
                                  }
                                  disabled={val <= 0}
                                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${val > 0 ? "bg-white dark:bg-slate-800 text-red-500 shadow-sm hover:bg-red-50 active:scale-95" : "text-slate-300 dark:text-slate-700 cursor-not-allowed"}`}
                                >
                                  <Minus size={16} strokeWidth={3} />
                                </button>

                                <div className="flex-1 flex flex-col items-center">
                                  <input
                                    type="number"
                                    min="0"
                                    value={val}
                                    onChange={(e) => {
                                      const newVal =
                                        parseInt(e.target.value) || 0;
                                      const otherTotal = currentTotal - val;
                                      if (
                                        otherTotal + newVal <=
                                        subj.question_count
                                      ) {
                                        onQtyChange(
                                          subjCode,
                                          type.code,
                                          mark,
                                          newVal,
                                        );
                                      } else {
                                        onQtyChange(
                                          subjCode,
                                          type.code,
                                          mark,
                                          subj.question_count - otherTotal,
                                        );
                                        toast.warning(
                                          `Subject target reached! Max ${subj.question_count} questions allowed.`,
                                        );
                                      }
                                    }}
                                    className={`w-full bg-transparent border-none text-center font-mono font-black text-xl outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isUsed ? "text-brand-primary" : "text-slate-500"}`}
                                  />
                                </div>

                                <button
                                  onClick={() =>
                                    onQtyChange(
                                      subjCode,
                                      type.code,
                                      mark,
                                      val + 1,
                                    )
                                  }
                                  disabled={isTargetReached}
                                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${!isTargetReached ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95" : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"}`}
                                >
                                  <Plus size={16} strokeWidth={3} />
                                </button>
                              </div>

                              {isUsed && (
                                <motion.div
                                  initial={{ y: 5, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  className="flex items-center justify-center gap-1.5"
                                >
                                  <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
                                  <Typography
                                    variant="body5"
                                    weight="black"
                                    className="text-[8px] uppercase text-brand-primary tracking-widest"
                                  >
                                    Selection Confirmed
                                  </Typography>
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.2 },
                },
              }}
              className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/10"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-full ${isPerfect ? "bg-brand-success/10 text-brand-success" : "bg-brand-primary/10 text-brand-primary"}`}
                >
                  <AlertCircle size={22} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <Typography
                    variant="body4"
                    weight="black"
                    className="text-slate-700 dark:text-slate-300 uppercase tracking-[0.15em] text-[11px]"
                  >
                    Ready to Process
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-slate-400 text-[11px] mt-0.5"
                  >
                    Click populate to generate questions for this subject
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <Button
                  variant="outline"
                  color="primary"
                  size="lg"
                  animate="scale"
                  onClick={() =>
                    router.push(`/admin/paper/setup/detail/${paperId}`)
                  }
                >
                  <ChevronRight
                    size={16}
                    strokeWidth={3}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                  Redirect Paper
                </Button>

                <Button
                  type="button"
                  onClick={onAutoAssign}
                  color={isPerfect ? "success" : "primary"}
                  disabled={isSaving || !isPerfect}
                  size="lg"
                  animate="scale"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Wand2
                      size={18}
                      strokeWidth={2.5}
                      className="group-hover:rotate-12 transition-transform"
                    />
                  )}
                  <Typography
                    variant="body3"
                    weight="black"
                    className="uppercase tracking-[0.15em] text-[11px] text-white"
                  >
                    {isSaving
                      ? "Saving..."
                      : !isPerfect
                        ? "Incomplete"
                        : "Submit Question"}
                  </Typography>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainCard>
  );
}
