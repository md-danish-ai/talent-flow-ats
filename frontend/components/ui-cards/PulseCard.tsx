import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";

interface PulseCardProps {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const PulseCard: React.FC<PulseCardProps> = ({
  label,
  value,
  sub,
  icon,
  color,
  bgColor,
}) => {
  return (
    <div className="group relative flex items-center gap-6 p-6 rounded-[24px] bg-card border border-border/80 shadow-sm transition-all duration-300 hover:border-brand-primary/30 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] overflow-hidden">
      {/* Icon Box */}
      <div
        className={cn(
          "w-16 h-16 rounded-[20px] shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 bg-background shrink-0",
          bgColor,
        )}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              {
                className: cn("w-8 h-8", color, "transition-colors"),
              },
            )
          : icon}
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <Typography
          variant="h5"
          className="text-muted-foreground uppercase tracking-widest font-black mb-1.5 opacity-80 truncate"
        >
          {label}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography
            variant="h1"
            weight="black"
            className="text-foreground leading-tight"
          >
            {value}
          </Typography>
        </div>
        <Typography
          variant="body4"
          className="text-muted-foreground/60 italic font-bold truncate"
        >
          {sub}
        </Typography>
      </div>

      {/* Subtle Gradient Glow */}
      <div
        className={cn(
          "absolute -right-4 -bottom-4 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500",
          color.replace("text-", "bg-"),
        )}
      />
    </div>
  );
};
