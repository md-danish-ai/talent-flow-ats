"use client";

import React from "react";
import { FileUp, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@lib/utils";
import { QUESTION_TYPES } from "@lib/constants/questions";

interface BulkUploadGuideCardProps {
  questionType?: string;
  isImageBased?: boolean;
  className?: string;
}

export function BulkUploadGuideCard({
  questionType,
  isImageBased,
  className,
}: BulkUploadGuideCardProps) {
  return (
    <div
      className={cn(
        "bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="p-5 border-b border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary">
            <FileUp size={18} />
          </div>
          Preparation & Requirements
        </h4>
      </div>

      <div className="p-5 space-y-6">
        <div
          className={cn(
            "grid gap-6",
            isImageBased ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
          )}
        >
          {/* Excel Instructions */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-4 h-px bg-brand-primary/30" />
              Excel Data Guidelines
            </p>
            <ul className="text-xs space-y-2.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 shadow-[0_0_5px_rgba(var(--brand-primary-rgb),0.4)]" />
                <span className="leading-relaxed">
                  Dropdown selections (Subject, Level, Marks) above will act as{" "}
                  <b className="text-slate-900 dark:text-white">
                    Default Values
                  </b>{" "}
                  if not specified in Excel.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 shadow-[0_0_5px_rgba(var(--brand-primary-rgb),0.4)]" />
                <div className="space-y-1.5">
                  <p className="leading-relaxed">
                    Use official{" "}
                    <b className="text-slate-900 dark:text-white">Codes</b> for
                    these Excel columns:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[9px] font-black text-slate-700 dark:text-slate-300 shadow-sm">
                      Subject Code
                    </span>
                    <span className="px-2 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[9px] font-black text-slate-700 dark:text-slate-300 shadow-sm">
                      Exam Level Code
                    </span>
                    <Link
                      href="/admin/management/subject-level"
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors font-bold text-[9px]"
                    >
                      View Codes <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 shadow-[0_0_5px_rgba(var(--brand-primary-rgb),0.4)]" />
                <span className="leading-relaxed">
                  Maintain the exact{" "}
                  <b className="text-slate-900 dark:text-white">
                    column structure
                  </b>{" "}
                  provided in the sample template.
                </span>
              </li>
            </ul>
          </div>

          {/* Image ZIP Instructions */}
          {isImageBased && (
            <div className="space-y-3 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100/50 dark:border-purple-500/20 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <span className="w-4 h-px bg-purple-600/30" />
                Images ZIP Requirements
              </p>
              <ul className="text-xs space-y-2.5 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2.5">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 shadow-[0_0_5px_rgba(168,85,247,0.4)]" />
                  <span className="leading-relaxed">
                    Filenames in Excel (e.g. <i>image1.png</i>) must{" "}
                    <b className="text-slate-900 dark:text-white uppercase">
                      exactly match
                    </b>{" "}
                    files inside the ZIP.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 shadow-[0_0_5px_rgba(168,85,247,0.4)]" />
                  <span className="leading-relaxed">
                    Only JPG, PNG, and WEBP formats are supported.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Template Download Section integrated */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Download size={14} className="text-orange-500" />
                Download Sample Template
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Use this to ensure your data format is correct.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {questionType === QUESTION_TYPES.MULTIPLE_CHOICE && (
                <a
                  href="/templates/sample_mcq_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-3 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-green-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Normal MCQ Template
                </a>
              )}

              {questionType === QUESTION_TYPES.SUBJECTIVE && (
                <a
                  href="/templates/sample_subjective_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Subjective Template
                </a>
              )}

              {questionType === QUESTION_TYPES.IMAGE_MULTIPLE_CHOICE && (
                <a
                  href="/templates/sample_image_mcq_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Image MCQ Template
                </a>
              )}

              {questionType === QUESTION_TYPES.IMAGE_SUBJECTIVE && (
                <a
                  href="/templates/sample_image_subjective_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-3 py-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-orange-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Image Subjective Template
                </a>
              )}
              {questionType === QUESTION_TYPES.TYPING_TEST && (
                <a
                  href="/templates/sample_typing_test_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Typing Test Template
                </a>
              )}
              {questionType === QUESTION_TYPES.LEAD_GENERATION && (
                <a
                  href="/templates/sample_lead_generation_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Lead Generation Template
                </a>
              )}
              {questionType === QUESTION_TYPES.CONTACT_DETAILS && (
                <a
                  href="/templates/sample_contact_details_upload.xlsx"
                  download
                  className="flex items-center gap-2 text-[10px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20 px-3 py-2 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors shadow-sm"
                >
                  <div className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center font-black text-[10px]">
                    X
                  </div>
                  Contact Details Template
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
