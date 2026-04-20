import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface ResultTableSkeletonProps {
  rowCount?: number;
  visibleColumns: string[];
}

export function ResultTableSkeleton({
  rowCount = 10,
  visibleColumns,
}: ResultTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <TableRow key={idx} className="hover:bg-transparent border-b-border/40">
          <TableCell className="w-[40px]"></TableCell>
          {visibleColumns.map((colId) => {
            if (colId === "candidate") {
              return (
                <TableCell key={colId} className="min-w-[200px] py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded opacity-60" />
                    </div>
                  </div>
                </TableCell>
              );
            }

            if (colId === "marks") {
              return (
                <TableCell key={colId} className="w-[100px] py-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-3 w-24 rounded opacity-50" />
                  </div>
                </TableCell>
              );
            }

            if (colId === "status") {
              return (
                <TableCell key={colId} className="w-[120px] text-center py-4">
                  <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                </TableCell>
              );
            }

            if (colId === "actions") {
              return (
                <TableCell key={colId} className="w-[100px] text-center py-4">
                  <Skeleton className="h-8 w-8 mx-auto rounded-lg" />
                </TableCell>
              );
            }

            // Default for Date, Paper, Subject columns etc
            return (
              <TableCell key={colId} className="min-w-[120px] py-4">
                <Skeleton className="h-5 w-24 rounded opacity-70" />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
