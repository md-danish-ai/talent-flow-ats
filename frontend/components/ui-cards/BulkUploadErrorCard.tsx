"use client";

import React from "react";
import { cn } from "@lib/utils";

interface UploadError {
  row: number;
  errors: string[];
}

interface BulkUploadErrorCardProps {
  errors: UploadError[];
  className?: string;
}

export function BulkUploadErrorCard({
  errors,
  className,
}: BulkUploadErrorCardProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-error/5 border border-error/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500",
        className,
      )}
    >
      <h4 className="text-sm font-bold text-error flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
        Found {errors.length} validation errors:
      </h4>
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {errors.map((err, idx) => (
          <div
            key={idx}
            className="text-xs space-y-1.5 bg-white/[0.03] border-l-2 border-error/40 p-3 rounded-r-xl transition-all hover:bg-white/[0.05]"
          >
            <p className="font-bold text-error/90 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-error/10 text-[10px]">
                ROW {err.row}
              </span>
            </p>
            <ul className="space-y-1 pl-1 text-muted-foreground/80 dark:text-slate-400">
              {err.errors.map((msg, mIdx) => (
                <li key={mIdx} className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 rounded-full bg-error/30 shrink-0" />
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
