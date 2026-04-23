"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@lib/utils";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  className,
  placeholder = "Search anything...",
  value = "",
  onChange,
  onClear,
  onSearch,
  delay = 500,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Handle debounced search
  useEffect(() => {
    // Skip if it's an initial empty search to avoid double fetching on mount
    if (!onSearch) return;

    const handler = setTimeout(() => {
      onSearch(internalValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [internalValue, onSearch, delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    setInternalValue("");
    if (onClear) {
      onClear();
    } else if (onChange) {
      const mockEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(mockEvent);
    }

    // Immediately trigger onSearch if provided, without waiting for debounce
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-md focus-within:max-w-xl transition-all duration-300 group",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-muted-foreground/60 group-focus-within:text-brand-primary transition-colors"
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
        value={internalValue}
        onChange={handleChange}
        suppressHydrationWarning
        className="block w-full pl-10 pr-10 py-3.5 border border-border rounded-md leading-5 bg-input text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-card focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all shadow-sm items-center"
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/60 hover:text-red-500 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
