"use client";

import React from "react";
import { User, FileCheck2 } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";

interface ProfileSummaryStripProps {
  username: string;
  mobile: string;
  startedAt: string;
  submittedAt?: string | null;
}

export const ProfileSummaryStrip = ({
  username,
  mobile,
  startedAt,
  submittedAt,
}: ProfileSummaryStripProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-card to-brand-primary/5 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
            <User size={28} />
          </div>
          <div>
            <Typography variant="h4" className="font-bold">
              {username}
            </Typography>
            <Typography variant="body5" className="text-muted-foreground">
              {mobile}
            </Typography>
          </div>
        </div>
        <div className="h-10 w-px bg-border hidden lg:block" />
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <Typography
              variant="body5"
              className="text-muted-foreground font-bold uppercase tracking-wider mb-1"
            >
              Started At
            </Typography>
            <Typography variant="body4" className="font-bold">
              {new Date(startedAt).toLocaleString()}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body5"
              className="text-muted-foreground font-bold uppercase tracking-wider mb-1"
            >
              Submitted At
            </Typography>
            <Typography variant="body4" className="font-bold">
              {submittedAt ? new Date(submittedAt).toLocaleString() : "N/A"}
            </Typography>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <FileCheck2 size={80} />
      </div>
    </div>
  );
};
