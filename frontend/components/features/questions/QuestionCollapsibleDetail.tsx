"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { type Question } from "@types";
import { Typography } from "@components/ui-elements/Typography";
import {
  BookOpen,
  Layers,
  Trophy,
  Keyboard,
  FileText,
  ListChecks,
} from "lucide-react";
import { cn } from "@lib/utils";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { STYLE_CONFIG } from "@lib/config/style";

/**
 * Clean Border Animation Component
 */
function AnimatedBorder({ color, active }: { color: string; active: boolean }) {
  const getRadius = () => {
    switch (STYLE_CONFIG.cardRadius) {
      case "rounded-none":
        return "0px";
      case "rounded-sm":
        return "4px";
      case "rounded-md":
        return "6px";
      case "rounded-lg":
        return "8px";
      case "rounded-xl":
        return "12px";
      case "rounded-2xl":
        return "16px";
      case "rounded-3xl":
        return "24px";
      default:
        return "16px";
    }
  };
  const r = getRadius();

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={r}
        ry={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
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

interface QuestionCollapsibleDetailProps {
  question: Question;
  className?: string;
}

export const QuestionCollapsibleDetail: React.FC<
  QuestionCollapsibleDetailProps
> = ({ question, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const options = (question.options as Record<string, unknown>) || {};
  const typeCode =
    typeof question.question_type === "string"
      ? question.question_type
      : question.question_type?.code;
  const subjectCode =
    typeof question.subject === "string"
      ? question.subject
      : question.subject?.code ||
        (question as unknown as Record<string, unknown>).subject_type;

  const isLeadGen =
    typeCode === QUESTION_TYPES.LEAD_GENERATION ||
    subjectCode === "LEAD_GENERATION";
  const isContactDetails =
    typeCode === QUESTION_TYPES.CONTACT_DETAILS ||
    subjectCode === "COMPANY_CONTACT_DETAILS" ||
    subjectCode === "CONTACT_DETAILS";
  const isTypingTest =
    typeCode === QUESTION_TYPES.TYPING_TEST || subjectCode === "TYPING_TEST";

  const getHeaderInfo = () => {
    if (isLeadGen) {
      return {
        title: "Lead Generation Detail",
        subtitle: "Prospect & Business Analysis",
      };
    }
    if (isContactDetails) {
      return {
        title: "Company Contact Profile",
        subtitle: "Firmographic & Communication Data",
      };
    }
    if (isTypingTest) {
      return {
        title: "Typing Test Parameter",
        subtitle: "Speed & Accuracy Assessment",
      };
    }
    return {
      title: "Question Detail",
      subtitle: "Metadata & Content Overview",
    };
  };

  const header = getHeaderInfo();

  const renderMetadataGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div
        className={`flex items-center gap-3 bg-emerald-50/30 dark:bg-emerald-500/5 p-3 ${STYLE_CONFIG.innerCardRadius} border border-emerald-500/10 shadow-sm`}
      >
        <div
          className={`p-2 ${STYLE_CONFIG.iconRadius} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}
        >
          <BookOpen size={14} />
        </div>
        <div className="flex flex-col">
          <Typography
            variant="body5"
            weight="bold"
            className="text-emerald-600/60 uppercase tracking-widest text-[9px]"
          >
            Subject
          </Typography>
          <Typography variant="body4" weight="bold">
            {typeof question.subject === "string"
              ? question.subject
              : question.subject?.name || "N/A"}
          </Typography>
        </div>
      </div>
      <div
        className={`flex items-center gap-3 bg-amber-50/30 dark:bg-amber-500/5 p-3 ${STYLE_CONFIG.innerCardRadius} border border-amber-500/10 shadow-sm`}
      >
        <div
          className={`p-2 ${STYLE_CONFIG.iconRadius} bg-amber-500/10 text-amber-600 dark:text-amber-400`}
        >
          <Layers size={14} />
        </div>
        <div className="flex flex-col">
          <Typography
            variant="body5"
            weight="bold"
            className="text-amber-600/60 uppercase tracking-widest text-[9px]"
          >
            Exam Level
          </Typography>
          <Typography variant="body4" weight="bold">
            {typeof question.exam_level === "string"
              ? question.exam_level
              : question.exam_level?.name || "N/A"}
          </Typography>
        </div>
      </div>
      <div
        className={`flex items-center gap-3 bg-brand-primary/5 p-3 ${STYLE_CONFIG.innerCardRadius} border border-brand-primary/10 shadow-sm`}
      >
        <div
          className={`p-2 ${STYLE_CONFIG.iconRadius} bg-brand-primary/10 text-brand-primary`}
        >
          <Trophy size={14} />
        </div>
        <div className="flex flex-col">
          <Typography
            variant="body5"
            weight="bold"
            className="text-brand-primary/60 uppercase tracking-widest text-[9px]"
          >
            Marks
          </Typography>
          <Typography
            variant="body4"
            weight="black"
            className="text-brand-primary"
          >
            {question.marks} Points
          </Typography>
        </div>
      </div>
    </div>
  );

  const renderSectionHeader = (icon: React.ReactNode, title: string) => (
    <div
      className={cn(
        "absolute -top-3.5 left-5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm z-20",
        STYLE_CONFIG.badgeRadius,
      )}
    >
      {icon}
      <Typography
        variant="body5"
        weight="black"
        className="text-muted-foreground uppercase tracking-widest text-[10px]"
      >
        {title}
      </Typography>
    </div>
  );

  const renderLeadGeneration = () => {
    const targetCompany =
      question.question_text || (options.company_name as string) || "N/A";

    const leadKeyValueList = [
      {
        key: "Name of the Person",
        value: String(options.contact_name || "N/A"),
      },
      {
        key: "Title / Designation",
        value: String(options.designation || "N/A"),
      },
      {
        key: "Website Address (URL)",
        value: String(options.website || "N/A"),
      },
      {
        key: "Person's Email Address",
        value: String(options.email || "N/A"),
      },
    ];

    return (
      <div className="space-y-4">
        {/* Prominent Target Company Banner */}
        <div className="p-4 rounded-xl border border-brand-primary/20 bg-brand-primary/[0.04] flex flex-col space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary">
            Target Company Name
          </span>
          <span className="text-base font-bold text-foreground break-all">
            {targetCompany}
          </span>
        </div>

        {/* 2-Column Grid for Form Fields */}
        <div className="rounded-2xl border border-border/80 bg-white/60 dark:bg-slate-900/60 p-6 space-y-4 shadow-sm">
          <Typography
            variant="body5"
            weight="black"
            className="text-muted-foreground/80 uppercase tracking-widest text-[10px] block font-mono"
          >
            LEAD GENERATION DETAILS
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leadKeyValueList.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border/50 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-center space-y-1"
              >
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                  {item.key}
                </span>
                <span className="text-sm font-semibold text-foreground break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContactDetails = () => {
    const targetUrl =
      question.question_text ||
      (options.websiteUrl as string) ||
      (options.website as string) ||
      "N/A";

    const contactKeyValueList = [
      {
        key: "Company Name",
        value: String(options.companyName || "N/A"),
      },
      {
        key: "Phone Number",
        value: String(options.companyPhoneNumber || "N/A"),
      },
      {
        key: "General Email",
        value: String(options.generalEmail || "N/A"),
      },
      {
        key: "Facebook Page",
        value: String(options.facebookPage || "N/A"),
      },
      {
        key: "Street Address",
        value: String(options.streetAddress || "N/A"),
      },
      {
        key: "City",
        value: String(options.city || "N/A"),
      },
      {
        key: "State",
        value: String(options.state || "N/A"),
      },
      {
        key: "Zip Code",
        value: String(options.zipCode || "N/A"),
      },
    ];

    return (
      <div className="space-y-4">
        {/* Prominent Target Source / URL Banner */}
        <div className="p-4 rounded-xl border border-brand-primary/20 bg-brand-primary/[0.04] flex flex-col space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary">
            Target Source / URL
          </span>
          <span className="text-base font-bold text-foreground break-all">
            {targetUrl}
          </span>
        </div>

        {/* 2-Column Grid for the 8 Form Fields */}
        <div className="rounded-2xl border border-border/80 bg-white/60 dark:bg-slate-900/60 p-6 space-y-4 shadow-sm">
          <Typography
            variant="body5"
            weight="black"
            className="text-muted-foreground/80 uppercase tracking-widest text-[10px] block font-mono"
          >
            COMPANY CONTACT DETAILS
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contactKeyValueList.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border/50 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-center space-y-1"
              >
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                  {item.key}
                </span>
                <span className="text-sm font-semibold text-foreground break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTypingTest = () => (
    <div className="space-y-6">
      <div
        className={`p-5 pt-8 ${STYLE_CONFIG.innerCardRadius} bg-brand-primary/[0.02] border border-brand-primary/10 relative`}
      >
        {renderSectionHeader(
          <Keyboard size={12} className="text-brand-primary" />,
          "Test Assignment",
        )}
        <Typography
          variant="body3"
          weight="bold"
          className="text-foreground/90"
        >
          {question.question_text}
        </Typography>
      </div>
      <div
        className={`p-5 pt-8 ${STYLE_CONFIG.innerCardRadius} bg-slate-50 dark:bg-slate-800/20 border border-border/50 relative`}
      >
        {renderSectionHeader(
          <FileText size={12} className="text-emerald-500" />,
          "Typing Content (Paragraph)",
        )}
        <Typography
          variant="body4"
          className="text-foreground/70 leading-relaxed whitespace-pre-wrap font-medium"
        >
          {question.passage || "No paragraph content provided."}
        </Typography>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLeadGen) return renderLeadGeneration();
    if (isContactDetails) return renderContactDetails();
    if (isTypingTest) return renderTypingTest();
    return null;
  };

  return (
    <div
      className={cn(
        "px-5 py-4 bg-slate-50/30 dark:bg-slate-900/50 border-t border-border/60",
        className,
      )}
    >
      <div
        className={cn(
          "relative border border-border/60 bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300",
          STYLE_CONFIG.cardRadius,
          isHovered && "scale-[1.01] border-brand-primary/30 shadow-2xl",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatedBorder color="var(--color-brand-primary)" active={isHovered} />

        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-2.5 bg-brand-primary/10 text-brand-primary shadow-sm",
                STYLE_CONFIG.iconRadius,
              )}
            >
              <ListChecks size={20} />
            </div>
            <div>
              <Typography
                variant="body2"
                weight="bold"
                className="tracking-tight text-foreground/90"
              >
                {header.title}
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground/70 uppercase tracking-widest font-bold text-[9px]"
              >
                {header.subtitle}
              </Typography>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-10">
          {renderMetadataGrid()}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
