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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Expected Answer Textblock */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-emerald-500/20 bg-emerald-500/[0.04] p-4 flex flex-col space-y-2`}
      >
        <Typography
          variant="body5"
          className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono text-xs"
        >
          EXPECTED ANSWER
        </Typography>
        <Typography
          as="div"
          variant="body2"
          className="font-mono leading-relaxed italic text-muted-foreground whitespace-pre-wrap text-sm flex-1"
        >
          {answer.correct_answer || answer.passage || "N/A"}
        </Typography>
      </div>

      {/* Candidate Response Textblock */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-border/70 bg-card/60 p-4 flex flex-col space-y-2`}
      >
        <Typography
          variant="body5"
          className="font-bold text-muted-foreground uppercase tracking-wider text-xs"
        >
          CANDIDATE RESPONSE
        </Typography>
        <Typography
          as="div"
          variant="body2"
          className="font-mono leading-relaxed whitespace-pre-wrap select-all text-foreground text-sm flex-1"
        >
          {answer.user_answer || "No response recorded."}
        </Typography>
      </div>
    </div>
  );
};
