"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { Button } from "./Button";
import { Typography } from "./Typography";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  addMonths,
  subMonths,
  startOfToday,
  isSameDay,
  isBefore,
  startOfDay,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  endOfDay,
  isWithinInterval,
  getMonth,
  isToday,
} from "date-fns";
import { cn } from "@lib/utils";

interface DateRangePickerProps {
  onRangeChange: (
    range: { from: string; to: string } | null,
    label: string,
  ) => void;
  initialLabel?: string;
  className?: string;
}

const PRESETS = [
  {
    label: "Today",
    getValue: () => ({ from: startOfToday(), to: endOfDay(new Date()) }),
  },
  {
    label: "Yesterday",
    getValue: () => ({
      from: subDays(startOfToday(), 1),
      to: subDays(endOfDay(new Date()), 1),
    }),
  },
  {
    label: "Last 7 Days",
    getValue: () => ({
      from: subDays(startOfToday(), 6),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last Month",
    getValue: () => ({
      from: startOfMonth(subDays(startOfToday(), 30)),
      to: endOfMonth(subDays(startOfToday(), 30)),
    }),
  },
  {
    label: "Last 3 Months",
    getValue: () => ({
      from: subDays(startOfToday(), 90),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 6 Months",
    getValue: () => ({
      from: subDays(startOfToday(), 180),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Current Year",
    getValue: () => ({
      from: startOfYear(startOfToday()),
      to: endOfDay(new Date()),
    }),
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onRangeChange,
  initialLabel = "Today",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(initialLabel);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // For custom selection
  const [rangeFrom, setRangeFrom] = useState<Date | null>(null);
  const [rangeTo, setRangeTo] = useState<Date | null>(null);

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

  const handlePresetSelect = (preset: (typeof PRESETS)[0]) => {
    const range = preset.getValue();
    setSelectedLabel(preset.label);
    setRangeFrom(range.from);
    setRangeTo(range.to);

    onRangeChange(
      {
        from: format(range.from, "yyyy-MM-dd"),
        to: format(range.to, "yyyy-MM-dd"),
      },
      preset.label,
    );
    setIsOpen(false);
  };

  const handleDateClick = (date: Date) => {
    const clickedDate = startOfDay(date);

    if (!rangeFrom || (rangeFrom && rangeTo)) {
      setRangeFrom(clickedDate);
      setRangeTo(null);
    } else if (rangeFrom && !rangeTo) {
      if (isBefore(clickedDate, rangeFrom)) {
        setRangeTo(rangeFrom);
        setRangeFrom(clickedDate);
      } else {
        setRangeTo(endOfDay(clickedDate));
      }

      // Auto-apply custom selection
      const from = isBefore(clickedDate, rangeFrom) ? clickedDate : rangeFrom;
      const to = isBefore(clickedDate, rangeFrom)
        ? endOfDay(rangeFrom)
        : endOfDay(clickedDate);

      const label = `${format(from, "MMM d")} - ${format(to, "MMM d")}`;
      setSelectedLabel(label);
      onRangeChange(
        { from: format(from, "yyyy-MM-dd"), to: format(to, "yyyy-MM-dd") },
        label,
      );
      setIsOpen(false);
    }
  };

  const renderCalendar = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="w-[280px] p-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <Typography variant="body3" weight="bold" className="capitalize">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-[10px] font-bold text-muted-foreground text-center h-6 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border/20 rounded-lg overflow-hidden border border-border/10">
          {days.map((day, i) => {
            const isCurrentMonth = getMonth(day) === getMonth(currentMonth);
            const isSelFrom = rangeFrom && isSameDay(day, rangeFrom);
            const isSelTo = rangeTo && isSameDay(day, rangeTo);
            const isBetween =
              rangeFrom &&
              rangeTo &&
              isWithinInterval(day, { start: rangeFrom, end: rangeTo });
            const isTodayDate = isToday(day);

            return (
              <button
                key={i}
                onClick={() => handleDateClick(day)}
                disabled={!isCurrentMonth}
                className={cn(
                  "h-8 text-[11px] font-medium flex items-center justify-center transition-all relative",
                  !isCurrentMonth && "text-muted-foreground/20 cursor-default",
                  isCurrentMonth && "hover:bg-muted/80 text-foreground/80",
                  isTodayDate &&
                    !isSelFrom &&
                    !isSelTo &&
                    "text-brand-primary font-bold after:content-[''] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-brand-primary after:rounded-full",
                  isBetween &&
                    isCurrentMonth &&
                    "bg-brand-primary/10 text-brand-primary",
                  (isSelFrom || isSelTo) &&
                    isCurrentMonth &&
                    "bg-brand-primary text-white rounded-md z-10 scale-105 shadow-lg shadow-brand-primary/20 hover:bg-brand-primary",
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
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
            left: Math.max(16, coords.left + coords.width - 460), // Align to right of trigger but don't go off left
            width: 460,
            zIndex: 99999,
          }}
          ref={dropdownRef}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex origin-top-right"
          >
            {/* Presets Sidebar */}
            <div className="w-[180px] bg-muted/30 border-r border-border/50 p-4 space-y-1">
              <Typography
                variant="body5"
                weight="bold"
                className="px-2 mb-3 uppercase tracking-widest text-[9px] text-muted-foreground/60"
              >
                Suggestions
              </Typography>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between group",
                    selectedLabel === preset.label
                      ? "bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/10"
                      : "hover:bg-muted hover:text-foreground text-foreground/70",
                  )}
                >
                  <span>{preset.label}</span>
                  {selectedLabel === preset.label && <Check size={12} />}
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-[10px] h-8 text-muted-foreground/70"
                  onClick={() => {
                    setSelectedLabel("All Time");
                    setRangeFrom(null);
                    setRangeTo(null);
                    onRangeChange(null, "All Time");
                    setIsOpen(false);
                  }}
                >
                  <X size={12} className="mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Calendar Area */}
            <div className="bg-card">{renderCalendar()}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", className)}>
      <Button
        ref={triggerRef}
        variant="outline"
        onClick={toggleDropdown}
        className={cn(
          "flex items-center gap-3 px-4 py-3 bg-muted/20 hover:bg-muted/40 border-border/60 hover:border-border rounded-md transition-all h-12 w-full justify-between focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
          isOpen && "ring-1 ring-brand-primary border-brand-primary",
        )}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={18} className="text-brand-primary/80" />
          <span className="text-sm font-semibold text-foreground/90">
            {selectedLabel}
          </span>
        </div>
      </Button>

      {mounted && typeof document !== "undefined"
        ? createPortal(menuNode, document.body)
        : null}
    </div>
  );
};
