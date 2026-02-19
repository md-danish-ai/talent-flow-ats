'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { SearchInput } from './components/SearchInput';
import { NotificationDropdown } from './components/NotificationDropdown';
import { ProfileDropdown } from './components/ProfileDropdown';
import { useSidebarContext } from './components/SidebarProvider';

export const Navbar = () => {
    const { toggleSidebar } = useSidebarContext();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications] = useState([]); // Empty notifications for now

    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-[73px] flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="min-[900px]:hidden text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                            onClick={toggleSidebar}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link href="/admin/dashboard" className="flex items-center gap-2 min-[900px]:hidden text-[#F96331]">
                            <div className="w-8 h-8 bg-[#F96331] rounded-lg flex items-center justify-center text-white">
                                <span className="font-bold text-lg">A</span>
                            </div>
                            <span className="font-bold text-slate-900 text-lg tracking-tight hidden sm:block">ArcInterview</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl px-4">
                        <SearchInput />
                    </div>

                    <div className="flex items-center gap-4">
                        <div ref={notificationsRef}>
                            <NotificationDropdown
                                isOpen={isNotificationsOpen}
                                onToggle={() => {
                                    setIsNotificationsOpen(!isNotificationsOpen);
                                    setIsProfileOpen(false);
                                }}
                                notifications={notifications}
                            />
                        </div>

                        <div ref={dropdownRef}>
                            <ProfileDropdown
                                isOpen={isProfileOpen}
                                onToggle={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                    setIsNotificationsOpen(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
