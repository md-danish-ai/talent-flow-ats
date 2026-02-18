'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarLogoProps {
    isCollapsed: boolean;
    isOpen: boolean;
    onClose?: () => void;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ isCollapsed, isOpen, onClose }) => {
    const showFullLogo = !isCollapsed || isOpen;

    return (
        <>
            {showFullLogo ? (
                <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={onClose}>
                    <div className="w-8 h-8 bg-[#F96331] rounded-lg flex items-center justify-center text-white font-bold shrink-0">A</div>
                    <span className="font-bold text-slate-900 text-lg tracking-tight whitespace-nowrap">ArcInterview</span>
                </Link>
            ) : (
                <div className="w-8 h-8 bg-[#F96331] rounded-lg flex items-center justify-center text-white font-bold shrink-0">A</div>
            )}
        </>
    );
};
