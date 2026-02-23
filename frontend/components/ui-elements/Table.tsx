import React, { useState, useRef, useEffect } from "react";
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
  columns: { id: string; label: string }[];
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
  className?: string;
}

export function TableColumnToggle({
  columns,
  visibleColumns,
  onToggle,
  className,
}: TableColumnToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showAll = () => {
    columns.forEach((col) => {
      if (!visibleColumns.includes(col.id)) onToggle(col.id);
    });
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button
        variant="ghost"
        color="default"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
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
                onClick={showAll}
                className="text-[10px] uppercase font-black text-brand-primary hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                <RotateCcw size={10} />
                Reset
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
              {columns.map((col) => {
                const isActive = visibleColumns.includes(col.id);
                return (
                  <button
                    key={col.id}
                    onClick={() => onToggle(col.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-300 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-brand-primary/10 to-transparent text-foreground"
                        : "text-muted-foreground/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 grayscale",
                    )}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-500 border-2",
                          isActive
                            ? "bg-brand-primary border-brand-primary shadow-[0_4px_12px_rgba(249,99,49,0.3)] scale-110"
                            : "border-slate-200 dark:border-slate-800 group-hover:border-brand-primary/40 rotate-[-15deg]",
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
                        </Typography>
                        <span className="text-[9px] uppercase font-bold opacity-30 tracking-widest">
                          Column ID: {col.id}
                        </span>
                      </div>
                    </div>

                    {!isActive && (
                      <Eye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10 text-foreground" />
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-full my-3" />
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
    </div>
  );
}

export interface TableCollapsibleRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  expandedContent: React.ReactNode;
  colSpan?: number;
}

export const TableCollapsibleRow = React.forwardRef<
  HTMLTableRowElement,
  TableCollapsibleRowProps
>(({ className, expandedContent, colSpan = 10, children, ...props }, ref) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        ref={ref}
        className={cn(isExpanded ? "border-b-0" : "", className)}
        {...props}
      >
        <TableCell className="w-[50px]">
          <Button
            variant="ghost"
            color="default"
            size="icon-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              size={18}
              className={cn(
                "transition-transform duration-500",
                isExpanded ? "rotate-180" : "",
              )}
            />
          </Button>
        </TableCell>
        {children}
      </TableRow>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="p-0 border-b border-border">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
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
});
TableCollapsibleRow.displayName = "TableCollapsibleRow";
