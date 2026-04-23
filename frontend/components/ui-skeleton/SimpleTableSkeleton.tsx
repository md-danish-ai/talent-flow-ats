import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface SimpleTableSkeletonProps {
  rowCount?: number;
  columnWidths?: string[];
  columnCount: number;
}

export function SimpleTableSkeleton({
  rowCount = 10,
  columnWidths,
  columnCount,
}: SimpleTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <TableRow key={idx} className="hover:bg-transparent border-b-border/40">
          {Array.from({ length: columnCount }).map((_, cIdx) => (
            <TableCell
              key={cIdx}
              className={columnWidths?.[cIdx] ? columnWidths[cIdx] : ""}
            >
              <Skeleton className="h-8 w-full rounded opacity-70" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
