"use client";

import React from "react";
import { Skeleton } from "./Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { cn } from "@lib/utils";

interface TableSkeletonProps {
  /**
   * Number of columns to show.
   * @default 5
   */
  columnCount?: number;
  /**
   * Number of rows to show.
   * @default 5
   */
  rowCount?: number;
  /**
   * Whether to show a checkbox column at the start.
   * @default false
   */
  showCheckbox?: boolean;
  /**
   * Number of action buttons to show at the end.
   * If 0, no action column is shown.
   * @default 0
   */
  actionButtons?: number;
  /**
   * Additional className for the container.
   */
  className?: string;
  /**
   * If true, only renders the rows without Table, TableHeader or TableBody wrappers.
   * Useful when you want to keep the header visible.
   * @default false
   */
  onlyRows?: boolean;
}

/**
 * A dynamic table skeleton loader that matches the design of the application's Table component.
 * It allows for dynamic row and column counts to fit any table structure.
 */
export function TableSkeleton({
  columnCount = 5,
  rowCount = 5,
  showCheckbox = false,
  actionButtons = 0,
  className,
  onlyRows = false,
}: TableSkeletonProps) {
  const rows = Array.from({ length: rowCount }).map((_, rowIndex) => (
    <TableRow
      key={rowIndex}
      className="hover:bg-transparent border-b-border/40"
    >
      {showCheckbox && (
        <TableCell className="w-[50px]">
          <Skeleton className="h-6 w-6 rounded" />
        </TableCell>
      )}

      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <TableCell
          key={colIndex}
          className={cn(
            colIndex === 0 && "w-[80px] text-center",
            colIndex === columnCount - 1 && actionButtons === 0 && "text-right",
          )}
        >
          <Skeleton
            className={cn(
              "h-6 rounded mx-auto",
              // First column is usually Sr. No (Small)
              colIndex === 0
                ? "w-8"
                : // Last column if no actions might be a status or something
                  colIndex === columnCount - 1
                  ? "w-20"
                  : // Others
                    "w-full max-w-[150px]",
            )}
          />
        </TableCell>
      ))}

      {actionButtons > 0 && (
        <TableCell className="w-[140px]">
          <div className="flex justify-center gap-2">
            {Array.from({ length: actionButtons }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-lg" />
            ))}
          </div>
        </TableCell>
      )}
    </TableRow>
  ));

  if (onlyRows) {
    return <>{rows}</>;
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {showCheckbox && (
              <TableHead className="w-[50px]">
                <Skeleton className="h-6 w-6 rounded" />
              </TableHead>
            )}
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead
                key={i}
                className={cn(i === 0 && "w-[80px] text-center")}
              >
                <Skeleton
                  className={cn(
                    "h-5 rounded mx-auto",
                    i === 0 ? "w-10" : "w-16",
                  )}
                />
              </TableHead>
            ))}
            {actionButtons > 0 && (
              <TableHead className="w-[140px] text-center">
                <Skeleton className="h-5 w-16 mx-auto rounded" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </div>
  );
}
