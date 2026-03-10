import React from "react";
import { type MatchDetails } from "@lib/api";

interface DuplicateUserCardsProps {
  matchDetails: MatchDetails;
}

const getDateStr = (val: string | undefined | null) => {
  return val ? new Date(val).toLocaleDateString() : "-";
};

export const DuplicateUserCards: React.FC<DuplicateUserCardsProps> = ({
  matchDetails,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Matched User Card (Pre-existing) */}
      <div className="relative overflow-hidden border-2 border-solid border-brand-primary/20 bg-brand-primary/5 rounded-xl flex flex-col h-full shadow-sm">
        <div className="px-5 py-3 border-b border-solid border-brand-primary/10 bg-brand-primary/10 flex items-center justify-between">
          <span className="text-xs font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary/60"></div>
            Pre-existing System Profile
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col space-y-5">
          <div className="bg-background/80 rounded-xl p-5 grid grid-cols-2 gap-x-4 gap-y-5 shadow-sm ring-1 ring-brand-primary/10">
            <div>
              <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-1">
                Registered
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.matched_user.created_at
                  ? getDateStr(matchDetails.matched_user.created_at)
                  : "-"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-1">
                Full Name
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.matched_user.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-1">
                Date of Birth
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.matched_user.dob || "-"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-1">
                City
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.matched_user.city || "-"}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-1">
                Father&apos;s Name
              </span>
              <span
                className="text-sm font-semibold text-foreground truncate block"
                title={matchDetails.matched_user.father || ""}
              >
                {matchDetails.matched_user.father || "-"}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-1">
                Mother&apos;s Name
              </span>
              <span
                className="text-sm font-semibold text-foreground truncate block"
                title={matchDetails.matched_user.mother || ""}
              >
                {matchDetails.matched_user.mother || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-auto">
            <div>
              <span className="flex items-center gap-2 text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest mb-2">
                Education History
              </span>
              <span className="text-[11px] font-medium text-foreground leading-relaxed block p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 shadow-inner">
                {matchDetails.matched_user.education ||
                  "No education details provided."}
              </span>
            </div>
            <div>
              <span className="flex items-center gap-2 text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest mb-2">
                Work Experience
              </span>
              <span className="text-[11px] font-medium text-foreground leading-relaxed block p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 shadow-inner">
                {matchDetails.matched_user.work ||
                  "No work experience provided."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New User Card */}
      <div className="relative overflow-hidden border-2 border-dashed border-blue-500/40 bg-blue-500/5 rounded-xl flex flex-col h-full shadow-sm">
        <div className="px-5 py-3 border-b border-dashed border-blue-500/20 bg-blue-500/10 flex items-center justify-between">
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            Incoming User Data
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col space-y-5">
          <div className="bg-background/80 rounded-xl p-5 grid grid-cols-2 gap-x-4 gap-y-5 shadow-sm ring-1 ring-blue-500/10">
            <div>
              <span className="text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest block mb-1">
                Attempted Reg.
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.new_user.created_at
                  ? getDateStr(matchDetails.new_user.created_at)
                  : "-"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest block mb-1">
                Full Name
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.new_user.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest block mb-1">
                Date of Birth
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.new_user.dob || "-"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest block mb-1">
                City
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchDetails.new_user.city || "-"}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest block mb-1">
                Father&apos;s Name
              </span>
              <span
                className="text-sm font-semibold text-foreground truncate block"
                title={matchDetails.new_user.father || ""}
              >
                {matchDetails.new_user.father || "-"}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest block mb-1">
                Mother&apos;s Name
              </span>
              <span
                className="text-sm font-semibold text-foreground truncate block"
                title={matchDetails.new_user.mother || ""}
              >
                {matchDetails.new_user.mother || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-auto">
            <div>
              <span className="flex items-center gap-2 text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest mb-2">
                Education History
              </span>
              <span className="text-[11px] font-medium text-foreground leading-relaxed block p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 shadow-inner">
                {matchDetails.new_user.education ||
                  "No education details provided."}
              </span>
            </div>
            <div>
              <span className="flex items-center gap-2 text-[9px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest mb-2">
                Work Experience
              </span>
              <span className="text-[11px] font-medium text-foreground leading-relaxed block p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 shadow-inner">
                {matchDetails.new_user.work || "No work experience provided."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
