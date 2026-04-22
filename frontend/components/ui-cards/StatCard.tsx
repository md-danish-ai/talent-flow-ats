import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = "text-brand-primary",
  bgColor = "bg-brand-primary/10",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card p-6 rounded-[24px] border border-border/80 shadow-sm flex items-center gap-6 transition-all duration-300 hover:border-brand-primary/30 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] group relative overflow-hidden",
        onClick && "cursor-pointer",
      )}
    >
      {/* Icon Box */}
      <div
        className={cn(
          "w-16 h-16 rounded-[20px] shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-muted/50 shrink-0",
          bgColor,
        )}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              {
                className: cn("w-8 h-8", color),
              },
            )
          : icon}
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <Typography
          variant="h5"
          className="text-muted-foreground uppercase tracking-widest font-black mb-1.5 opacity-80"
        >
          {label}
        </Typography>
        <div className="flex items-center gap-3">
          <Typography
            variant="h1"
            weight="black"
            className="text-foreground leading-none"
          >
            {value}
          </Typography>
        </div>
      </div>

      {/* Backdrop Icon */}
      <div className="absolute -top-1 -right-2 opacity-[0.04] dark:opacity-[0.07] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3">
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{ size?: number | string }>,
              { size: 100 },
            )
          : icon}
      </div>
    </div>
  );
};
