"use client";

import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Question } from "@types";
import { User, Briefcase, Globe, Mail } from "lucide-react";

interface LeadGenerationQuestionViewProps {
  question: Question;
  showAnswers?: boolean;
}

export const LeadGenerationQuestionView: React.FC<
  LeadGenerationQuestionViewProps
> = ({ question, showAnswers = true }) => {
  const options = (question.options as Record<string, unknown>) || {};
  const targetCompany =
    question.question_text ||
    (options.company_name as string) ||
    "Target Company";

  const fields = [
    {
      label: "Name of the Person",
      value: String(options.contact_name || options.name || ""),
      icon: <User size={14} className="text-blue-500 shrink-0" />,
    },
    {
      label: "Title / Designation",
      value: String(options.designation || options.title || ""),
      icon: <Briefcase size={14} className="text-amber-500 shrink-0" />,
    },
    {
      label: "Website Address (URL)",
      value: String(options.website || ""),
      icon: <Globe size={14} className="text-emerald-500 shrink-0" />,
    },
    {
      label: "Person's Email Address",
      value: String(options.email || ""),
      icon: <Mail size={14} className="text-purple-500 shrink-0" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Explicit Question / Target Company Banner */}
      <div
        className={cn(
          "p-4 bg-slate-50 dark:bg-slate-800/30 border border-border/80 space-y-1 print:bg-slate-100 print:border-slate-400",
          STYLE_CONFIG.innerCardRadius,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            Question / Target Company
          </span>
        </div>
        <Typography
          variant="body3"
          weight="black"
          className="text-foreground text-base print:text-black font-black pl-1 pt-1"
        >
          {targetCompany}
        </Typography>
      </div>

      {/* Form Fields Grid */}
      <div
        className={cn(
          "p-5 bg-white dark:bg-slate-900 border border-border/80 space-y-3 print:bg-white print:border-slate-300",
          STYLE_CONFIG.innerCardRadius,
        )}
      >
        <div className="flex items-center gap-2">
          {showAnswers ? (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              Answer
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
              Answer
            </span>
          )}
          <span className="text-xs font-bold text-muted-foreground">
            {showAnswers
              ? "Configured Lead Data Key"
              : "Candidate Entry Fields"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {fields.map((f, idx) => (
            <div
              key={idx}
              className={cn(
                "p-3.5 border transition-colors flex flex-col justify-center space-y-1",
                STYLE_CONFIG.innerCardRadius,
                showAnswers && f.value
                  ? "bg-emerald-500/[0.04] dark:bg-emerald-500/10 border-emerald-500/30 print:bg-emerald-50 print:border-emerald-600"
                  : "bg-slate-50/60 dark:bg-slate-800/30 border-border/60 print:bg-white print:border-slate-300",
              )}
            >
              <div className="flex items-center gap-1.5">
                {f.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </span>
              </div>
              <div className="text-sm font-semibold text-foreground pt-0.5 print:text-black">
                {showAnswers ? (
                  f.value || (
                    <span className="text-muted-foreground/40 italic">
                      Not set
                    </span>
                  )
                ) : (
                  <div className="h-5 border-b border-dashed border-slate-400 print:border-slate-400 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
