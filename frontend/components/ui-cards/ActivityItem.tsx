import React from "react";
import { Typography } from "@components/ui-elements/Typography";

interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  user,
  action,
  target,
  time,
  avatar,
}) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold group-hover:bg-background border border-transparent group-hover:border-border transition-all shadow-sm">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <Typography variant="body3" weight="bold" className="text-foreground">
            {user}
          </Typography>
          <Typography variant="body3" className="text-muted-foreground">
            {action}
          </Typography>
          <Typography
            variant="body3"
            weight="bold"
            className="text-brand-primary"
          >
            {target}
          </Typography>
        </div>
        <Typography variant="body5" className="text-muted-foreground/60 mt-0.5">
          {time}
        </Typography>
      </div>
    </div>
  );
};
