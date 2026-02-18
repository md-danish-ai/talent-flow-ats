import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
    return (
        <div className={`flex flex-col bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_25px_-5px_rgba(249,99,49,0.1),0_8px_10px_-6px_rgba(249,99,49,0.1)] hover:border-[#F96331]/30 ${className}`}>
            {(title || icon) && (
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                    {icon && <div className="text-[#F96331]">{icon}</div>}
                    {title && <h3 className="text-slate-900 font-semibold text-base">{title}</h3>}
                </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
};
