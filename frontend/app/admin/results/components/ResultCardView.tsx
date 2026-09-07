"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  FileText,
  CalendarDays,
  CheckCircle2,
  Activity,
  Clock,
  AlertCircle,
  UserCheck,
  UserPlus,
  Eye,
  Layers,
  Radio,
  Keyboard,
} from "lucide-react";
import { Avatar } from "@components/ui-elements/Avatar";
import { Badge } from "@components/ui-elements/Badge";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { CopyableText } from "@components/ui-elements/CopyableText";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { AssignLeadModal } from "./AssignLeadModal";
import { type AdminUserResultListItem, type SubjectResult } from "@types";
import { cn, getGradeConfig, formatDate } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

interface ResultCardViewProps {
  items: AdminUserResultListItem[];
  onRefresh?: (isBackground?: boolean) => Promise<void> | void;
}

/**
 * Returns the left pillar gradient and shadow classes based on candidate grade / status
 */
function getCardPillarClass(
  grade?: string,
  status?: string,
  isInProgress?: boolean,
) {
  const normStatus = (status || "").toLowerCase();
  if (
    isInProgress ||
    normStatus === "started" ||
    normStatus === "inprogress" ||
    normStatus === "in_progress"
  ) {
    return "bg-gradient-to-b from-orange-400 to-amber-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]";
  }
  if (normStatus === "not_required") {
    return "bg-slate-400";
  }
  if (normStatus === "expired") {
    return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]";
  }
  if (grade && grade !== "N/A") {
    const config = getGradeConfig(grade);
    if (config.label !== "N/A") {
      return config.pillar;
    }
  }
  if (
    normStatus === "submitted" ||
    normStatus === "completed" ||
    normStatus === "auto_submitted"
  ) {
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";
  }
  return "bg-slate-300 dark:bg-slate-700";
}

function getCardHoverBorderClass(
  grade?: string,
  status?: string,
  isInProgress?: boolean,
) {
  const normStatus = (status || "").toLowerCase();
  if (
    isInProgress ||
    normStatus === "started" ||
    normStatus === "inprogress" ||
    normStatus === "in_progress"
  ) {
    return "hover:border-amber-500 dark:hover:border-amber-400";
  }
  if (normStatus === "not_required") {
    return "hover:border-slate-400 dark:hover:border-slate-400";
  }
  if (normStatus === "expired") {
    return "hover:border-rose-500 dark:hover:border-rose-400";
  }
  if (grade && grade !== "N/A") {
    const config = getGradeConfig(grade);
    if (config.label !== "N/A") {
      return config.hoverBorder;
    }
  }
  if (
    normStatus === "submitted" ||
    normStatus === "completed" ||
    normStatus === "auto_submitted"
  ) {
    return "hover:border-emerald-500 dark:hover:border-emerald-400";
  }
  return "hover:border-brand-primary dark:hover:border-brand-primary";
}

function renderStatusBadge(itemStatus: string) {
  switch (itemStatus) {
    case "not_required":
      return (
        <Badge
          variant="outline"
          shape="square"
          color="default"
          className="text-[10px] font-bold"
        >
          NOT REQUIRED
        </Badge>
      );
    case "submitted":
    case "completed":
      return (
        <Badge
          variant="outline"
          color="success"
          animate="pulse"
          shape="square"
          icon={<CheckCircle2 size={11} />}
          className="text-[10px] font-bold"
        >
          SUBMITTED
        </Badge>
      );
    case "started":
    case "inprogress":
    case "in_progress":
      return (
        <Badge
          variant="outline"
          color="primary"
          animate="pulse"
          shape="square"
          icon={<Activity size={11} />}
          className="text-[10px] font-bold"
        >
          IN PROGRESS
        </Badge>
      );
    case "auto_submitted":
      return (
        <Badge
          variant="outline"
          color="blue"
          animate="pulse"
          shape="square"
          icon={<Clock size={11} />}
          className="text-[10px] font-bold"
        >
          AUTO SUBMITTED
        </Badge>
      );
    case "expired":
      return (
        <Badge
          variant="outline"
          color="error"
          shape="square"
          icon={<AlertCircle size={11} />}
          className="text-[10px] font-bold"
        >
          EXPIRED
        </Badge>
      );
    case "ready":
      return (
        <Badge
          variant="outline"
          color="blue"
          animate="pulse"
          shape="square"
          className="text-[10px] font-bold"
        >
          READY
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          shape="square"
          color="warning"
          className="text-[10px] font-bold"
        >
          {itemStatus.replace(/_/g, " ").toUpperCase()}
        </Badge>
      );
  }
}

