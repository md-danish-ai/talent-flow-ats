"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@components/ui-elements/Typography";
import { CheckCircle, AlertCircle } from "lucide-react";
import { PaperSetup, Classification } from "@types";
import { PaperOverviewCard } from "@components/features/paper-setup/PaperOverviewCard";

interface PaperHeaderCardProps {
  paper: PaperSetup;
  subjects?: Classification[];
}

export function PaperHeaderCard({
  paper,
  subjects = [],
}: PaperHeaderCardProps) {
  const router = useRouter();

  return (
    <PaperOverviewCard
      paper={paper}
      allClassifications={subjects}
      modeLabel="AUTO-ASSIGN"
      modeColor="primary"
      backLabel="Back to Setup"
      onBack={() => router.push(`/admin/paper/setup/detail/${paper.id}`)}
      className="mb-6"
      extraFooter={
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle
              size={16}
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
          <div className="flex items-center gap-2">
            <CheckCircle
              size={16}
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
          <div className="flex items-center gap-2">
            <AlertCircle
              size={16}
              className="text-amber-500"
              strokeWidth={2.5}
            />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-[0.15em] text-[10px] text-amber-500"
            >
              Replaces Current Setup
            </Typography>
          </div>
        </div>
      }
    />
  );
}
