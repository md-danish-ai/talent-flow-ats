"use client";
import { memo, useState, useMemo, useCallback } from "react";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";
import { ResultCard } from "@components/ui-cards/ResultCard";
import {
  Zap,
  Target,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Trophy,
} from "lucide-react";

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
        return { typedText: currentAnswer, sourcePassage: passage, stats: null };
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
      const wpmNow = Math.round(val.length / 5 / (Math.max(timeTakenNow, 0.1) / 60));
      const accuracyNow = Math.round((correctNow / val.length) * 100);

      const currentStats = {
        wpm: wpmNow,
        accuracy: accuracyNow,
        errors: val.length - correctNow,
        time_taken: timeTakenNow,
      };

      // Check for completion
      if (val.length === passage.length) {
        setIsFinished(true);
        setEndTime(now);

        console.log("Typing Test Completed!", {
          ...currentStats,
          raw_text: val,
        });
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

  if (isFinished) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-brand-primary/5 rounded-3xl border border-brand-primary/10 mb-2">
          <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mb-4 text-brand-primary animate-bounce">
            <Trophy size={32} />
          </div>
          <Typography
            variant="h3"
            weight="black"
            className="text-brand-primary uppercase tracking-tight"
          >
            Typing Test Completed
          </Typography>
          <Typography variant="body3" className="text-muted-foreground mt-2">
            Great job! Here is how you performed in this challenge.
          </Typography>
        </div>

        <ResultCard
          title="Performance Analysis"
          subtitle={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-brand-success" />
                Verified Test Result
              </span>
            </div>
          }
          status="submitted"
          avatarContent={<Trophy size={32} />}
          identityIcon={Zap}
          actionHref="#"
          actionLabel="Next Question"
          actionIcon={Zap}
          metrics={[
            {
              label: "Net Speed",
              value: `${stats.wpm} WPM`,
              icon: Zap,
              color: "text-brand-primary",
            },
            {
              label: "Accuracy",
              value: `${stats.accuracy}%`,
              icon: Target,
              color:
                stats.accuracy > 90 ? "text-brand-success" : "text-brand-warning",
            },
            {
              label: "Total Errors",
              value: stats.errors,
              icon: AlertTriangle,
              color: stats.errors === 0 ? "text-brand-success" : "text-rose-500",
            },
            {
              label: "Time Taken",
              value: `${stats.timeTaken}s`,
              icon: Clock,
              color: "text-brand-secondary",
            },
          ]}
        />

        <div className="p-6 rounded-2xl border border-border bg-muted/10">
          <Typography
            variant="body4"
            weight="bold"
            className="uppercase tracking-widest text-muted-foreground mb-4 block"
          >
            Typed Summary
          </Typography>
          <Typography
            variant="body5"
            className="font-mono text-muted-foreground leading-relaxed italic whitespace-pre-wrap"
          >
            {typedText}
          </Typography>
        </div>
      </div>
    );
  }

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
            <Typography variant="body3" weight="bold" className="tracking-tight">
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
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Typography
              variant="body4"
              className="font-bold text-brand-primary uppercase tracking-widest text-[11px]"
            >
              Start Typing Below
            </Typography>
            <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-[1px] bg-border" />
            <Typography
              variant="body5"
              className="font-mono text-[11px] text-muted-foreground"
            >
              {typedText.length} / {passage.length} characters
            </Typography>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Textarea
            rows={6}
            placeholder="Focus and start typing here..."
            value={typedText}
            onChange={handleInputChange}
            className="relative rounded-2xl font-mono text-lg leading-relaxed bg-muted/10 border-2 border-border focus:border-brand-primary focus:bg-background focus:ring-[8px] focus:ring-brand-primary/10 transition-all p-6 shadow-inner"
          />
        </div>
      </div>
    </div>
  );
});
