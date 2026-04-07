"use client";

import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import React from "react";

interface PerformanceGridProps {
  scoreStats: {
    label: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
  }[];
}

export const PerformanceGrid = ({ scoreStats }: PerformanceGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {scoreStats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * idx }}
          whileHover={{ y: -5 }}
          className={`group relative overflow-hidden rounded-3xl border ${stat.border} bg-card backdrop-blur-xl p-5 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all duration-500 hover:border-brand-primary/30`}
        >
          <div className="relative z-10 flex flex-col gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border ${stat.border} shadow-inner`}
            >
              {React.isValidElement(stat.icon)
                ? React.cloneElement(
                    stat.icon as React.ReactElement<{ size?: number }>,
                    { size: 24 },
                  )
                : stat.icon}
            </div>
            <div>
              <Typography
                variant="body5"
                className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-[10px] mb-1"
              >
                {stat.label}
              </Typography>
              <div className="flex items-baseline gap-2">
                <Typography
                  variant="h1"
                  className="font-black leading-none sm:text-4xl"
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body5"
                  className="text-muted-foreground font-black uppercase text-[11px] tracking-tighter"
                >
                  {stat.sub}
                </Typography>
              </div>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div
            className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${stat.bg} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700`}
          />
        </motion.div>
      ))}
    </div>
  );
};
