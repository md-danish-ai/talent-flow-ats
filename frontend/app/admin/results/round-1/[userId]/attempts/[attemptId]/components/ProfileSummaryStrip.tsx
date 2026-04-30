"use client";

import { User, Calendar, Clock, CheckCircle, History } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { motion } from "framer-motion";
import { formatDate, formatTime, parseUTCDate } from "@lib/utils";

interface ProfileSummaryStripProps {
  username: string;
  mobile: string;
  paperName: string;
  startedAt: string;
  submittedAt?: string | null;
}

export const ProfileSummaryStrip = ({
  username,
  mobile,
  paperName,
  startedAt,
  submittedAt,
}: ProfileSummaryStripProps) => {
  const calculateDuration = (start: string, end?: string | null) => {
    if (!start || !end) return "N/A";
    const s = parseUTCDate(start).getTime();
    const e = parseUTCDate(end).getTime();
    const diff = Math.max(0, e - s);
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const duration = calculateDuration(startedAt, submittedAt);

  return (
    <div className="space-y-6">
      {/* User Info Bar */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 px-2"
      >
        <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
          <User size={24} />
        </div>
        <div>
          <Typography
            variant="h3"
            className="font-black tracking-tight leading-none mb-1.5 flex items-center gap-3"
          >
            {username}
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground font-black tracking-widest text-[9px] uppercase opacity-60"
          >
            {mobile}
          </Typography>
        </div>
      </motion.div>

      {/* Time Stats Strip (As per Image) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card backdrop-blur-xl p-5 shadow-2xl shadow-slate-300/30 dark:shadow-none"
      >
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-0">
          {/* Paper Name */}
          <div className="flex-[1.2] px-4 flex flex-col gap-2">
            <Typography
              variant="body5"
              className="font-black uppercase tracking-[0.2em] text-muted-foreground text-[10px]"
            >
              Paper
            </Typography>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                <Typography
                  variant="body5"
                  className="font-black text-brand-primary text-[10px]"
                >
                  SET
                </Typography>
              </div>
              <Typography
                variant="h4"
                className="font-black text-foreground truncate max-w-[140px]"
              >
                {paperName}
              </Typography>
            </div>
          </div>

          <div className="hidden md:block w-px bg-border my-2" />

          {/* Date */}
          <div className="flex-1 px-8 flex flex-col gap-2 border-l-0 md:border-l border-transparent">
            <Typography
              variant="body5"
              className="font-black uppercase tracking-[0.2em] text-muted-foreground text-[10px]"
            >
              Date
            </Typography>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-brand-primary" />
              <Typography variant="h4" className="font-black text-foreground">
                {formatDate(startedAt)}
              </Typography>
            </div>
          </div>

          <div className="hidden md:block w-px bg-border my-2" />

          {/* Started At */}
          <div className="flex-1 px-8 flex flex-col gap-2">
            <Typography
              variant="body5"
              className="font-black uppercase tracking-[0.2em] text-muted-foreground text-[10px]"
            >
              Started At
            </Typography>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-orange-500" />
              <Typography variant="h4" className="font-black text-foreground">
                {formatTime(startedAt)}
              </Typography>
            </div>
          </div>

          <div className="hidden md:block w-px bg-border my-2" />

          {/* Submitted At */}
          <div className="flex-1 px-8 flex flex-col gap-2">
            <Typography
              variant="body5"
              className="font-black uppercase tracking-[0.2em] text-muted-foreground text-[10px]"
            >
              Submitted At
            </Typography>
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-500" />
              <Typography variant="h4" className="font-black text-foreground">
                {submittedAt ? formatTime(submittedAt) : "N/A"}
              </Typography>
            </div>
          </div>

          <div className="hidden md:block w-px bg-border my-2" />

          {/* Duration */}
          <div className="flex-1 px-8 flex flex-col gap-2">
            <Typography
              variant="body5"
              className="font-black uppercase tracking-[0.2em] text-muted-foreground text-[10px]"
            >
              Duration
            </Typography>
            <div className="flex items-center gap-3">
              <History size={18} className="text-brand-primary" />
              <Typography
                variant="h4"
                className="font-black text-brand-primary"
              >
                {duration}
              </Typography>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
