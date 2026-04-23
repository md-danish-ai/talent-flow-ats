"use client";

import React from "react";
import { motion } from "framer-motion";
import { Inbox, SearchX, Database, LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@lib/utils";
import { Typography } from "./Typography";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "search" | "database";
  colSpan?: number; // If provided, wraps in TableRow and TableCell
}

export function EmptyState({
  icon: Icon,
  title = "No data found",
  description = "There are no records matching your request at the moment.",
  className,
  variant = "default",
  colSpan,
}: EmptyStateProps) {
  // Select default icon based on variant if no icon is provided
  const DefaultIcon = {
    default: Inbox,
    search: SearchX,
    database: Database,
  }[variant];

  const FinalIcon = Icon || DefaultIcon;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col items-center justify-center p-16 text-center w-full overflow-hidden transition-all duration-500",
        !colSpan &&
          "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/20 dark:border-white/5 shadow-2xl shadow-brand-primary/5",
        className,
      )}
    >
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative group cursor-default">
        {/* Animated Glow Layers */}
        <div className="absolute inset-0 bg-brand-primary/30 blur-[45px] rounded-full scale-150 opacity-40 group-hover:opacity-70 group-hover:scale-[1.8] transition-all duration-700 animate-pulse" />
        <div className="absolute inset-0 bg-brand-primary/10 blur-[20px] rounded-full scale-110 opacity-60 group-hover:opacity-90 transition-all duration-500" />

        {/* Icon Container */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-white/90 to-white/40 dark:from-slate-800/90 dark:to-slate-800/40 border border-white/50 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(249,99,49,0.25)] backdrop-blur-xl"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-primary/10 to-transparent opacity-50" />
          <FinalIcon
            className="h-11 w-11 text-brand-primary drop-shadow-sm"
            strokeWidth={1.5}
          />

          {/* Floating Sparkles for extra flair */}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute -top-1 -right-1 text-brand-primary/40"
          >
            <Sparkles size={16} />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mt-10 z-10">
        <Typography
          variant="h2"
          weight="black"
          className="mb-4 text-slate-800 dark:text-slate-50 tracking-tighter"
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          className="max-w-[420px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium mx-auto opacity-90"
        >
          {description}
        </Typography>
      </div>

      {/* Modern Status Indicator dots */}
      <div className="mt-12 flex items-center justify-center gap-4">
        <span className="flex h-2 w-2 animate-bounce rounded-full bg-brand-primary" />
        <span className="flex h-2 w-2 animate-bounce rounded-full bg-brand-primary/60 [animation-delay:0.2s]" />
        <span className="flex h-2 w-2 animate-bounce rounded-full bg-brand-primary/30 [animation-delay:0.4s]" />
      </div>

      {/* Background radial highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </motion.div>
  );

  if (colSpan) {
    return (
      <tr className="border-none hover:bg-transparent">
        <td colSpan={colSpan} className="p-0 border-none">
          <div className="bg-transparent">{content}</div>
        </td>
      </tr>
    );
  }

  return content;
}
