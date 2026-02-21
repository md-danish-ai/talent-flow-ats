"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";

interface DocSubSectionProps {
  title: string;
  children: React.ReactNode;
}

export const DocSubSection = ({ title, children }: DocSubSectionProps) => (
  <div className="bg-card border border-border rounded-xl shadow-sm h-full flex flex-col group/section transition-all duration-300 hover:shadow-md hover:border-brand-primary/20">
    <div className="px-5 py-4 border-b border-border bg-muted/30">
      <Typography
        variant="body3"
        weight="bold"
        className="text-foreground flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 group-hover/section:bg-brand-primary transition-colors" />
        {title}
      </Typography>
    </div>
    <div className="p-6 flex flex-wrap gap-4 items-center flex-1">
      {children}
    </div>
  </div>
);
