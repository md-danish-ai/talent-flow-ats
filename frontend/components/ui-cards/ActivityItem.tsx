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
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all shadow-sm">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <Typography variant="body3" weight="bold" color="text-slate-900">
            {user}
          </Typography>
          <Typography variant="body3" color="text-slate-500">
            {action}
          </Typography>
          <Typography variant="body3" weight="bold" color="text-brand-primary">
            {target}
          </Typography>
        </div>
        <Typography variant="body5" color="text-slate-400" className="mt-0.5">
          {time}
        </Typography>
      </div>
    </div>
  );
};
