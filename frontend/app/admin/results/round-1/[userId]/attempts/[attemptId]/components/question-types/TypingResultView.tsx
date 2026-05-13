"use client";

import React from "react";
import { Gauge, Target, AlertCircle, Timer } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { type AdminUserResultAnswer } from "@types";
import { STYLE_CONFIG } from "@lib/config/style";

interface TypingResultViewProps {
  answer: AdminUserResultAnswer;
}

export const TypingResultView = ({ answer }: TypingResultViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {answer.typing_stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-1000">
          {[
            {
              label: "Speed",
              value: `${answer.typing_stats.wpm} WPM`,
              color: "text-amber-500 dark:text-amber-400",
              icon: (
                <Gauge
                  className="text-amber-500 dark:text-amber-400"
                  size={18}
                />
              ),
              accentBg: "bg-amber-500/10 dark:bg-amber-500/5",
              accentBorder:
                "hover:border-amber-500/30 hover:shadow-amber-500/[0.03]",
            },
            {
              label: "Accuracy",
              value: `${answer.typing_stats.accuracy}%`,
              color: "text-emerald-600 dark:text-emerald-400",
              icon: (
                <Target
                  className="text-emerald-600 dark:text-emerald-400"
                  size={18}
                />
              ),
              accentBg: "bg-emerald-500/10 dark:bg-emerald-500/5",
              accentBorder:
                "hover:border-emerald-500/30 hover:shadow-emerald-500/[0.03]",
            },
            {
              label: "Errors",
              value: answer.typing_stats.errors,
              color: "text-rose-500 dark:text-rose-400",
              icon: (
                <AlertCircle
                  className="text-rose-500 dark:text-rose-400"
                  size={18}
                />
              ),
              accentBg: "bg-rose-500/10 dark:bg-rose-500/5",
              accentBorder:
                "hover:border-rose-500/30 hover:shadow-rose-500/[0.03]",
            },
            {
              label: "Duration",
              value: `${Math.round(answer.typing_stats.time_taken)}s`,
              color: "text-indigo-500 dark:text-indigo-400",
              icon: (
                <Timer
                  className="text-indigo-500 dark:text-indigo-400"
                  size={18}
                />
              ),
              accentBg: "bg-indigo-500/10 dark:bg-indigo-500/5",
              accentBorder:
                "hover:border-indigo-500/30 hover:shadow-indigo-500/[0.03]",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`group/stat p-5 ${STYLE_CONFIG.innerCardRadius} border border-border/50 dark:border-white/[0.04] bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg flex items-center justify-between relative overflow-hidden ${stat.accentBorder}`}
            >
              {/* Subtle background glow flare */}
              <div
                className={`absolute -top-6 -right-6 w-20 h-20 ${stat.accentBg} rounded-full blur-xl opacity-60 group-hover/stat:opacity-100 transition-all duration-500 pointer-events-none`}
              />

              <div className="space-y-1.5 relative z-10">
                <Typography
                  variant="body5"
                  className="font-black text-muted-foreground/60 uppercase tracking-widest text-[10px] select-none"
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h2"
                  className={`font-black ${stat.color} tracking-tighter text-2xl md:text-3xl bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text select-none`}
                >
                  {stat.value}
                </Typography>
              </div>

              <div
                className={`h-10 w-10 rounded-lg ${stat.accentBg} border border-border/20 dark:border-white/[0.02] flex items-center justify-center shadow-sm relative z-10 group-hover/stat:scale-110 transition-all duration-300`}
              >
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-emerald-500/10 bg-emerald-500/[0.03] p-5 animate-in fade-in slide-in-from-top-4 duration-500`}
      >
        <Typography
          variant="body5"
          className="font-black text-emerald-600/60 mb-2 uppercase tracking-widest font-mono"
        >
          ORIGINAL TEXT
        </Typography>
        <Typography
          as="div"
          variant="body2"
          className="font-mono leading-relaxed italic text-muted-foreground whitespace-pre-wrap text-sm md:text-base"
        >
          {answer.correct_answer || answer.passage || "N/A"}
        </Typography>
      </div>

      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-black/[0.03] bg-black/[0.02] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700`}
      >
        <Typography
          variant="body5"
          className="font-black text-muted-foreground/60 mb-2 uppercase tracking-widest"
        >
          CANDIDATE TYPED TEXT
        </Typography>
        <Typography
          as="div"
          variant="body2"
          className="font-mono leading-relaxed whitespace-pre-wrap select-all text-sm md:text-base"
        >
          {(() => {
            if (
              answer.user_answer &&
              (answer.correct_answer || answer.passage)
            ) {
              return (answer.user_answer as string).split("").map((char, i) => {
                const source =
                  answer.correct_answer || (answer.passage as string);
                const isCorrect = char === source[i];
                return (
                  <span
                    key={i}
                    className={
                      isCorrect
                        ? "text-foreground"
                        : "text-rose-600 bg-rose-500/10 font-black underline decoration-rose-500/50 underline-offset-[3px]"
                    }
                  >
                    {char}
                  </span>
                );
              });
            }
            return answer.user_answer || "No response recorded.";
          })()}
        </Typography>
      </div>
    </div>
  );
};
