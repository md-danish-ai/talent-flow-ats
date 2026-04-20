"use client";

import React from "react";
import { motion } from "framer-motion";
import { Inbox, SearchX, Database, LucideIcon } from "lucide-react";
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center w-full",
        !colSpan &&
          "bg-white/5 dark:bg-slate-900/5 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800",
        className,
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-brand-primary/20 blur-[40px] rounded-full scale-150 opacity-50" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 border border-brand-primary/20 shadow-[0_10px_30px_-10px_rgba(249,99,49,0.3)]">
          <FinalIcon
            className="h-10 w-10 text-brand-primary"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <Typography variant="h4" weight="bold" className="mb-2 text-foreground">
        {title}
      </Typography>

      <Typography
        variant="body3"
        className="max-w-[280px] text-slate-400 leading-relaxed font-medium"
      >
        {description}
      </Typography>

      <div className="mt-8 flex gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-brand-primary/40 animate-pulse" />
        <div className="h-1.5 w-1.5 rounded-full bg-brand-primary/20 animate-pulse delay-75" />
        <div className="h-1.5 w-1.5 rounded-full bg-brand-primary/10 animate-pulse delay-150" />
      </div>
    </motion.div>
  );

  if (colSpan) {
    return (
      <tr className="border-none hover:bg-transparent">
        <td colSpan={colSpan} className="p-0 border-none">
          {content}
        </td>
      </tr>
    );
  }

  return content;
}
