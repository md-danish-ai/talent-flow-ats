'use client';

import React from 'react';
import Link from 'next/link';
import { log } from 'console';
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onToggle }) => {
    const router = useRouter()

    const logout = () => {
        document.cookie = "role=; Max-Age=0; path=/";
        document.cookie = "auth_token=; Max-Age=0; path=/";
        router.push("/sign-in")
    }
    return (
        <div className="relative">
            <button
                className="flex items-center cursor-pointer group p-1 rounded-full hover:bg-slate-50 transition-all outline-none"
                onClick={onToggle}
            >
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#F96331] font-extrabold overflow-hidden group-hover:ring-2 group-hover:ring-orange-100 transition-all shadow-sm">
                    MJ
                </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                    {/* User Profile Info in Dropdown */}
                    <div className="px-4 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#F96331] font-black shadow-sm shrink-0">
                            MJ
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 leading-tight truncate">Manish Joshi</p>
                            <p className="text-[11px] text-[#F96331] font-semibold mt-0.5 uppercase tracking-wide">Super Admin</p>
                        </div>
                    </div>

                    <div className="px-3 py-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5">Settings</p>
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-[#F96331] transition-all"
                            onClick={onToggle}
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            My Profile
                        </Link>

                        <div className="border-t border-slate-50 my-1 pt-1">
                            <button
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                onClick={() => {
                                    logout()
                                    onToggle();
                                    console.log('Logging out...');
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
