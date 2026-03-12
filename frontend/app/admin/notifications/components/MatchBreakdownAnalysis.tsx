import React from "react";
import { Typography } from "@/components/ui-elements/Typography";
import { type MatchDetails } from "@lib/api";

interface MatchBreakdownAnalysisProps {
  scores: MatchDetails["scores"];
}

export const MatchBreakdownAnalysis: React.FC<MatchBreakdownAnalysisProps> = ({
  scores,
}) => {
  if (!scores) return null;

  return (
    <div className="border border-border/60 bg-card rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      <Typography
        variant="body3"
        weight="black"
        className="mb-6 uppercase tracking-widest text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
          MATCH RATINGS
        </span>
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
        <div className="flex items-center justify-between">
          <Typography
            variant="body5"
            className="text-muted-foreground font-medium"
          >
            Date of Birth
          </Typography>
          <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: "100%" }}></div>
          </div>
          <Typography
            variant="body4"
            weight="bold"
            className="w-[45px] text-right"
          >
            100%
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography
            variant="body5"
            className="text-muted-foreground font-medium"
          >
            Full Name
          </Typography>
          <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${scores.name >= 80 ? "bg-red-500" : "bg-orange-400"}`}
              style={{
                width: `${scores.name}%`,
              }}
            ></div>
          </div>
          <Typography
            variant="body4"
            weight="bold"
            className="w-[45px] text-right"
          >
            {scores.name.toFixed(0)}%
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography
            variant="body5"
            className="text-muted-foreground font-medium"
          >
            Father&apos;s Name
          </Typography>
          <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${scores.father >= 80 ? "bg-red-500" : "bg-orange-400"}`}
              style={{
                width: `${scores.father}%`,
              }}
            ></div>
          </div>
          <Typography
            variant="body4"
            weight="bold"
            className="w-[45px] text-right"
          >
            {scores.father.toFixed(0)}%
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography
            variant="body5"
            className="text-muted-foreground font-medium"
          >
            Mother&apos;s Name
          </Typography>
          <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${scores.mother >= 80 ? "bg-red-500" : "bg-orange-400"}`}
              style={{
                width: `${scores.mother}%`,
              }}
            ></div>
          </div>
          <Typography
            variant="body4"
            weight="bold"
            className="w-[45px] text-right"
          >
            {scores.mother.toFixed(0)}%
          </Typography>
        </div>

        {scores.personal !== undefined && (
          <div className="flex items-center justify-between">
            <Typography
              variant="body5"
              className="text-muted-foreground font-medium"
            >
              Personal Details
            </Typography>
            <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${scores.personal >= 80 ? "bg-red-500" : "bg-orange-400"}`}
                style={{
                  width: `${scores.personal}%`,
                }}
              ></div>
            </div>
            <Typography
              variant="body4"
              weight="bold"
              className="w-[45px] text-right"
            >
              {scores.personal.toFixed(0)}%
            </Typography>
          </div>
        )}
        {scores.education !== undefined && (
          <div className="flex items-center justify-between">
            <Typography
              variant="body5"
              className="text-muted-foreground font-medium"
            >
              Education
            </Typography>
            <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${scores.education >= 80 ? "bg-red-500" : "bg-orange-400"}`}
                style={{
                  width: `${scores.education}%`,
                }}
              ></div>
            </div>
            <Typography
              variant="body4"
              weight="bold"
              className="w-[45px] text-right"
            >
              {scores.education.toFixed(0)}%
            </Typography>
          </div>
        )}
        {scores.work !== undefined && (
          <div className="flex items-center justify-between">
            <Typography
              variant="body5"
              className="text-muted-foreground font-medium"
            >
              Work Experience
            </Typography>
            <div className="flex-1 mx-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${scores.work >= 80 ? "bg-red-500" : "bg-orange-400"}`}
                style={{
                  width: `${scores.work}%`,
                }}
              ></div>
            </div>
            <Typography
              variant="body4"
              weight="bold"
              className="w-[45px] text-right"
            >
              {scores.work.toFixed(0)}%
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
