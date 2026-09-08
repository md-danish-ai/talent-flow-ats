"use client";

import React from "react";
import { Gauge, Target, AlertCircle, Timer } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { type AdminUserResultAnswer, type TypingStats } from "@types";
import { STYLE_CONFIG } from "@lib/config/style";
import { getTypingDiffTokens } from "@lib/utils/typingUtils";

interface TypingResultViewProps {
  answer: AdminUserResultAnswer;
}

export const TypingResultView = ({ answer }: TypingResultViewProps) => {
  // Safely parse JSON payload if answer.user_answer is a stringified JSON object
  const parsedPayload = React.useMemo(() => {
    if (
      typeof answer.user_answer === "string" &&
      answer.user_answer.startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(answer.user_answer);
        if (parsed && typeof parsed === "object") {
          return {
            typedText:
              typeof parsed.typed_text === "string"
                ? parsed.typed_text
                : answer.user_answer,
            stats: (parsed.stats as TypingStats) || null,
          };
        }
      } catch {
        // Fall back to raw string
      }
    }
    return {
      typedText: answer.user_answer || "",
      stats: null,
    };
  }, [answer.user_answer]);

  const typedText = parsedPayload.typedText;
  const stats = answer.typing_stats || parsedPayload.stats;
  const sourceText = answer.correct_answer || (answer.passage as string) || "";

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {[
            {
              label: "Speed",
              value: `${stats.wpm} WPM`,
              color: "text-amber-500 dark:text-amber-400",
              icon: (
                <Gauge
                  className="text-amber-500 dark:text-amber-400"
                  size={16}
                />
              ),
              accentBg: "bg-amber-500/10 dark:bg-amber-500/5",
              accentBorder:
                "hover:border-amber-500/30 hover:shadow-amber-500/[0.03]",
            },
            {
              label: "Accuracy",
              value: `${stats.accuracy}%`,
              color: "text-emerald-600 dark:text-emerald-400",
              icon: (
                <Target
                  className="text-emerald-600 dark:text-emerald-400"
                  size={16}
                />
              ),
              accentBg: "bg-emerald-500/10 dark:bg-emerald-500/5",
              accentBorder:
                "hover:border-emerald-500/30 hover:shadow-emerald-500/[0.03]",
            },
            {
              label: "Errors",
              value: stats.errors,
              color: "text-rose-500 dark:text-rose-400",
              icon: (
                <AlertCircle
                  className="text-rose-500 dark:text-rose-400"
                  size={16}
                />
              ),
              accentBg: "bg-rose-500/10 dark:bg-rose-500/5",
              accentBorder:
                "hover:border-rose-500/30 hover:shadow-rose-500/[0.03]",
            },
            {
              label: "Duration",
              value: `${Math.round(stats.time_taken)}s`,
              color: "text-indigo-500 dark:text-indigo-400",
              icon: (
                <Timer
                  className="text-indigo-500 dark:text-indigo-400"
                  size={16}
                />
              ),
              accentBg: "bg-indigo-500/10 dark:bg-indigo-500/5",
              accentBorder:
                "hover:border-indigo-500/30 hover:shadow-indigo-500/[0.03]",
            },
          ].map((statItem, i) => (
            <div
              key={i}
              className={`group/stat p-3 ${STYLE_CONFIG.innerCardRadius} border border-border/50 dark:border-white/[0.04] bg-card/60 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow flex items-center justify-between relative overflow-hidden ${statItem.accentBorder}`}
            >
              <div className="space-y-0.5 relative z-10">
                <Typography
                  variant="body5"
                  className="font-bold text-muted-foreground/70 uppercase tracking-wider text-[10px] select-none"
                >
                  {statItem.label}
                </Typography>
                <Typography
                  variant="h3"
                  className={`font-black ${statItem.color} tracking-tight text-xl select-none leading-none`}
                >
                  {statItem.value}
                </Typography>
              </div>

              <div
                className={`h-8 w-8 rounded-lg ${statItem.accentBg} border border-border/20 dark:border-white/[0.02] flex items-center justify-center shadow-sm relative z-10`}
              >
                {statItem.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`${STYLE_CONFIG.innerCardRadius} border border-emerald-500/20 bg-emerald-500/[0.04] p-4 flex flex-col space-y-2`}
        >
          <Typography
            variant="body5"
            className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono text-xs"
          >
            ORIGINAL TEXT
          </Typography>
          <Typography
            as="div"
            variant="body2"
            className="font-mono leading-relaxed italic text-muted-foreground whitespace-pre-wrap text-sm flex-1"
          >
            {sourceText || "N/A"}
          </Typography>
        </div>

        <div
          className={`${STYLE_CONFIG.innerCardRadius} border border-border/70 bg-card/60 p-4 flex flex-col space-y-2`}
        >
          <Typography
            variant="body5"
            className="font-bold text-muted-foreground uppercase tracking-wider text-xs"
          >
            CANDIDATE TYPED TEXT
          </Typography>
          <Typography
            as="div"
            variant="body2"
            className="font-mono leading-relaxed whitespace-pre-wrap select-all text-sm flex-1"
          >
            {(() => {
              if (typedText && sourceText) {
                const diffTokens = getTypingDiffTokens(typedText, sourceText);
                return diffTokens.map((token, i) => (
                  <span
                    key={i}
                    className={
                      token.isCorrect
                        ? "text-foreground"
                        : "text-rose-600 bg-rose-500/10 font-bold underline decoration-rose-500/50 underline-offset-[2px]"
                    }
                  >
                    {token.text}
                  </span>
                ));
              }
              return typedText || "No response recorded.";
            })()}
          </Typography>
        </div>
      </div>
    </div>
  );
};
