"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@lib/utils";

interface YearPickerProps {
  value: string; // YYYY
  onChange: (year: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  label?: React.ReactNode;
  error?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  minYear?: string | number;
  placement?: "top" | "bottom" | "auto";
  disabled?: boolean;
}

export const YearPicker = React.forwardRef<HTMLInputElement, YearPickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      className = "",
      placeholder = "Select Year",
      label,
      error,
      disableFuture = true,
      minYear,
      placement = "auto",
      disabled = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [resolvedPlacement, setResolvedPlacement] = useState<
      "top" | "bottom"
    >("bottom");
    const [coords, setCoords] = useState({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const DROPDOWN_HEIGHT = 320; // approx height of the year picker dropdown

    const updateCoords = React.useCallback(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        // Auto-detect placement if not forced
        if (placement === "auto") {
          const spaceBelow = window.innerHeight - rect.bottom;
          setResolvedPlacement(spaceBelow < DROPDOWN_HEIGHT ? "top" : "bottom");
        } else {
          setResolvedPlacement(placement);
        }
      }
    }, [placement]);

    const toggleDropdown = () => {
      if (disabled) return;
      if (!mounted) setMounted(true);
      if (!isOpen) {
        updateCoords();
      }
      setIsOpen(!isOpen);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", updateCoords, true);
        window.addEventListener("resize", updateCoords);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", updateCoords, true);
        window.removeEventListener("resize", updateCoords);
      };
    }, [isOpen, updateCoords]);

    const handleYearClick = (year: number) => {
      onChange(year.toString());
      setIsOpen(false);
    };

    const renderCalendar = () => {
      const currentYearNum = new Date().getFullYear();
      const maxYear = disableFuture ? currentYearNum : currentYearNum + 10;
      const years = Array.from({ length: 60 }, (_, i) => maxYear - i); // show last 60 years

      return (
        <div className="w-[300px] p-4 bg-card">
          <div className="text-center font-bold text-sm mb-4 text-slate-500 uppercase tracking-wider">
            Select Year
          </div>
          <div className="grid grid-cols-4 gap-2 py-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {years.map((year) => {
              const isSelected = value === year.toString();
              const isDisabledOption = minYear ? year < Number(minYear) : false;
              return (
                <button
                  key={year}
                  type="button"
                  disabled={isDisabledOption}
                  onClick={() => {
                    if (!isDisabledOption) handleYearClick(year);
                  }}
                  className={cn(
                    "py-2 text-[11px] font-bold rounded-lg transition-all border border-transparent",
                    isSelected
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105"
                      : "text-slate-600 dark:text-slate-300",
                    isDisabledOption
                      ? "opacity-30 cursor-not-allowed bg-slate-50 dark:bg-slate-800"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    const isTop = resolvedPlacement === "top";

    const menuNode = (
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: isTop ? coords.top - 8 : coords.top + coords.height + 8,
              left: Math.max(16, coords.left + coords.width - 300),
              zIndex: 99999,
              transform: isTop ? "translateY(-100%)" : "none",
            }}
            ref={dropdownRef}
          >
            <motion.div
              initial={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "bg-card border-2 border-brand-primary/30 dark:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5",
                isTop ? "origin-bottom-right" : "origin-top-right",
              )}
            >
              {renderCalendar()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    return (
      <div className={cn("w-full relative", className)}>
        {label && (
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            type="hidden"
            ref={ref}
            value={value}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            ref={triggerRef}
            type="button"
            onClick={toggleDropdown}
            disabled={disabled}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-input rounded-md transition-all w-full hover:border-brand-primary/30 group text-left",
              isOpen && "ring-1 ring-brand-primary border-brand-primary",
              error && "border-red-500 ring-1 ring-red-500/20",
              disabled &&
                "opacity-50 cursor-not-allowed bg-muted/20 hover:border-transparent",
              className,
            )}
          >
            <CalendarIcon
              size={14}
              className={cn(
                "text-slate-400 transition-colors flex-shrink-0",
                (isOpen || value) && !disabled && "text-brand-primary",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium tracking-wider truncate text-left",
                value ? "text-slate-700 dark:text-slate-200" : "text-slate-400",
              )}
            >
              {value || placeholder}
            </span>
          </button>

          {mounted && typeof document !== "undefined"
            ? createPortal(menuNode, document.body)
            : null}
        </div>
      </div>
    );
  },
);

YearPicker.displayName = "YearPicker";
