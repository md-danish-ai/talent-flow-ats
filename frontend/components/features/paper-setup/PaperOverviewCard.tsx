"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { PaperSetup, Classification, PaperSubjectConfig } from "@types";
import { classificationsApi } from "@lib/api/classifications";
import {
  ArrowLeft,
  Clock,
  Trophy,
  HelpCircle,
  Layers,
  Target,
} from "lucide-react";

export interface PaperOverviewCardProps {
  paper: PaperSetup;
  allClassifications?: Classification[];
  assignedQuestionsCount?: number;
  backLabel?: string;
  modeLabel?: string;
  modeColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "default"
    | "violet";
  rightCard?: React.ReactNode;
  actions?: React.ReactNode;
  extraFooter?: React.ReactNode;
  onBack?: () => void;
  className?: string;
}

export function PaperOverviewCard({
  paper,
  allClassifications = [],
  assignedQuestionsCount,
  backLabel = "Back to Setup",
  modeLabel,
  modeColor = "secondary",
  rightCard,
  actions,
  extraFooter,
  onBack,
  className = "",
}: PaperOverviewCardProps) {
  const router = useRouter();
  const handleBack = onBack || (() => router.push("/admin/paper/setup"));

  const [fetchedSubjects, setFetchedSubjects] = useState<Classification[]>([]);

  useEffect(() => {
    if (allClassifications.length === 0) {
      let isMounted = true;
      classificationsApi
        .getClassifications({ type: "subject", is_active: true, limit: 100 })
        .then((res) => {
          if (isMounted && res?.data && res.data.length > 0) {
            setFetchedSubjects(res.data);
          }
        })
        .catch(() => {});

      return () => {
        isMounted = false;
      };
    }
  }, [allClassifications.length]);

  // Derived subjects: prefer passed props, fallback to fetched
  const subjects =
    allClassifications.length > 0 ? allClassifications : fetchedSubjects;

  // Ordered subjects list
  const orderedSubjects = [...(paper.subject_ids_data || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const getSubjectName = (subj: PaperSubjectConfig) => {
    if (subj.subject_name) return subj.subject_name;
    const found = subjects.find((s) => s.id === subj.subject_id);
    return found?.name || "Subject";
  };

  const totalQuestions =
    assignedQuestionsCount !== undefined
      ? assignedQuestionsCount
      : (paper.question_id || []).length;

  const totalMarks =
    Number(paper.total_marks || 0) % 1 === 0
      ? Number(paper.total_marks || 0).toString()
      : Number(paper.total_marks || 0).toFixed(1);

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-border/80 shadow-xs p-5 sm:p-6 space-y-5 relative overflow-hidden transition-all",
        STYLE_CONFIG.cardRadius,
        className,
      )}
    >
      {/* Top Action Row: Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            color="primary"
            size="sm"
            animate="scale"
            startIcon={<ArrowLeft size={16} />}
            onClick={handleBack}
          >
            {backLabel}
          </Button>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
            {actions}
          </div>
        )}
      </div>

      {/* Paper Header Row: Title/Description on Left + Mini UI Info Cards on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side: Paper Title, Mode Badge & Description */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2.5">
            <Typography
              variant="h2"
              weight="black"
              className="text-foreground tracking-tight text-2xl sm:text-3xl font-black"
            >
              {paper.paper_name}
            </Typography>
            {modeLabel && (
              <Badge
                variant="fill"
                color={modeColor}
                shape="square"
                className="font-black uppercase text-[10px] tracking-wider"
              >
                {modeLabel}
              </Badge>
            )}
          </div>

          {paper.description && (
            <Typography
              variant="body4"
              className="text-muted-foreground leading-relaxed italic max-w-2xl text-[13px]"
            >
              &quot;{paper.description}&quot;
            </Typography>
          )}
        </div>

        {/* Right Side: Mini UI Cards for Department, Exam Level & Custom Right Card */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Department Card */}
          {paper.department_name && (
            <div className="flex items-center gap-2.5 px-3.5 h-[52px] rounded-md bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs transition-colors">
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers size={14} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Department
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {paper.department_name}
                </span>
              </div>
            </div>
          )}

          {/* Exam Level Card */}
          {paper.test_level_name && (
            <div className="flex items-center gap-2.5 px-3.5 h-[52px] rounded-md bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 shadow-xs transition-colors">
              <div className="w-7 h-7 rounded-md bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Target size={14} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  Exam Level
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {paper.test_level_name}
                </span>
              </div>
            </div>
          )}

          {/* Right Card (e.g. View Mode Indicator in Preview) */}
          {rightCard}
        </div>
      </div>

      {/* Curriculum Subject Badges */}
      {orderedSubjects.length > 0 && (
        <div className="py-3 border-y border-border/60 flex flex-wrap items-center gap-2.5 my-0.5">
          {orderedSubjects.map((s, idx) => {
            const name = getSubjectName(s);
            return (
              <Badge
                key={s.subject_id}
                variant="outline"
                color="violet"
                shape="square"
                className="font-bold text-xs py-1.5 px-3.5 flex items-center gap-1.5 uppercase tracking-wide"
              >
                <span>
                  {idx + 1}. {name}
                </span>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Quick Metrics Bar (4 Rounded Boxes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* 1. Sections */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Layers size={17} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mb-1 truncate">
              Sections
            </div>
            <div className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate">
              {orderedSubjects.length} Subjects
            </div>
          </div>
        </div>

        {/* 2. Assigned Questions */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <HelpCircle size={17} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mb-1 truncate">
              Assigned Questions
            </div>
            <div className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate">
              {totalQuestions} Questions
            </div>
          </div>
        </div>

        {/* 3. Total Marks */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy size={17} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mb-1 truncate">
              Total Marks
            </div>
            <div className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate">
              {totalMarks} Marks
            </div>
          </div>
        </div>

        {/* 4. Duration */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock size={17} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mb-1 truncate">
              Duration
            </div>
            <div className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate">
              {paper.total_time || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {extraFooter && (
        <div className="pt-3 border-t border-border/50">{extraFooter}</div>
      )}
    </div>
  );
}

export function PaperOverviewCardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-border/80 shadow-xs p-5 sm:p-6 space-y-5 relative overflow-hidden",
        STYLE_CONFIG.cardRadius,
        className,
      )}
    >
      {/* Top Action Row Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-8 w-44 rounded-lg" />
      </div>

      {/* Details Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-64 sm:w-80 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-[52px] w-32 rounded-md" />
          <Skeleton className="h-[52px] w-28 rounded-md" />
        </div>
      </div>

      {/* Subjects Badges Skeleton */}
      <div className="py-3 border-y border-border/60 flex flex-wrap items-center gap-2.5 my-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-28 rounded-md" />
        ))}
      </div>

      {/* Quick Metrics Bar Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3"
          >
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-2.5 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
