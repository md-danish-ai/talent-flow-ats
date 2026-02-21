import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { AnimatePresence, motion } from "framer-motion";

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
      "bg-slate-950 dark:bg-slate-950 text-white border-b border-border [&_tr]:hover:bg-transparent transition-colors",
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
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 bg-card", className)}
    {...props}
  />
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
