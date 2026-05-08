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
  disablePast?: boolean;
  disableFuture?: boolean;
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
      disablePast = false,
      disableFuture = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [prevValue, setPrevValue] = useState(value);
    const [currentMonth, setCurrentMonth] = useState(
      value ? new Date(value) : new Date(),
    );

    const [viewMode, setViewMode] = useState<"days" | "months" | "years">(
      "days",
    );

    if (value !== prevValue) {
      setPrevValue(value);
      if (value) {
        setCurrentMonth(new Date(value));
      }
    }

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
        setViewMode("days");
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

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const currentYearNum = new Date().getFullYear();
      const maxYear = disableFuture ? currentYearNum : currentYearNum + 10;
      const years = Array.from({ length: 100 }, (_, i) => maxYear - i);

      const isNextMonthFuture =
        startOfMonth(addMonths(currentMonth, 1)) > startOfMonth(new Date());
      const disableRightArrow =
        disableFuture &&
        ((viewMode === "days" && isNextMonthFuture) ||
          (viewMode === "years" &&
            currentMonth.getFullYear() + 10 > currentYearNum));

      return (
        <div className="w-[300px] p-4 bg-card">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === "months" ? "days" : "months")
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider border transition-all duration-200 shadow-sm",
                  viewMode === "months"
                    ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/20"
                    : "bg-brand-primary/5 hover:bg-brand-primary/10 dark:bg-brand-primary/10 dark:hover:bg-brand-primary/15 border-brand-primary/40 dark:border-brand-primary/30 text-brand-primary",
                )}
              >
                {months[currentMonth.getMonth()].slice(0, 3)}
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === "years" ? "days" : "years")
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider border transition-all duration-200 shadow-sm",
                  viewMode === "years"
                    ? "bg-brand-primary text-white border-brand-primary shadow-brand-primary/20"
                    : "bg-brand-primary/5 hover:bg-brand-primary/10 dark:bg-brand-primary/10 dark:hover:bg-brand-primary/15 border-brand-primary/40 dark:border-brand-primary/30 text-brand-primary",
                )}
              >
                {currentMonth.getFullYear()}
              </button>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-lg"
                onClick={() => {
                  if (viewMode === "days") {
                    setCurrentMonth(subMonths(currentMonth, 1));
                  } else if (viewMode === "years") {
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear() - 10,
                        currentMonth.getMonth(),
                        1,
                      ),
                    );
                  }
                }}
                disabled={viewMode === "months"}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-lg"
                onClick={() => {
                  if (viewMode === "days") {
                    setCurrentMonth(addMonths(currentMonth, 1));
                  } else if (viewMode === "years") {
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear() + 10,
                        currentMonth.getMonth(),
                        1,
                      ),
                    );
                  }
                }}
                disabled={viewMode === "months" || disableRightArrow}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {viewMode === "days" && (
            <>
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
                  const isCurrentMonth =
                    getMonth(day) === getMonth(currentMonth);
                  const isSelected =
                    selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  const isPast = startOfDay(day) < startOfDay(new Date());
                  const isFutureDay =
                    disableFuture && startOfDay(day) > startOfDay(new Date());
                  const isDisabled =
                    !isCurrentMonth || (disablePast && isPast) || isFutureDay;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "h-9 text-[11px] font-medium flex items-center justify-center transition-all relative rounded-md",
                        !isCurrentMonth &&
                          "text-slate-200 dark:text-slate-700 cursor-default",
                        isCurrentMonth &&
                          isDisabled &&
                          "text-slate-300 dark:text-slate-700 cursor-not-allowed hover:bg-transparent opacity-40",
                        isCurrentMonth &&
                          !isDisabled &&
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
            </>
          )}

          {viewMode === "months" && (
            <div className="grid grid-cols-3 gap-2 py-2 min-h-[220px] items-center animate-in fade-in zoom-in-95 duration-200">
              {months.map((month, index) => {
                const isSelected = currentMonth.getMonth() === index;
                const isFutureMonth =
                  disableFuture &&
                  currentMonth.getFullYear() === currentYearNum &&
                  index > new Date().getMonth();
                return (
                  <button
                    key={month}
                    type="button"
                    disabled={isFutureMonth}
                    onClick={() => {
                      const updatedDate = new Date(currentMonth);
                      updatedDate.setMonth(index);
                      setCurrentMonth(updatedDate);
                      setViewMode("days");
                    }}
                    className={cn(
                      "py-3 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all border border-transparent",
                      isSelected
                        ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105"
                        : isFutureMonth
                          ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40 hover:bg-transparent"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
                    )}
                  >
                    {month.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}

          {viewMode === "years" && (
            <div className="grid grid-cols-4 gap-2 py-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 animate-in fade-in zoom-in-95 duration-200">
              {years.map((year) => {
                const isSelected = currentMonth.getFullYear() === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      const updatedDate = new Date(currentMonth);
                      updatedDate.setFullYear(year);
                      setCurrentMonth(updatedDate);
                      setViewMode("days");
                    }}
                    className={cn(
                      "py-2 text-[11px] font-bold rounded-lg transition-all border border-transparent",
                      isSelected
                        ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
                    )}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] h-7 text-brand-primary font-bold uppercase"
              onClick={() => {
                setViewMode("days");
                handleDateClick(new Date());
              }}
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
              className="bg-card border-2 border-brand-primary/30 dark:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden origin-top-right ring-1 ring-black/5 dark:ring-white/5"
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
