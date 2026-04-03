"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [selectedLabel, setSelectedLabel] = useState(initialLabel);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // For custom selection
  const [rangeFrom, setRangeFrom] = useState<Date | null>(null);
  const [rangeTo, setRangeTo] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-background/50 hover:bg-muted/50 border-border/50 rounded-xl transition-all h-10 min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-brand-primary" />
          <span className="text-sm font-medium">{selectedLabel}</span>
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 z-50 bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex animate-in fade-in zoom-in duration-200 origin-top-right">
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
        </div>
      )}
    </div>
  );
};
