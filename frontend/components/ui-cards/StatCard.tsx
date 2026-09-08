import React from "react";
import { StatCardSkeleton } from "@components/ui-skeleton/DashboardSkeleton";
import { Typography } from "@components/ui-elements/Typography";
import { cn, getThemedCardHoverStyles } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = "text-brand-primary",
  bgColor = "bg-brand-primary/10",
  borderColor,
  className = "",
  onClick,
  isLoading = false,
}) => {
  if (isLoading) return <StatCardSkeleton />;

  const themeStyle = getThemedCardHoverStyles(borderColor || color);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card p-5 sm:p-6 flex items-center gap-5 sm:gap-6 transition-all duration-300 ease-out group relative overflow-hidden",
        STYLE_CONFIG.cardRadius,
        themeStyle,
        onClick && "cursor-pointer",
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
                className: cn("w-7 h-7 sm:w-8 sm:h-8", color),
              },
            )
          : icon}
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <Typography
          variant="h5"
          className="text-muted-foreground/80 uppercase tracking-wider font-bold text-xs mb-1 truncate"
        >
          {label}
        </Typography>
        <div className="flex items-center gap-3">
          <Typography
            variant="h1"
            weight="black"
            className="text-foreground text-2xl sm:text-3xl leading-none"
          >
            {value}
          </Typography>
        </div>
      </div>

      {/* Backdrop Icon */}
      <div
        className={cn(
          "absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3",
          color === "text-white" ? "text-brand-primary" : color,
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
