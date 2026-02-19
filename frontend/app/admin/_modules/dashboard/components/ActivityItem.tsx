import React from 'react';

interface ActivityItemProps {
    user: string;
    action: string;
    target: string;
    time: string;
    avatar: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ user, action, target, time, avatar }) => {
    return (
        <div className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0 ring-2 ring-white">
                {avatar}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium leading-normal">
                    <span className="font-bold hover:text-[#F96331] transition-colors">{user}</span> {action} <span className="text-[#F96331] font-semibold">{target}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {time}
                </p>
            </div>
        </div>
    );
};
