"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";

export const DocFooter = () => (
  <footer className="mt-32 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-8 opacity-60 pb-12">
    <div className="flex items-center gap-3 group">
      <div className="w-6 h-6 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
        <Sparkles size={14} />
      </div>
      <Typography
        variant="body5"
        weight="black"
        className="tracking-widest uppercase text-[10px]"
      >
        TalentFlow Design System
      </Typography>
    </div>
    <div className="flex gap-8">
      {["System Status", "License", "Support"].map((item) => (
        <Typography
          key={item}
          variant="body5"
          weight="bold"
          className="cursor-pointer hover:text-brand-primary transition-colors text-[11px] underline-offset-4 hover:underline"
        >
          {item}
        </Typography>
      ))}
    </div>
  </footer>
);
