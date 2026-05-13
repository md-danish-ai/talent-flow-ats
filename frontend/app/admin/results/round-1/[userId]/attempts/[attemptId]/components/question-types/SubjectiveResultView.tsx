"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { type AdminUserResultAnswer } from "@types";
import { STYLE_CONFIG } from "@lib/config/style";

interface SubjectiveResultViewProps {
  answer: AdminUserResultAnswer;
}

export const SubjectiveResultView = ({ answer }: SubjectiveResultViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Expected Answer Textblock */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-emerald-500/10 bg-emerald-500/[0.03] p-5 animate-in fade-in slide-in-from-top-4 duration-500`}
      >
        <Typography
          variant="body5"
          className="font-black text-emerald-600/60 mb-2 uppercase tracking-widest font-mono"
        >
          EXPECTED ANSWER
        </Typography>
        <Typography
          as="div"
          variant="body2"
          className="font-mono leading-relaxed italic text-muted-foreground whitespace-pre-wrap text-sm md:text-base"
        >
          {answer.correct_answer || answer.passage || "N/A"}
        </Typography>
      </div>

      {/* Candidate Response Textblock */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-black/[0.03] bg-black/[0.02] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700`}
      >
        <Typography
          variant="body5"
          className="font-black text-muted-foreground/60 mb-2 uppercase tracking-widest"
        >
          CANDIDATE RESPONSE
        </Typography>
        <Typography
          as="div"
          variant="body2"
          className="font-mono leading-relaxed whitespace-pre-wrap select-all text-sm md:text-base"
        >
          {answer.user_answer || "No response recorded."}
        </Typography>
      </div>
    </div>
  );
};
