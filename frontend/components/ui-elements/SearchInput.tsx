"use client";

import React from "react";
import { cn } from "@lib/utils";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  className,
  placeholder = "Search anything...",
}) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-md focus-within:max-w-xl transition-all duration-300",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6 m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        suppressHydrationWarning
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] sm:text-sm transition-all shadow-sm"
      />
    </div>
  );
};
