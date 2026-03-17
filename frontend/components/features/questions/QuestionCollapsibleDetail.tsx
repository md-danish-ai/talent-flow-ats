"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Question } from "@lib/api/questions";
import { Typography } from "@components/ui-elements/Typography";
import {
  BookOpen,
  Layers,
  Trophy,
  Building2,
  User,
  Phone,
  MapPin,
  Keyboard,
  FileText,
  Info,
  ListChecks,
} from "lucide-react";
import { cn } from "@lib/utils";
import { QUESTION_TYPES } from "@lib/constants/questions";

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
        rx="16"
        ry="16"
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

  const getHeaderInfo = () => {
    switch (typeCode) {
      case QUESTION_TYPES.LEAD_GENERATION:
        return {
          title: "Lead Generation Detail",
          subtitle: "Prospect & Business Analysis",
        };
      case QUESTION_TYPES.CONTACT_DETAILS:
        return {
          title: "Company Contact Profile",
          subtitle: "Firmographic & Communication Data",
        };
      case QUESTION_TYPES.TYPING_TEST:
        return {
          title: "Typing Test Parameter",
          subtitle: "Speed & Accuracy Assessment",
        };
      default:
        return {
          title: "Question Detail",
          subtitle: "Metadata & Content Overview",
        };
    }
  };

  const header = getHeaderInfo();

  const renderMetadataGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div className="flex items-center gap-3 bg-emerald-50/30 dark:bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 shadow-sm">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
      <div className="flex items-center gap-3 bg-amber-50/30 dark:bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 shadow-sm">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
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
      <div className="flex items-center gap-3 bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10 shadow-sm">
        <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
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
    <div className="absolute -top-3.5 left-5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm z-20">
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

  const renderLeadGeneration = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <Building2 size={16} />
            <Typography variant="body4" weight="bold">
              Company Details
            </Typography>
          </div>
          <div className="space-y-2">
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Company Name
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.companyName || "N/A")}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Website
              </Typography>
              <Typography
                variant="body4"
                weight="semibold"
                className="text-brand-primary break-all"
              >
                {String(options.website || "N/A")}
              </Typography>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <User size={16} />
            <Typography variant="body4" weight="bold">
              Contact Info
            </Typography>
          </div>
          <div className="space-y-2">
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Contact Person
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.name || "N/A")} (
                {String(options.title || "N/A")})
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Email Address
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.email || "N/A")}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 pt-8 rounded-2xl bg-brand-primary/[0.02] border border-brand-primary/10 relative">
        {renderSectionHeader(
          <Info size={12} className="text-brand-primary" />,
          "Task / Instructions",
        )}
        <Typography
          variant="body4"
          className="text-foreground/80 leading-relaxed italic"
        >
          &quot;{question.question_text}&quot;
        </Typography>
      </div>
    </div>
  );

  const renderContactDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50">
          <div className="flex items-center gap-2 text-brand-primary mb-3">
            <Building2 size={16} />
            <Typography variant="body4" weight="bold">
              Company
            </Typography>
          </div>
          <div className="space-y-2">
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Name
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.companyName || "N/A")}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Website
              </Typography>
              <Typography
                variant="body4"
                weight="semibold"
                className="text-brand-primary break-all"
              >
                {String(options.websiteUrl || "N/A")}
              </Typography>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50">
          <div className="flex items-center gap-2 text-emerald-600 mb-3">
            <Phone size={16} />
            <Typography variant="body4" weight="bold">
              Communication
            </Typography>
          </div>
          <div className="space-y-2">
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Phone
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.companyPhoneNumber || "N/A")}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Email
              </Typography>
              <Typography
                variant="body4"
                weight="semibold"
                className="break-all"
              >
                {String(options.generalEmail || "N/A")}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Facebook
              </Typography>
              <Typography
                variant="body4"
                weight="semibold"
                className="break-all"
              >
                {String(options.facebookPage || "N/A")}
              </Typography>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50">
          <div className="flex items-center gap-2 text-amber-600 mb-3">
            <MapPin size={16} />
            <Typography variant="body4" weight="bold">
              Location
            </Typography>
          </div>
          <div className="space-y-2">
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                Street
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.streetAddress || "N/A")}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground uppercase text-[10px]"
              >
                City / State / Zip
              </Typography>
              <Typography variant="body4" weight="semibold">
                {String(options.city || "N/A")},{" "}
                {String(options.state || "N/A")} {String(options.zipCode || "")}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypingTest = () => (
    <div className="space-y-6">
      <div className="p-5 pt-8 rounded-2xl bg-brand-primary/[0.02] border border-brand-primary/10 relative">
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
      <div className="p-5 pt-8 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-border/50 relative">
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
    switch (typeCode) {
      case QUESTION_TYPES.LEAD_GENERATION:
        return renderLeadGeneration();
      case QUESTION_TYPES.CONTACT_DETAILS:
        return renderContactDetails();
      case QUESTION_TYPES.TYPING_TEST:
        return renderTypingTest();
      default:
        return null;
    }
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
          "relative rounded-2xl border border-border/60 bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300",
          isHovered && "scale-[1.01] border-brand-primary/30 shadow-2xl",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatedBorder color="var(--color-brand-primary)" active={isHovered} />

        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shadow-sm">
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