export function ResultCardView({ items, onRefresh }: ResultCardViewProps) {
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    userId?: number;
    attemptId?: number;
    name?: string;
  }>({
    isOpen: false,
  });

  return (
    <div className="p-4 sm:p-6 bg-slate-100/70 dark:bg-slate-950/60 min-h-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        {items.map((item) => {
          const latest = item.latest_attempt;
          const interviewDate = latest?.submitted_at || latest?.started_at;
          const detailHref = `/admin/results/round-1/${item.user_id}`;
          const itemStatus = (
            item.status ||
            latest?.status ||
            (item.requires_interview === false ? "not_required" : "ready")
          ).toLowerCase();

          const isInProgress =
            latest?.is_in_progress ||
            itemStatus === "started" ||
            itemStatus === "inprogress" ||
            itemStatus === "in_progress";

          const pillarClass = getCardPillarClass(
            latest?.overall_grade,
            itemStatus,
            isInProgress,
          );

          const hoverBorderClass = getCardHoverBorderClass(
            latest?.overall_grade,
            itemStatus,
            isInProgress,
          );

          const gradeConfig = getGradeConfig(latest?.overall_grade);
          const subjectResults: SubjectResult[] = latest?.subject_results ?? [];
          const typingStats = latest?.typing_stats;

          const totalCorrect = subjectResults.reduce(
            (acc, sub) => acc + (sub.correct_count ?? 0),
            0,
          );
          const totalIncorrect = subjectResults.reduce(
            (acc, sub) => acc + (sub.incorrect_count ?? 0),
            0,
          );
          const totalSkipped =
            latest?.unattempted_count ??
            subjectResults.reduce(
              (acc, sub) =>
                acc +
                (sub.unattempted_count ??
                  Math.max(
                    0,
                    (sub.total_questions || 0) - (sub.attempted_count || 0),
                  )),
              0,
            );

          const statusDotColor =
            itemStatus === "not_required"
              ? "bg-slate-400"
              : itemStatus === "submitted" ||
                  itemStatus === "completed" ||
                  item.is_interview_submitted
                ? "bg-emerald-500"
                : isInProgress
                  ? "bg-orange-500 animate-pulse"
                  : itemStatus === "auto_submitted"
                    ? "bg-blue-500"
                    : itemStatus === "expired"
                      ? "bg-rose-500"
                      : "bg-amber-500";

          return (
            <div
              key={latest?.attempt_id ?? item.user_id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden p-5 sm:p-6 transition-all duration-300 ease-out",
                "bg-white dark:bg-slate-900",
                "border-2 border-slate-200/90 dark:border-slate-800",
                "shadow-lg shadow-slate-200/70 dark:shadow-slate-950/70",
                "hover:-translate-y-1.5",
                hoverBorderClass,
                "hover:shadow-2xl hover:shadow-slate-300/80 dark:hover:shadow-black/90",
                STYLE_CONFIG.cardRadius,
              )}
            >
              {/* Left Side Grade / Status Pillar */}
              <div
                className={cn(
                  "absolute inset-y-0 left-0 w-1.5 rounded-r-full transition-all duration-500",
                  pillarClass,
                )}
              />

              {/* Backdrop Attempt Count in Top Right Background (shifted left to avoid overlapping action buttons) */}
              <div className="absolute top-2.5 right-24 sm:right-28 opacity-[0.08] dark:opacity-[0.12] text-foreground font-black text-5xl sm:text-6xl select-none pointer-events-none transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.12] dark:group-hover:opacity-[0.18] tracking-tighter leading-none">
                Attempt #{item.attempts_count > 0 ? item.attempts_count : 1}
              </div>

              <div className="space-y-3.5 pl-1.5 relative z-10">
                {/* 1. Top Header: Avatar, Candidate Details & Action Icons */}
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar
                        name={item.username}
                        variant="brand"
                        size="md"
                        className="ring-2 ring-brand-primary/15 transition-transform duration-300 group-hover:scale-105"
                      />
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-card rounded-full shadow-xs",
                          statusDotColor,
                        )}
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={detailHref}
                          className="font-black text-foreground hover:text-brand-primary transition-colors tracking-tight truncate text-[15.5px] sm:text-[16px]"
                        >
                          {item.username || "Anonymous"}
                        </Link>

                        {item.is_reattempt ? (
                          <Badge
                            variant="outline"
                            color="violet"
                            animate="pulse"
                            shape="square"
                            className="text-[9px] px-1.5 py-0.5 font-bold uppercase"
                          >
                            Re-Attempt
                          </Badge>
                        ) : (
                          <Badge
                            color="success"
                            variant="outline"
                            shape="square"
                            className="text-[9px] px-1.5 py-0.5 font-bold uppercase"
                          >
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-muted-foreground font-medium pt-0.5">
                        <CopyableText
                          value={item.mobile}
                          className="text-muted-foreground hover:text-foreground text-[11.5px]"
                          title="Copy Phone Number"
                        >
                          <Phone
                            size={11}
                            className="shrink-0 text-brand-primary/70"
                          />
                          <span>{item.mobile}</span>
                        </CopyableText>

                        {interviewDate && (
                          <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                            <CalendarDays
                              size={11}
                              className="shrink-0 text-brand-primary/70"
                            />
                            <span>{formatDate(interviewDate, "N/A")}</span>
                          </div>
                        )}

                        {item.department && (
                          <Badge
                            variant="outline"
                            color="secondary"
                            shape="square"
                            className="text-[9px] px-1.5 py-0.5 font-semibold"
                          >
                            {item.department}
                          </Badge>
                        )}
                        {item.test_level && (
                          <Badge
                            variant="outline"
                            color="violet"
                            shape="square"
                            className="text-[9px] px-1.5 py-0.5 font-semibold"
                          >
                            {item.test_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Icon Buttons (Assign to Lead & View Result) */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {(latest?.status === "submitted" ||
                      latest?.status === "auto_submitted" ||
                      latest?.status === "completed") && (
                      <TableIconButton
                        iconColor="green"
                        btnSize="sm"
                        animate="scale"
                        title="Assign to Project Lead"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssignModal({
                            isOpen: true,
                            userId: item.user_id,
                            attemptId: latest.attempt_id,
                            name: item.username,
                          });
                        }}
                      >
                        <UserPlus size={15} />
                      </TableIconButton>
                    )}

                    <Link href={detailHref}>
                      <TableIconButton
                        iconColor="orange"
                        btnSize="sm"
                        animate="scale"
                        title="View Result"
                      >
                        <Eye size={15} />
                      </TableIconButton>
                    </Link>
                  </div>
                </div>

                {/* 2. Paper Banner with Status & Grade Badges */}
                <div className="flex items-center justify-between gap-3 pt-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <FileText size={13} />
                    </div>
                    <span
                      className="font-bold text-foreground truncate text-[13.5px] tracking-tight"
                      title={latest?.paper_name || "No paper assigned"}
                    >
                      {latest?.paper_name || "No paper assigned"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderStatusBadge(itemStatus)}

                    {latest?.overall_grade &&
                      latest.overall_grade !== "N/A" && (
                        <Badge
                          variant="outline"
                          color={gradeConfig.badgeColor}
                          shape="square"
                          className="text-[10px] font-bold"
                        >
                          {latest.overall_grade}
                        </Badge>
                      )}
                  </div>
                </div>

                {/* 3. Key Metrics Strip (Questions Breakdown & Assigned Lead) */}
                <div className="flex items-center justify-between gap-x-5 gap-y-2 py-2 text-[12.5px] sm:text-[13px] flex-wrap border-y border-dashed border-border/60">
                  {/* Question Breakdown: Correct, Incorrect, Skip */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
                    {/* Correct */}
                    <div
                      className="flex items-center gap-1"
                      title="Correct Questions"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-bold text-muted-foreground uppercase text-[11px] tracking-wide">
                        Correct:
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[13px]">
                        {totalCorrect}
                      </span>
                    </div>

                    {/* Incorrect */}
                    <div
                      className="flex items-center gap-1"
                      title="Incorrect Questions"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-bold text-muted-foreground uppercase text-[11px] tracking-wide">
                        Incorrect:
                      </span>
                      <span className="font-extrabold text-rose-600 dark:text-rose-400 text-[13px]">
                        {totalIncorrect}
                      </span>
                    </div>

                    {/* Skip */}
                    <div
                      className="flex items-center gap-1"
                      title="Skipped / Unattempted Questions"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-bold text-muted-foreground uppercase text-[11px] tracking-wide">
                        Skip:
                      </span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400 text-[13px]">
                        {totalSkipped}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Lead (with Tooltip on hover for multiple leads) */}
                  <div className="flex items-center gap-1.5">
                    <UserCheck
                      size={13}
                      className="text-brand-primary/80 shrink-0"
                    />
                    <span className="font-bold text-muted-foreground uppercase text-[11.5px] tracking-wide">
                      Lead:
                    </span>
                    {latest?.interviewers && latest.interviewers.length > 0 ? (
                      <Tooltip
                        content={
                          <div className="flex flex-col gap-2 p-1 min-w-[140px]">
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 border-b border-border dark:border-white/10 pb-1">
                              Assigned Panel
                            </div>
                            {latest.interviewers.map((lead, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="relative shrink-0">
                                  <Avatar
                                    name={lead.name}
                                    variant="brand"
                                    className="w-5 h-5 text-[9px] rounded-sm border-none shadow-none"
                                  />
                                  <div
                                    className={cn(
                                      "absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-slate-900",
                                      lead.status === "completed"
                                        ? "bg-emerald-500"
                                        : "bg-amber-500",
                                    )}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                                  {lead.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        }
                        side="top"
                      >
                        <div className="flex items-center gap-1.5 cursor-default">
                          <span className="font-extrabold text-foreground text-[13px] truncate max-w-[140px]">
                            {latest.interviewers[0].name}
                          </span>
                          {latest.interviewers.length > 1 && (
                            <Badge
                              variant="outline"
                              color="secondary"
                              shape="square"
                              className="text-[9.5px] px-1.5 py-0.2 font-bold cursor-pointer"
                            >
                              +{latest.interviewers.length - 1}
                            </Badge>
                          )}
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground/60 italic font-medium text-[12.5px]">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. Subject-Wise Performance (Clean Row / Material Table Format) */}
                {subjectResults.length > 0 && (
                  <div className="space-y-2 pt-0.5">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                          <Layers size={12} />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[12.5px] font-black text-foreground tracking-tight uppercase">
                            Section Performance
                          </span>
                          <span className="text-[11.5px] font-bold text-muted-foreground">
                            ({subjectResults.length})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        {isInProgress && (
                          <span className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider text-orange-500 animate-pulse">
                            <Radio size={9} /> Live Preview
                          </span>
                        )}

                        {/* Score (Moved to right side of Subject Breakdown header) */}
                        {typeof latest?.total_marks === "number" &&
                        latest.total_marks > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-muted-foreground uppercase text-[11px] tracking-wide">
                              Score:
                            </span>
                            <span className="font-extrabold text-foreground text-[13px]">
                              {latest.obtained_marks ?? 0}
                              <span className="text-muted-foreground font-medium text-[11px]">
                                /{latest.total_marks}
                              </span>
                            </span>
                            <Badge
                              variant="outline"
                              shape="square"
                              color={
                                (latest.obtained_marks || 0) /
                                  latest.total_marks >=
                                0.6
                                  ? "success"
                                  : (latest.obtained_marks || 0) /
                                        latest.total_marks >=
                                      0.4
                                    ? "warning"
                                    : "error"
                              }
                              className="text-[10px] font-bold"
                            >
                              {Math.round(
                                ((latest.obtained_marks || 0) /
                                  latest.total_marks) *
                                  100,
                              )}
                              %
                            </Badge>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-border/40">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border/40 bg-muted/40 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                            <th className="py-2.5 px-3">Subject Name</th>
                            <th className="py-2.5 px-3 text-center">Marks</th>
                            <th className="py-2.5 px-3 text-center">Grade</th>
                            <th className="py-2.5 px-3 text-center">
                              Questions
                            </th>
                            <th className="py-2.5 px-3 text-right">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 bg-card/50 text-[13px]">
                          {subjectResults.map((sub, sidx) => {
                            const subGradeConfig = getGradeConfig(sub.grade);
                            const timeVal =
                              sub.time_minutes ?? sub.duration_minutes;

                            return (
                              <tr
                                key={sidx}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                {/* Subject Name */}
                                <td className="py-2.5 px-3 font-semibold text-foreground">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                        sub.is_in_progress
                                          ? "bg-orange-500 animate-pulse"
                                          : subGradeConfig.barBg,
                                      )}
                                    />
                                    <span
                                      className="truncate max-w-[200px] block"
                                      title={sub.section_name}
                                    >
                                      {sub.section_name}
                                    </span>
                                  </div>
                                </td>

                                {/* Marks */}
                                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                  <Badge
                                    variant="outline"
                                    shape="square"
                                    color={
                                      sub.is_in_progress
                                        ? "orange"
                                        : subGradeConfig.badgeColor
                                    }
                                    className="text-[11px] font-bold px-2 py-0.5"
                                  >
                                    <span className="font-extrabold text-inherit">
                                      {sub.obtained_marks ?? 0} /{" "}
                                      {sub.total_marks}
                                    </span>
                                  </Badge>
                                </td>

                                {/* Grade */}
                                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                  {sub.is_in_progress ? (
                                    <Badge
                                      variant="outline"
                                      shape="square"
                                      color="orange"
                                      className="text-[11px] font-bold px-2 py-0.5"
                                    >
                                      Live
                                    </Badge>
                                  ) : sub.grade && sub.grade !== "N/A" ? (
                                    <Badge
                                      variant="outline"
                                      shape="square"
                                      color={subGradeConfig.badgeColor}
                                      className="text-[11px] font-bold px-2 py-0.5"
                                    >
                                      {sub.grade}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground/60 text-[11.5px]">
                                      N/A
                                    </span>
                                  )}
                                </td>

                                {/* Questions Solved */}
                                <td className="py-2.5 px-3 text-center whitespace-nowrap text-muted-foreground font-medium">
                                  <span className="font-extrabold text-foreground">
                                    {sub.attempted_count}
                                  </span>
                                  <span className="text-[11px]">
                                    /{sub.total_questions}
                                  </span>
                                </td>

                                {/* Time Taken */}
                                <td className="py-2.5 px-3 text-right whitespace-nowrap text-muted-foreground font-medium text-[12.5px]">
                                  {timeVal ? `${timeVal}m` : "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. Typing Test Performance Stats (Flat Creative Strip, No Nested Card) */}
                {typingStats &&
                  (typingStats.wpm > 0 ||
                    typingStats.accuracy > 0 ||
                    typingStats.time_taken > 0 ||
                    (typingStats.errors ?? 0) > 0) && (
                    <div className="flex items-center justify-between gap-x-5 gap-y-2 pt-2 border-t border-dashed border-border/60 text-[12.5px] sm:text-[13px] flex-wrap">
                      {/* Left: Typing Section Label */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Keyboard size={11} />
                        </div>
                        <span className="text-[12px] font-black text-foreground uppercase tracking-tight">
                          Typing Stats:
                        </span>
                      </div>

                      {/* Right / Items: Speed, Accuracy, Mistakes, Duration */}
                      <div className="flex items-center gap-x-5 gap-y-1 flex-wrap">
                        {/* Speed (WPM) */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-muted-foreground uppercase text-[11.5px] tracking-wide">
                            Speed:
                          </span>
                          <span className="font-extrabold text-amber-600 dark:text-amber-400 text-[13px]">
                            {typingStats.wpm}{" "}
                            <span className="text-[11px] font-medium text-muted-foreground">
                              WPM
                            </span>
                          </span>
                        </div>

                        {/* Accuracy */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-muted-foreground uppercase text-[11.5px] tracking-wide">
                            Accuracy:
                          </span>
                          <span
                            className={cn(
                              "font-extrabold text-[13px]",
                              typingStats.accuracy >= 90
                                ? "text-emerald-600 dark:text-emerald-400"
                                : typingStats.accuracy >= 75
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-amber-600 dark:text-amber-400",
                            )}
                          >
                            {typingStats.accuracy}%
                          </span>
                        </div>

                        {/* Mistakes / Errors */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-muted-foreground uppercase text-[11.5px] tracking-wide">
                            Mistakes:
                          </span>
                          <span className="font-extrabold text-rose-500 text-[13px]">
                            {typingStats.errors ?? 0}
                          </span>
                        </div>

                        {/* Duration */}
                        {typingStats.time_taken > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-muted-foreground uppercase text-[11.5px] tracking-wide">
                              Duration:
                            </span>
                            <span className="font-extrabold text-foreground text-[13px]">
                              {Math.floor(typingStats.time_taken / 60) > 0
                                ? `${Math.floor(typingStats.time_taken / 60)}m ${Math.round(typingStats.time_taken % 60)}s`
                                : `${Math.round(typingStats.time_taken)}s`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign to Project Lead Modal */}
      <AssignLeadModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false })}
        userId={assignModal.userId}
        attemptId={assignModal.attemptId}
        candidateName={assignModal.name}
        onSuccess={() => {
          if (onRefresh) onRefresh(true);
        }}
      />
    </div>
  );
}
