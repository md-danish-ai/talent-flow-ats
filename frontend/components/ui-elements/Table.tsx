"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Eye,
  LayoutGrid,
  RotateCcw,
  Check,
  Pin,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "./Typography";
import { STYLE_CONFIG } from "@lib/config/style";

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
          left: rect.right - 500, // Matching width of container 500px
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
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
          }}
          className={cn(
            "w-[500px] border border-border/50 bg-card/95 backdrop-blur-xl p-4 shadow-2xl dark:shadow-slate-950/80",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex flex-col">
              <Typography variant="body3" weight="bold">
                Manage Grid Columns
              </Typography>
              <Typography variant="body5" className="text-muted-foreground">
                Enable or disable visible metrics
              </Typography>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-[11px] uppercase font-bold tracking-wider gap-1.5 rounded-xl"
            >
              <RotateCcw size={12} />
              Default View
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {columns.map((col) => {
              const isActive = visibleColumns.includes(col.id);
              const isPinned = col.pinned;
              return (
                <button
                  key={col.id}
                  disabled={isPinned}
                  onClick={() => !isPinned && onToggle(col.id)}
                  className={cn(
                    "flex items-center gap-3 p-2.5 text-left transition-all duration-200 border group relative",
                    STYLE_CONFIG.buttonRadius,
                    isPinned
                      ? "bg-slate-50/80 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/60 text-foreground cursor-default shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                      : isActive
                        ? "bg-brand-primary/[0.03] border-brand-primary/20 text-foreground shadow-sm"
                        : "bg-muted/10 border-transparent text-muted-foreground/60 hover:bg-muted/30 hover:border-muted-foreground/10",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-300",
                      isPinned
                        ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 shadow-sm"
                        : isActive
                          ? "bg-brand-primary border-brand-primary text-white shadow-sm shadow-brand-primary/20"
                          : "bg-background border-border text-muted-foreground/40 group-hover:border-brand-primary/40 group-hover:text-brand-primary/70",
                    )}
                  >
                    {isPinned ? (
                      <Pin size={12} className="rotate-45 fill-current" />
                    ) : isActive ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <Eye
                        size={12}
                        className="transition-colors fill-current opacity-30 group-hover:opacity-100"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <Typography
                      variant="body5"
                      weight={isActive || isPinned ? "bold" : "medium"}
                      className={cn(
                        "truncate leading-tight flex items-center gap-1.5",
                        isActive || isPinned
                          ? "text-foreground"
                          : "text-muted-foreground/80",
                      )}
                    >
                      {col.label}
                    </Typography>
                    {isPinned && (
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mt-1">
                        Pinned Column
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
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

const TableCollapsibleContext = React.createContext<{
  isExpanded: boolean;
  toggle: (e: React.MouseEvent) => void;
} | null>(null);

export const TableCollapsibleRowToggle = () => {
  const context = React.useContext(TableCollapsibleContext);
  if (!context) return null;
  return (
    <Button
      variant="ghost"
      color="default"
      size="icon-sm"
      onClick={context.toggle}
      className="hover:bg-brand-primary/10 hover:text-brand-primary"
    >
      <ChevronDown
        size={18}
        className={cn(
          "transition-transform duration-500",
          context.isExpanded
            ? "rotate-180 text-brand-primary"
            : "text-muted-foreground",
        )}
      />
    </Button>
  );
};
TableCollapsibleRowToggle.displayName = "TableCollapsibleRowToggle";

export interface TableCollapsibleRowComponent extends React.ForwardRefExoticComponent<
  TableCollapsibleRowProps & React.RefAttributes<HTMLTableRowElement>
> {
  Toggle: typeof TableCollapsibleRowToggle;
}

const TableCollapsibleRowBase = React.forwardRef<
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
      <TableCollapsibleContext.Provider
        value={{ isExpanded, toggle: handleToggle }}
      >
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
                <TableCollapsibleRowToggle />
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
      </TableCollapsibleContext.Provider>
    );
  },
);
TableCollapsibleRowBase.displayName = "TableCollapsibleRowBase";

export const TableCollapsibleRow =
  TableCollapsibleRowBase as TableCollapsibleRowComponent;
TableCollapsibleRow.Toggle = TableCollapsibleRowToggle;
TableCollapsibleRow.displayName = "TableCollapsibleRow";
