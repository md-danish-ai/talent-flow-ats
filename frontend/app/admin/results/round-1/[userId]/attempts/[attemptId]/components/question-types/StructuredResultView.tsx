"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { type AdminUserResultAnswer } from "@types";
import { STYLE_CONFIG } from "@lib/config/style";
import { humanizeString } from "@lib/utils";

interface StructuredResultViewProps {
  answer: AdminUserResultAnswer;
}

export const StructuredResultView = ({ answer }: StructuredResultViewProps) => {
  const getParsedData = (
    dataString?: string | null,
    fallbackSource?: unknown,
  ) => {
    let displayData = dataString;

    // Safely check if fallbackSource is an object instead of an array without relying on explicit 'any'
    if (!displayData && fallbackSource && !Array.isArray(fallbackSource)) {
      try {
        displayData =
          typeof fallbackSource === "string"
            ? fallbackSource
            : JSON.stringify(fallbackSource);
      } catch {
        displayData = null;
      }
    }

    if (
      displayData &&
      typeof displayData === "string" &&
      displayData.trim().startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(displayData);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    return null;
  };

  const expectedParsed = getParsedData(
    answer.correct_answer || answer.passage,
    answer.options,
  );
  const candidateParsed = getParsedData(answer.user_answer);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Expected Structured Answer */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-emerald-500/10 bg-emerald-500/[0.03] p-5 animate-in fade-in slide-in-from-top-4 duration-500`}
      >
        <Typography
          variant="body5"
          className="font-black text-emerald-600/60 mb-2 uppercase tracking-widest font-mono"
        >
          EXPECTED DATASTRUCTURE
        </Typography>

        {expectedParsed ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {Object.entries(expectedParsed).map(([key, value]) => {
              const label = humanizeString(
                key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              );
              return (
                <div
                  key={key}
                  className={`p-3 ${STYLE_CONFIG.innerCardRadius} bg-emerald-500/[0.03] border border-emerald-500/10 shadow-sm transition-all hover:bg-emerald-500/5`}
                >
                  <Typography
                    variant="body5"
                    className="font-black text-[9px] uppercase tracking-wider text-emerald-600/50 mb-1 leading-none"
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-bold text-emerald-700/80 break-words leading-tight text-sm md:text-base"
                  >
                    {String(value || "N/A")}
                  </Typography>
                </div>
              );
            })}
          </div>
        ) : (
          <Typography
            as="div"
            variant="body2"
            className="font-mono leading-relaxed italic text-muted-foreground text-sm md:text-base"
          >
            {answer.correct_answer || answer.passage || "N/A"}
          </Typography>
        )}
      </div>

      {/* Candidate Structured Response */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-black/[0.03] bg-black/[0.02] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700`}
      >
        <Typography
          variant="body5"
          className="font-black text-muted-foreground/60 mb-2 uppercase tracking-widest"
        >
          CANDIDATE DATASTRUCTURE RESPONSE
        </Typography>

        {candidateParsed ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {Object.entries(candidateParsed).map(([key, value]) => {
              const label = humanizeString(
                key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
              );
              return (
                <div
                  key={key}
                  className={`p-3 ${STYLE_CONFIG.innerCardRadius} bg-white/40 border border-black/[0.03] shadow-sm`}
                >
                  <Typography
                    variant="body5"
                    className="font-black text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1 leading-none"
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-bold text-foreground break-words leading-tight text-sm md:text-base"
                  >
                    {String(value || "N/A")}
                  </Typography>
                </div>
              );
            })}
          </div>
        ) : (
          <Typography
            as="div"
            variant="body2"
            className="font-mono leading-relaxed text-foreground text-sm md:text-base"
          >
            {answer.user_answer || "No response recorded."}
          </Typography>
        )}
      </div>
    </div>
  );
};
