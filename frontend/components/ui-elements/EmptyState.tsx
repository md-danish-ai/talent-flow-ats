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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative flex flex-col items-center justify-center py-20 px-10 text-center w-full flex-1 h-full min-h-[500px] overflow-hidden transition-all duration-700",
        !colSpan &&
          "bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/40 dark:border-white/5 shadow-[0_40px_80px_-20px_rgba(249,99,49,0.08)]",
        className,
      )}
    >
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,var(--brand-primary)_0%,transparent_70%)] blur-[100px]"
        />

        {/* Modern Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f96331 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Hero Illustration */}
      <div className="relative mb-14">
        {/* Orbiting Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 120, 240].map((rotation, i) => (
            <motion.div
              key={i}
              animate={{ rotate: [rotation, rotation + 360] }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-[220px] h-[220px] border border-dashed border-brand-primary/10 rounded-full"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-primary/30 rounded-full blur-[1px]"
              />
            </motion.div>
          ))}
        </div>

        {/* Main Composition */}
        <div className="relative group">
          {/* Back Glowing Layer */}
          <motion.div
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-[-40%] bg-brand-primary/40 blur-[80px] rounded-full"
          />

          {/* Glass Card Container */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative flex h-40 w-40 items-center justify-center rounded-[3.5rem] bg-gradient-to-tr from-white/80 via-white/40 to-white/10 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-800/10 border border-white/60 dark:border-white/5 shadow-[0_30px_70px_-10px_rgba(249,99,49,0.2)] backdrop-blur-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Internal Shimmer */}
            <motion.div
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent skew-x-[-20deg]"
            />

            {/* Icon Wrapper */}
            <div className="relative flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FinalIcon
                  className="h-16 w-16 text-brand-primary drop-shadow-[0_10px_15px_rgba(249,99,49,0.4)]"
                  strokeWidth={1}
                />
              </motion.div>

              {/* Secondary Floating Sparkles */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 text-brand-primary/40"
              >
                <Sparkles size={24} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Textual Information */}
      <div className="relative z-10 space-y-6 max-w-[500px]">
        <div className="space-y-3">
          <Typography
            variant="h1"
            weight="black"
            className="text-slate-900 dark:text-white tracking-tight leading-[1.1] text-4xl"
          >
            {title}
          </Typography>
          <div className="h-1 w-12 bg-brand-primary/40 mx-auto rounded-full" />
        </div>

        <Typography
          variant="body1"
          className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed opacity-80"
        >
          {description}
        </Typography>
      </div>

      {/* Ambient Floor Highlight */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full h-[40%] bg-gradient-to-t from-brand-primary/5 to-transparent blur-[100px] rounded-full pointer-events-none" />
    </motion.div>
  );

  if (colSpan) {
    return (
      <tr className="border-none hover:bg-transparent h-full">
        <td colSpan={colSpan} className="p-0 border-none h-full align-middle">
          <div className="bg-transparent h-full flex flex-col items-center justify-center min-h-[550px]">
            {content}
          </div>
        </td>
      </tr>
    );
  }

  return content;
}
