import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface PaperSetupSkeletonProps {
  rowCount?: number;
  visibleColumns: string[];
}

export function PaperSetupSkeleton({
  rowCount = 10,
  visibleColumns,
}: PaperSetupSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <TableRow key={idx} className="hover:bg-transparent border-b-border/40">
          {visibleColumns.map((colId) => {
            if (colId === "sr_no") {
              return (
                <TableCell key={colId} className="w-[80px] text-center">
                  <Skeleton className="h-6 w-8 mx-auto rounded" />
                </TableCell>
              );
            }

            if (colId === "paper_name") {
              return (
                <TableCell key={colId} className="min-w-[200px]">
                  <Skeleton className="h-6 w-48 rounded" />
                </TableCell>
              );
            }

            if (colId === "department" || colId === "test_level") {
              return (
                <TableCell key={colId} className="w-[120px]">
                  <Skeleton className="h-6 w-24 rounded" />
                </TableCell>
              );
            }

            if (colId === "timing" || colId === "total_marks") {
              return (
                <TableCell key={colId} className="w-[100px]">
                  <Skeleton className="h-6 w-12 rounded" />
                </TableCell>
              );
            }

            if (colId === "active") {
              return (
                <TableCell key={colId} className="w-[100px] text-center">
                  <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                </TableCell>
              );
            }

            if (colId === "actions") {
              return (
                <TableCell key={colId} className="text-center min-w-[200px]">
                  <div className="flex items-center justify-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              );
            }

            // Default skeleton for any other columns (like description)
            return (
              <TableCell key={colId}>
                <Skeleton className="h-5 w-full max-w-[150px] rounded" />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
