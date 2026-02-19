'use client';

import React from 'react';

interface Notification {
    id: string | number;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    notifications: Notification[];
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onToggle, notifications }) => {
    return (
        <div className="relative">
            <button
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all hidden sm:flex
                    ${isOpen ? 'bg-orange-50 text-[#F96331]' : 'text-slate-400 hover:text-[#F96331] hover:bg-orange-50'}
                `}
                onClick={onToggle}
            >
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </div>
            </button>

            {/* Notifications Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                    <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        <span className="text-[10px] font-bold bg-[#F96331]/10 text-[#F96331] px-2 py-0.5 rounded-full uppercase">New</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {/* Notification items would go here */}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">No new notifications</h4>
                                <p className="text-xs text-slate-500">We&apos;ll let you know when something important happens.</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-slate-50 bg-slate-50/30">
                            <button className="w-full py-2 text-xs font-bold text-[#F96331] hover:bg-orange-50 rounded-lg transition-colors">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
