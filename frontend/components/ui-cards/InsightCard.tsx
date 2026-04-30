import React from "react";
import { InsightCardSkeleton } from "@components/ui-skeleton/DashboardSkeleton";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";

interface InsightCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  label,
  value,
  icon,
  color,
  bgColor,
  borderColor,
  onClick,
  isLoading = false,
}) => {
  if (isLoading) return <InsightCardSkeleton />;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-[24px] border border-border/80 transition-all duration-300 bg-card hover:border-brand-primary/30 group overflow-hidden flex items-center gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
        borderColor.replace("border-", "hover:border-"),
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
          className="text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-80"
        >
          {label}
        </Typography>
        <Typography
          variant="h1"
          weight="black"
          className={cn("leading-tight", color)}
        >
          {value}
        </Typography>
      </div>

      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1.5 opacity-[0.2]",
          color.startsWith("text-") && color.replace("text-", "bg-"),
        )}
      />

      {/* Backdrop Icon */}
      <div
        className={cn(
          "absolute -top-1 -right-2 opacity-[0.08] dark:opacity-[0.12] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3",
          color,
        )}
      >
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
