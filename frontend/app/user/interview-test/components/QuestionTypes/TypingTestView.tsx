"use client";
import { memo, useState, useMemo, useCallback } from "react";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";
import { Zap, Target, AlertTriangle, Clock, Trophy } from "lucide-react";

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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Parse incoming JSON or use default
  const parsedData = useMemo(() => {
    try {
      if (!currentAnswer)
        return { typedText: "", sourcePassage: passage, stats: null };
      const parsed = JSON.parse(currentAnswer);
      // Fallback for old plain-text format
      if (typeof parsed !== "object" || parsed === null) {
        return {
          typedText: currentAnswer,
          sourcePassage: passage,
          stats: null,
        };
      }
      return {
        typedText: parsed.typed_text || "",
        sourcePassage: parsed.passage || passage,
        stats: parsed.stats || null,
      };
    } catch {
      return { typedText: currentAnswer, sourcePassage: passage, stats: null };
    }
  }, [currentAnswer, passage]);

  const typedText = parsedData.typedText;

  // Derived stats
  const stats = useMemo(() => {
    if (!startTime || typedText.length === 0) {
      return { wpm: 0, accuracy: 100, errors: 0, timeTaken: 0 };
    }

    const currentEndTime = endTime || lastActivityTime || startTime;
    const timeTakenSeconds = Math.max((currentEndTime - startTime) / 1000, 0.1);

    // Calculate correct characters
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === passage[i]) {
        correctChars++;
      }
    }

    const errors = typedText.length - correctChars;
    const accuracy = Math.round((correctChars / typedText.length) * 100);

    // Standard WPM calculation: (characters / 5) / (minutes)
    const words = typedText.length / 5;
    const minutes = timeTakenSeconds / 60;
    const wpm = Math.round(words / minutes);

    return {
      wpm,
      accuracy,
      errors,
      timeTaken: Math.round(timeTakenSeconds),
    };
  }, [typedText, passage, startTime, endTime, lastActivityTime]);

  // Local handler to track start and end time
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isFinished) return;

      const val = e.target.value;
      const now = Date.now();

      // Start timing on first character
      if (val.length === 1 && !startTime) {
        setStartTime(now);
      }

      setLastActivityTime(now);

      // Current stats for immediate persistence
      const timeTakenNow = (now - (startTime || now)) / 1000;
      let correctNow = 0;
      for (let i = 0; i < val.length; i++) {
        if (val[i] === passage[i]) correctNow++;
      }
      const wpmNow = Math.round(
        val.length / 5 / (Math.max(timeTakenNow, 0.1) / 60),
      );
      const accuracyNow = Math.round((correctNow / val.length) * 100);

      const currentStats = {
        wpm: wpmNow,
        accuracy: accuracyNow,
        errors: val.length - correctNow,
        time_taken: timeTakenNow,
      };

      // Check for completion
      if (val.length >= passage.length) {
        setIsFinished(true);
        setEndTime(now);
      }

      // Store as JSON
      onChangeAnswer(
        JSON.stringify({
          passage,
          typed_text: val,
          stats: currentStats,
        }),
      );
    },
    [startTime, isFinished, passage, onChangeAnswer],
  );

  const renderedPassage = useMemo(() => {
    return passage.split("").map((char, index) => {
      let colorClass = "text-foreground/40"; // Default
      let bgClass = "";

      if (index < typedText.length) {
        if (typedText[index] === char) {
          colorClass = "text-emerald-500 font-bold";
        } else {
          colorClass = "text-rose-500 font-bold";
          bgClass = "bg-rose-500/10";
        }
      } else if (index === typedText.length && !isFinished) {
        bgClass =
          "bg-brand-primary/20 border-b-2 border-brand-primary animate-pulse";
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
  }, [passage, typedText, isFinished]);

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
              variant="body2"
              color="text-foreground/90"
              weight="medium"
              italic
              className="font-mono leading-relaxed select-none antialiased tracking-wide whitespace-pre-wrap text-lg"
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
              className="font-mono text-[11px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md"
            >
              {typedText.length} / {passage.length} characters
            </Typography>
          </div>
        </div>

        <div className="relative group">
          <div
            className={`absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity ${isFinished ? "bg-emerald-500/10 group-focus-within:opacity-100" : "bg-brand-primary/5 group-focus-within:opacity-100"}`}
          />
          <Textarea
            rows={6}
            placeholder={
              isFinished
                ? "Test completed. Please click 'Save & Next' to continue."
                : "Focus and start typing here..."
            }
            value={typedText}
            onChange={handleInputChange}
            disabled={isFinished}
            className={`relative rounded-2xl font-mono text-lg leading-relaxed border-2 transition-all p-6 shadow-inner ${
              isFinished
                ? "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-900/40 cursor-not-allowed"
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
            variant="body5"
            className="text-amber-800/80 font-medium leading-relaxed italic"
          >
            <strong>Note:</strong> Type Complete Paragraph and Click on{" "}
            <span className="font-bold underline">
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
