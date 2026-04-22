import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color?: string;
  className?: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  description,
  time,
  color = "text-brand-primary",
  className,
}) => {
  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all group border border-transparent hover:border-border/40", className)}>
      <div className={cn(
        "w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm",
        color
      )}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Typography variant="body3" weight="bold" className="text-foreground leading-snug line-clamp-1">
            {title}
          </Typography>
          <Typography variant="body5" className="text-muted-foreground/50 whitespace-nowrap pt-0.5">
            {time}
          </Typography>
        </div>
        <Typography variant="body4" className="text-muted-foreground/80 leading-relaxed line-clamp-2">
          {description}
        </Typography>
      </div>
    </div>
  );
};
