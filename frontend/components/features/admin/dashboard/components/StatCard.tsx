import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 hover:border-[#F96331]/30 hover:shadow-[0_20px_25px_-5px_rgba(249,99,49,0.1),0_8px_10px_-6px_rgba(249,99,49,0.1)] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F96331] group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{change}</span>
                </div>
            </div>
        </div>
    );
};
