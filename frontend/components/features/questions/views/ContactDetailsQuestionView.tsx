"use client";

import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Question } from "@types";
import { Building2, Phone, Mail, Share2, MapPin, Compass } from "lucide-react";

interface ContactDetailsQuestionViewProps {
  question: Question;
  showAnswers?: boolean;
}

export const ContactDetailsQuestionView: React.FC<
  ContactDetailsQuestionViewProps
> = ({ question, showAnswers = true }) => {
  const options = (question.options as Record<string, unknown>) || {};
  const targetUrl =
    question.question_text ||
    (options.websiteUrl as string) ||
    (options.website as string) ||
    "Target Source";

  const fields = [
    {
      label: "Company Name",
      value: String(options.companyName || ""),
      icon: <Building2 size={13} className="text-blue-500 shrink-0" />,
    },
    {
      label: "Phone Number",
      value: String(options.companyPhoneNumber || options.phone || ""),
      icon: <Phone size={13} className="text-emerald-500 shrink-0" />,
    },
    {
      label: "General Email",
      value: String(options.generalEmail || options.email || ""),
      icon: <Mail size={13} className="text-purple-500 shrink-0" />,
    },
    {
      label: "Facebook Page",
      value: String(options.facebookPage || ""),
      icon: <Share2 size={13} className="text-sky-500 shrink-0" />,
    },
    {
      label: "Street Address",
      value: String(options.streetAddress || ""),
      icon: <MapPin size={13} className="text-amber-500 shrink-0" />,
    },
    {
      label: "City",
      value: String(options.city || ""),
      icon: <Compass size={13} className="text-indigo-500 shrink-0" />,
    },
    {
      label: "State",
      value: String(options.state || ""),
      icon: <Compass size={13} className="text-rose-500 shrink-0" />,
    },
    {
      label: "Zip Code",
      value: String(options.zipCode || ""),
      icon: <MapPin size={13} className="text-teal-500 shrink-0" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Explicit Question / Target Source URL Banner */}
      <div
        className={cn(
          "p-4 bg-slate-50 dark:bg-slate-800/30 border border-border/80 space-y-1 print:bg-slate-100 print:border-slate-400",
          STYLE_CONFIG.innerCardRadius,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            Question / Target Source URL
          </span>
        </div>
        <Typography
          variant="body3"
          weight="black"
          className="text-foreground text-base break-all print:text-black font-black pl-1 pt-1"
        >
          {targetUrl}
        </Typography>
      </div>

      {/* Form Fields 4-Column Grid */}
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
              ? "Configured Contact Profile Key"
              : "Candidate Entry Fields"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {fields.map((f, idx) => (
            <div
              key={idx}
              className={cn(
                "p-3 border transition-colors flex flex-col justify-center space-y-1",
                STYLE_CONFIG.innerCardRadius,
                showAnswers && f.value
                  ? "bg-emerald-500/[0.04] dark:bg-emerald-500/10 border-emerald-500/30 print:bg-emerald-50 print:border-emerald-600"
                  : "bg-slate-50/60 dark:bg-slate-800/30 border-border/60 print:bg-white print:border-slate-300",
              )}
            >
              <div className="flex items-center gap-1.5">
                {f.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {f.label}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-foreground pt-0.5 break-all print:text-black">
                {showAnswers ? (
                  f.value || (
                    <span className="text-muted-foreground/40 italic text-xs">
                      Not set
                    </span>
                  )
                ) : (
                  <div className="h-4 border-b border-dashed border-slate-400 print:border-slate-400 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
