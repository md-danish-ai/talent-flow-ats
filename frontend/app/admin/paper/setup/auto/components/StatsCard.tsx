import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

export const StatsCard = ({
  icon,
  label,
  value,
  bgColor,
  borderColor,
  labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  borderColor: string;
  labelColor: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-4 p-4 border shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
      STYLE_CONFIG.innerCardRadius,
      bgColor,
      borderColor,
    )}
  >
    <div
      className={cn(
        "p-2.5 bg-white dark:bg-slate-900 shadow-sm",
        STYLE_CONFIG.iconRadius,
      )}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <Typography
        variant="body5"
        weight="black"
        className={cn("uppercase tracking-widest text-[9px]", labelColor)}
      >
        {label}
      </Typography>
      <Typography
        variant="body3"
        weight="black"
        className="text-slate-900 dark:text-slate-100"
      >
        {value}
      </Typography>
    </div>
  </div>
);
