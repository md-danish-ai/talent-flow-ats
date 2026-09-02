import React from "react";
import { PulseCardSkeleton } from "@components/ui-skeleton/DashboardSkeleton";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

interface PulseCardProps {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  className?: string;
  isLoading?: boolean;
}

export const PulseCard: React.FC<PulseCardProps> = ({
  label,
  value,
  sub,
  icon,
  color,
  bgColor,
  className = "",
  isLoading = false,
}) => {
  if (isLoading) return <PulseCardSkeleton />;

  const leftBorderClass = color.startsWith("text-")
    ? color.replace("text-", "border-l-")
    : "border-l-brand-primary";

  return (
    <div
      className={cn(
        "group relative flex items-center gap-5 sm:gap-6 p-5 sm:p-6 bg-card border border-border/80 border-l-[3px] shadow-sm transition-all duration-300 hover:border-brand-primary/30 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] overflow-hidden",
        STYLE_CONFIG.cardRadius,
        leftBorderClass,
        className,
      )}
    >
      {/* Icon Box */}
      <div
        className={cn(
          "w-14 h-14 sm:w-16 sm:h-16 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
          STYLE_CONFIG.iconRadius,
          bgColor,
        )}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              {
                className: cn(
                  "w-7 h-7 sm:w-8 sm:h-8",
                  color,
                  "transition-colors",
                ),
              },
            )
          : icon}
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <Typography
          variant="h5"
          className="text-muted-foreground/80 uppercase tracking-wider font-bold text-xs mb-1 truncate"
        >
          {label}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography
            variant="h1"
            weight="black"
            className="text-foreground text-2xl sm:text-3xl leading-tight"
          >
            {value}
          </Typography>
        </div>
        <Typography
          variant="body4"
          className="text-muted-foreground/70 italic text-xs font-normal truncate mt-0.5"
        >
          {sub}
        </Typography>
      </div>

      {/* Backdrop Icon */}
      <div
        className={cn(
          "absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3",
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

      {/* Subtle Gradient Glow */}
      <div
        className={cn(
          "absolute -right-4 -bottom-4 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500",
          color.startsWith("text-") && color.replace("text-", "bg-"),
        )}
      />
    </div>
  );
};
