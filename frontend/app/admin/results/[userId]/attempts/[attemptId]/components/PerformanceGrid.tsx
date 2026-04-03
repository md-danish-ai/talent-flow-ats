"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scoreStats.map((stat, idx) => (
        <div
          key={idx}
          className={`group relative overflow-hidden rounded-3xl border ${stat.border} bg-card p-6 shadow-sm transition-all hover:shadow-md`}
        >
          <div className="relative z-10 flex items-center gap-5">
            <div
              className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 border ${stat.border}`}
            >
              {stat.icon}
            </div>
            <div>
              <Typography
                variant="body5"
                className="font-bold uppercase tracking-widest text-muted-foreground"
              >
                {stat.label}
              </Typography>
              <div className="flex items-baseline gap-2">
                <Typography variant="h1" className="font-black leading-none">
                  {stat.value}
                </Typography>
                <Typography
                  variant="body5"
                  className="text-muted-foreground font-bold"
                >
                  {stat.sub}
                </Typography>
              </div>
            </div>
          </div>
          <div
            className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full ${stat.bg} blur-3xl opacity-40`}
          />
        </div>
      ))}
    </div>
  );
};
