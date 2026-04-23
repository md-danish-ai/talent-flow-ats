"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./Button";
import { Typography } from "./Typography";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isSameDay,
  startOfDay,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  getMonth,
  isToday,
} from "date-fns";
import { cn } from "@lib/utils";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  label?: React.ReactNode;
  error?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      className = "",
      placeholder = "Select Date",
      label,
      error,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(
      value ? new Date(value) : new Date(),
    );

    const [coords, setCoords] = useState({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const updateCoords = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const toggleDropdown = () => {
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
    }, [isOpen]);

    const handleDateClick = (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange(formattedDate);
      setIsOpen(false);
    };

    const renderCalendar = () => {
      const start = startOfWeek(startOfMonth(currentMonth));
      const end = endOfWeek(endOfMonth(currentMonth));
      const days = eachDayOfInterval({ start, end });
      const selectedDate = value ? startOfDay(new Date(value)) : null;

      return (
        <div className="w-[300px] p-4 bg-card">
          <div className="flex items-center justify-between mb-4">
            <Typography
              variant="body3"
              weight="bold"
              className="capitalize text-slate-800 dark:text-slate-100"
            >
              {format(currentMonth, "MMMM yyyy")}
            </Typography>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isCurrentMonth = getMonth(day) === getMonth(currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!isCurrentMonth}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "h-9 text-[11px] font-medium flex items-center justify-center transition-all relative rounded-md",
                    !isCurrentMonth &&
                      "text-slate-200 dark:text-slate-700 cursor-default",
                    isCurrentMonth &&
                      "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
                    isSelected &&
                      "bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 scale-105 z-10 hover:bg-brand-primary hover:text-white",
                    isTodayDate &&
                      !isSelected &&
                      "text-brand-primary font-bold after:content-[''] after:absolute after:bottom-1.5 after:w-1 after:h-1 after:bg-brand-primary after:rounded-full",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] h-7 text-brand-primary font-bold uppercase"
              onClick={() => handleDateClick(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] h-7 text-slate-400 uppercase"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      );
    };

    const menuNode = (
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: coords.top + coords.height + 8,
              left: Math.max(16, coords.left + coords.width - 300),
              zIndex: 99999,
            }}
            ref={dropdownRef}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-card border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden origin-top-right shadow-brand-primary/5"
            >
              {renderCalendar()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            {label}
          </label>
        )}
        <div className="relative">
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
            className={cn(
              "flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-md transition-all min-h-[52px] w-full hover:border-brand-primary/30 group",
              "border-slate-200 dark:border-slate-800",
              isOpen && "ring-1 ring-brand-primary border-brand-primary",
              error && "border-red-500 ring-1 ring-red-500/20",
              className,
            )}
          >
            <CalendarIcon
              size={18}
              className={cn(
                "text-slate-400 transition-colors",
                (isOpen || value) && "text-brand-primary",
              )}
            />
            <span
              className={cn(
                "text-medium font-semibold uppercase tracking-wider",
                value ? "text-slate-700 dark:text-slate-200" : "text-slate-400",
              )}
            >
              {value ? format(new Date(value), "dd MMM yyyy") : placeholder}
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

DatePicker.displayName = "DatePicker";
