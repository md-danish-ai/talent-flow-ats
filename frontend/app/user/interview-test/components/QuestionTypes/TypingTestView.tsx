"use client";
import { memo, useState, useMemo, useCallback, useEffect } from "react";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";
import { Zap, Target, AlertTriangle, Clock, Trophy } from "lucide-react";
import {
  calculateTypingStats,
  getTypingAlignment,
} from "@lib/utils/typingUtils";

interface TypingTestViewProps {
  questionText: string;
  passage: string;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const TypingTestView = memo(function TypingTestView({
  questionText,
  passage,
  currentAnswer,
  onChangeAnswer,
}: TypingTestViewProps) {
  // Parse once purely for initialization injection (pure, idempotent memoization)
  const initialParsed = useMemo(() => {
    if (!currentAnswer) return null;
    try {
      const parsed = JSON.parse(currentAnswer);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // ignore
    }
    return null;
  }, [currentAnswer]);

  // Always fresh on reload — typed text reset to empty
  const [localTypedText, setLocalTypedText] = useState<string>("");

  // Smooth resuming: deduce past startTime based on elapsed seconds recorded during mount
  // Timer always starts fresh on reload — user types kare tab hi shuru hoga
  const [startTime, setStartTime] = useState<number | null>(null);

  const [endTime, setEndTime] = useState<number | null>(null);
  const [liveTime, setLiveTime] = useState<number>(() => Date.now());

  // Always false on reload — user dobara type karega
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Live Ticking Clock effect updating every 100ms to yield fluid real-time WPM and Duration metrics
  useEffect(() => {
    if (!startTime || isFinished) return;

    const timer = setInterval(() => {
      setLiveTime(Date.now());
    }, 100);

    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  // Pure Real-Time Derived Stats (triggers instantaneously upon state/ticking adjustments!)
  const stats = useMemo(() => {
    if (!startTime || localTypedText.length === 0) {
      return { wpm: 0, accuracy: 100, errors: 0, timeTaken: 0 };
    }

    const finalActiveTime = isFinished ? endTime || liveTime : liveTime;
    const timeTakenSeconds = Math.max(
      (finalActiveTime - startTime) / 1000,
      0.1,
    );

    return calculateTypingStats(localTypedText, passage, timeTakenSeconds);
  }, [localTypedText, passage, startTime, endTime, liveTime, isFinished]);

  // Optimized zero-latency local change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const now = Date.now();

      // Clock initiates the absolute millisecond the first character is registered
      let actualStart = startTime;
      if (val.length > 0 && !startTime) {
        actualStart = now;
        setStartTime(now);
        setLiveTime(now);
      }

      // Instantly update local typing state to prevent UI visual lag
      setLocalTypedText(val);

      // Run instantaneous stat projections for accurate DB snapshot logging
      const activeSeconds = actualStart ? (now - actualStart) / 1000 : 0;
      const computedStats = calculateTypingStats(val, passage, activeSeconds);

      const logStats = {
        wpm: computedStats.wpm,
        accuracy: computedStats.accuracy,
        errors: computedStats.errors,
        time_taken: computedStats.timeTaken,
      };

      // Auto-complete hook when text length meets passage limit
      if (val.length >= passage.length) {
        setIsFinished(true);
        if (!endTime) setEndTime(now);
      } else {
        setIsFinished(false);
        setEndTime(null);
      }

      // Dispatches update cleanly to parent context
      onChangeAnswer(
        JSON.stringify({
          passage,
          typed_text: val,
          stats: logStats,
        }),
      );
    },
    [startTime, endTime, passage, onChangeAnswer],
  );

  const renderedPassage = useMemo(() => {
    const { matchedPassageLength, passageCharStatuses } = getTypingAlignment(
      localTypedText,
      passage,
    );

    return passage.split("").map((char, index) => {
      let colorClass = "text-foreground/40"; // Default
      let bgClass = "";

      if (index < matchedPassageLength) {
        const status = passageCharStatuses[index];
        if (status === "correct") {
          colorClass = "text-emerald-500 font-bold";
        } else if (status === "error") {
          colorClass = "text-rose-500 font-bold";
          bgClass = "bg-rose-500/10";
        }
      } else if (index === matchedPassageLength && !isFinished) {
        bgClass =
          char === " "
            ? "bg-brand-primary/30 rounded animate-pulse"
            : "bg-brand-primary/20 border-b-2 border-brand-primary animate-pulse";
      }

      return (
        <span
          key={index}
          className={`${colorClass} ${bgClass} transition-colors duration-150 rounded-[2px]`}
        >
          {char}
        </span>
      );
    });
  }, [passage, localTypedText, isFinished]);

  return (
    <div className="space-y-6 pt-2 text-foreground">
      {/* Real-time Stats Bar */}
      <div className="grid grid-cols-4 gap-4 animate-in fade-in zoom-in duration-500">
        {[
          {
            label: "WPM",
            value: stats.wpm,
            icon: Zap,
            color: "text-brand-primary",
          },
          {
            label: "Accuracy",
            value: `${stats.accuracy}%`,
            icon: Target,
            color: "text-emerald-500",
          },
          {
            label: "Errors",
            value: stats.errors,
            icon: AlertTriangle,
            color: "text-rose-500",
          },
          {
            label: "Time",
            value: `${stats.timeTaken}s`,
            icon: Clock,
            color: "text-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:border-brand-primary/20"
          >
            <stat.icon size={16} className={`${stat.color} mb-1`} />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest text-[9px] text-muted-foreground"
            >
              {stat.label}
            </Typography>
            <Typography
              variant="body3"
              weight="bold"
              className="tracking-tight"
            >
              {stat.value}
            </Typography>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {/* Question Section */}
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest mr-1"
            >
              Instructions
            </Typography>
          </div>
          <div className="p-5">
            <Typography
              variant="body2"
              weight="semibold"
              color="text-foreground"
              className="leading-relaxed tracking-tight"
            >
              {questionText}
            </Typography>
          </div>
        </div>

        {/* Typing Source card */}
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest mr-1"
            >
              Typing Source
            </Typography>
          </div>
          <div className="p-7">
            <Typography
              variant="body1"
              color="text-foreground"
              weight="semibold"
              className="font-mono leading-relaxed select-none antialiased tracking-wide whitespace-pre-wrap text-xl"
            >
              {renderedPassage}
            </Typography>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-2">
          <div className="flex items-center gap-2">
            <Typography
              variant="body4"
              className={`font-black uppercase tracking-widest text-[11px] ${isFinished ? "text-emerald-600" : "text-brand-primary"}`}
            >
              {isFinished ? "✓ Typing Completed" : "Start Typing Below"}
            </Typography>
            {!isFinished && (
              <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <Typography
              variant="body5"
              className={`font-mono text-[11px] font-bold px-3 py-1 rounded-lg border transition-all duration-300 ${isFinished
                  ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                  : "text-brand-primary bg-brand-primary/10 border-brand-primary/20"
                }`}
            >
              {localTypedText.length} / {passage.length} characters
            </Typography>
          </div>
        </div>

        <div className="relative group">
          <div
            className={`absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity ${isFinished ? "bg-emerald-500/10 group-focus-within:opacity-100" : "bg-brand-primary/5 group-focus-within:opacity-100"}`}
          />
          <Textarea
            rows={6}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm={false}
            data-gramm_editor={false}
            data-enable-grammarly={false}
            placeholder="Focus and start typing here..."
            value={localTypedText}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className={`relative rounded-2xl font-mono text-lg leading-relaxed border-2 transition-all p-6 shadow-inner ${isFinished
                ? "bg-emerald-500/[0.02] border-emerald-500/20 focus:border-emerald-500 focus:bg-background focus:ring-[8px] focus:ring-emerald-500/10"
                : "bg-muted/10 border-border focus:border-brand-primary focus:bg-background focus:ring-[8px] focus:ring-brand-primary/10"
              }`}
          />
        </div>

        {/* Mandatory Note */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="mt-0.5 p-1 rounded-md bg-amber-500/10 text-amber-600">
            <Clock size={14} />
          </div>
          <Typography
            variant="body4"
            className="text-amber-500 font-bold leading-relaxed italic"
          >
            <strong className="text-amber-600 uppercase tracking-wider text-[11px] mr-1">
              Note:
            </strong>{" "}
            Type Complete Paragraph and Click on{" "}
            <span className="font-black underline decoration-2 underline-offset-4">
              &quot;Save &amp; Next&quot;
            </span>
            . You will not be able to come back on this section.
          </Typography>
        </div>

        {/* Completion Success Message */}
        {isFinished && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 animate-in zoom-in duration-500">
            <div className="p-2 rounded-full bg-emerald-500/20">
              <Trophy size={20} />
            </div>
            <div>
              <Typography
                variant="body4"
                weight="black"
                className="uppercase tracking-wide leading-none"
              >
                Typing Finished Successfully!
              </Typography>
              <Typography variant="body5" className="mt-1 opacity-80">
                Great job! Your performance data has been logged. Please click
                &quot;Save &amp; Next&quot; to proceed with the interview.
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
