"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import {
  ArrowLeft,
  Wand2,
  Layers,
  BookOpen,
  Trophy,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { PaperSetup } from "@types";
import { StatsCard } from "./StatsCard";

interface PaperHeaderCardProps {
  paper: PaperSetup;
}

export function PaperHeaderCard({ paper }: PaperHeaderCardProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col gap-8 mb-6 p-6 md:p-6 lg:px-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-all",
        STYLE_CONFIG.cardRadius,
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/50 pb-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.back()}
            className={cn(
              STYLE_CONFIG.iconRadius,
              "hover:bg-brand-primary/10 hover:text-brand-primary shrink-0",
            )}
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex flex-col space-y-1.5">
            <Typography
              variant="h3"
              weight="black"
              className="tracking-tight text-slate-900 dark:text-white text-2xl lg:text-3xl"
            >
              Smart Auto-Setup: {paper.paper_name}
            </Typography>
            <Typography
              variant="body3"
              className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-base"
            >
              Define question requirements for each subject. Our engine will
              intelligently select the best questions from the bank.
            </Typography>
          </div>
        </div>

        <div
          className={cn(
            "flex bg-brand-primary/[0.08] dark:bg-brand-primary/10 border border-brand-primary/20 px-6 py-4 gap-3.5 items-center shrink-0",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <Wand2 size={24} className="text-brand-primary" strokeWidth={2.5} />
          <div className="flex flex-col gap-0.5">
            <Typography
              variant="body5"
              weight="black"
              className="text-brand-primary uppercase tracking-[0.15em] text-[10px]"
            >
              Test Level
            </Typography>
            <Typography
              variant="body4"
              weight="bold"
              className="text-slate-800 dark:text-slate-200"
            >
              {paper.test_level_name} Level
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Layers className="text-emerald-600" />}
          label="Department"
          value={paper.department_name || "N/A"}
          bgColor="bg-emerald-50/30 dark:bg-emerald-500/5"
          borderColor="border-emerald-500/10"
          labelColor="text-emerald-600/60"
        />
        <StatsCard
          icon={<BookOpen className="text-blue-600" />}
          label="Paper Name"
          value={paper.paper_name}
          bgColor="bg-blue-50/30 dark:bg-blue-500/5"
          borderColor="border-blue-500/10"
          labelColor="text-blue-600/60"
        />
        <StatsCard
          icon={<Trophy className="text-amber-600" />}
          label="Total Marks"
          value={`${Number(paper.total_marks).toFixed(2)} pts`}
          bgColor="bg-amber-50/30 dark:bg-amber-500/5"
          borderColor="border-amber-500/10"
          labelColor="text-amber-600/60"
        />
        <StatsCard
          icon={<Clock className="text-brand-primary" />}
          label="Duration"
          value={paper.total_time || "N/A"}
          bgColor="bg-brand-primary/5 dark:bg-brand-primary/10"
          borderColor="border-brand-primary/10"
          labelColor="text-brand-primary/60"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-2">
        <div
          className={cn(
            "md:col-span-8 p-6 bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 relative group/desc transition-all duration-300 hover:border-brand-primary/20",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div
            className={cn(
              "absolute -top-3 left-6 px-3 py-1 bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm z-10",
              STYLE_CONFIG.badgeRadius,
            )}
          >
            <FileText size={12} className="text-brand-primary" />
            <Typography
              variant="body5"
              weight="black"
              className="text-muted-foreground uppercase tracking-widest text-[9px]"
            >
              Description of Paper
            </Typography>
          </div>
          <Typography
            variant="body4"
            className="leading-relaxed text-foreground/70 font-medium italic mt-2"
          >
            &quot;
            {paper.description ||
              "Define paper structure, allocate marks, and set timing for a new assessment."}
            &quot;
          </Typography>
        </div>

        <div
          className={cn(
            "md:col-span-4 p-6 bg-brand-primary/[0.03] border border-brand-primary/10 flex flex-col justify-center items-center text-center relative overflow-hidden group/level",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
            <Layers size={80} />
          </div>
          <Typography
            variant="body5"
            weight="black"
            className="text-brand-primary/60 uppercase tracking-[0.2em] mb-1 z-10"
          >
            Test Level
          </Typography>
          <Typography
            variant="h2"
            weight="black"
            className="text-slate-900 dark:text-slate-100 z-10"
          >
            {paper.test_level_name || "General"}
          </Typography>
        </div>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-12 gap-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-2">
        <div className="flex items-center gap-2.5">
          <CheckCircle
            size={18}
            className="text-brand-success"
            strokeWidth={2.5}
          />
          <Typography
            variant="body5"
            weight="black"
            className="uppercase tracking-[0.15em] text-[10px] text-slate-500 dark:text-slate-400"
          >
            Randomized Selection
          </Typography>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckCircle
            size={18}
            className="text-brand-success"
            strokeWidth={2.5}
          />
          <Typography
            variant="body5"
            weight="black"
            className="uppercase tracking-[0.15em] text-[10px] text-slate-500 dark:text-slate-400"
          >
            Instant Population
          </Typography>
        </div>
        <div className="flex items-center gap-2.5">
          <AlertCircle size={18} className="text-amber-500" strokeWidth={2.5} />
          <Typography
            variant="body5"
            weight="black"
            className="uppercase tracking-[0.15em] text-[10px] text-amber-500"
          >
            Replaces Current Setup
          </Typography>
        </div>
      </div>
    </div>
  );
}
