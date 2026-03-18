"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Eye, LayoutGrid, RotateCcw, Check } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "./Typography";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-b border-border [&_tr]:hover:bg-transparent transition-colors",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("bg-card", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-brand-primary/5",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-[61px] px-4 text-left font-bold align-middle [&:has([role=checkbox])]:pr-0 whitespace-nowrap",
      className,
    )}
    {...props}
  >
    {children}
  </th>
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-4 align-middle text-foreground", className)}
    {...props}
  >
    {children}
  </td>
));
TableCell.displayName = "TableCell";

export interface TableColumnToggleProps {
  columns: { id: string; label: string; pinned?: boolean }[];
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
  onReset?: () => void;
  className?: string;
}

export function TableColumnToggle({
  columns,
  visibleColumns,
  onToggle,
  onReset,
  className,
}: TableColumnToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    const nextOpen = !isOpen;
    if (nextOpen) {
      const rect = dropdownRef.current?.getBoundingClientRect();
      if (rect) {
        setPos({
          top: rect.bottom + window.scrollY + 12,
          left: rect.right - 288, // w-72 is 288px
        });
      }
    }
    setIsOpen(nextOpen);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      columns.forEach((col) => {
        if (!visibleColumns.includes(col.id)) onToggle(col.id);
      });
    }
  };

  const menuNode = (
    <AnimatePresence>
      {isOpen && pos && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
          }}
          className="w-72 overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between mb-3 px-3 py-2">
            <Typography
              variant="body5"
              weight="black"
              className="text-slate-400 uppercase tracking-[0.15em] text-[10px]"
            >
              Active Grid Layout
            </Typography>
            <button
              onClick={handleReset}
              className="text-[10px] uppercase font-black text-brand-primary hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              <RotateCcw size={10} />
              Reset
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
            {columns.map((col) => {
              const isActive = visibleColumns.includes(col.id);
              const isPinned = col.pinned;
              return (
                <button
                  key={col.id}
                  disabled={isPinned}
                  onClick={() => !isPinned && onToggle(col.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-brand-primary/10 to-transparent text-foreground"
                      : "text-muted-foreground/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 grayscale",
                    isPinned && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-500 border-2",
                        isActive
                          ? "bg-brand-primary border-brand-primary shadow-[0_4px_12px_rgba(249,99,49,0.3)] scale-110"
                          : "border-slate-200 dark:border-slate-800 group-hover:border-brand-primary/40 rotate-[-15deg]",
                        isPinned &&
                          "bg-slate-400 border-slate-400 shadow-none scale-100 rotate-0",
                      )}
                    >
                      {isActive ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 12 }}
                        >
                          <Check
                            className="h-4 w-4 text-white"
                            strokeWidth={4}
                          />
                        </motion.div>
                      ) : (
                        <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <Typography
                        variant="body4"
                        weight={isActive ? "bold" : "semibold"}
                        className="leading-none mb-0.5"
                      >
                        {col.label}
                        {isPinned && (
                          <span className="ml-2 text-[8px] uppercase font-black text-slate-400">
                            (Required)
                          </span>
                        )}
                      </Typography>
                      <span className="text-[9px] uppercase font-bold opacity-30 tracking-widest">
                        Column ID: {col.id}
                      </span>
                    </div>
                  </div>

                  {!isActive && !isPinned && (
                    <Eye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10 text-foreground" />
                  )}

                  {isActive && (
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-full my-3",
                        isPinned ? "bg-slate-300" : "bg-brand-primary",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 px-4 pt-3 border-t border-border/40 text-[9px] font-bold text-slate-400 italic">
            Toggle columns to optimize your workspace density.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button
        variant="ghost"
        color="default"
        size="sm"
        onClick={toggleDropdown}
        className={cn(
          "group flex items-center gap-2.5 rounded-2xl border border-border px-4 py-2.5 font-bold transition-all duration-300",
          isOpen
            ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_20px_-5px_rgba(249,99,49,0.3)]"
            : "hover:border-brand-primary/50 hover:bg-brand-primary/5 hover:text-brand-primary",
        )}
      >
        <LayoutGrid
          size={16}
          className={cn(
            "transition-transform duration-500",
            isOpen && "rotate-90",
          )}
        />
        <span className="text-sm tracking-tight text-foreground">
          Manage Columns
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-500 opacity-40 group-hover:opacity-100",
            isOpen && "rotate-180 opacity-100",
          )}
        />
      </Button>

      {mounted && typeof document !== "undefined"
        ? createPortal(menuNode, document.body)
        : null}
    </div>
  );
}

export interface TableCollapsibleRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  expandedContent: React.ReactNode;
  colSpan?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showToggleCell?: boolean;
}

export const TableCollapsibleRow = React.forwardRef<
  HTMLTableRowElement,
  TableCollapsibleRowProps
>(
  (
    {
      className,
      expandedContent,
      colSpan = 10,
      isOpen: externalOpen,
      onOpenChange,
      showToggleCell = true,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isExpanded = externalOpen !== undefined ? externalOpen : internalOpen;

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newState = !isExpanded;
      if (onOpenChange) {
        onOpenChange(newState);
      } else {
        setInternalOpen(newState);
      }
    };

    return (
      <React.Fragment>
        <TableRow
          ref={ref}
          className={cn(
            "cursor-pointer",
            isExpanded ? "border-b-0 bg-muted/5 shadow-inner" : "",
            className,
          )}
          onClick={handleToggle}
          {...props}
        >
          {showToggleCell && (
            <TableCell className="w-[50px]">
              <Button
                variant="ghost"
                color="default"
                size="icon-sm"
                onClick={handleToggle}
                className="hover:bg-brand-primary/10 hover:text-brand-primary"
              >
                <ChevronDown
                  size={18}
                  className={cn(
                    "transition-transform duration-500",
                    isExpanded
                      ? "rotate-180 text-brand-primary"
                      : "text-muted-foreground",
                  )}
                />
              </Button>
            </TableCell>
          )}
          {children}
        </TableRow>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <TableRow className="hover:bg-transparent border-t-0 p-0 overflow-hidden">
              <TableCell
                colSpan={colSpan}
                className="p-0 border-b border-border overflow-hidden"
              >
                <motion.div
                  initial={{ height: 0, opacity: 0, filter: "blur(5px)" }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.8,
                      },
                      opacity: { duration: 0.2 },
                      filter: { duration: 0.3 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    filter: "blur(5px)",
                    transition: {
                      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2 },
                      filter: { duration: 0.2 },
                    },
                  }}
                  className="overflow-hidden bg-muted/40"
                >
                  {expandedContent}
                </motion.div>
              </TableCell>
            </TableRow>
          )}
        </AnimatePresence>
      </React.Fragment>
    );
  },
);
TableCollapsibleRow.displayName = "TableCollapsibleRow";
