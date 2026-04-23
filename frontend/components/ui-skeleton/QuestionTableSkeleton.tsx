import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface QuestionTableSkeletonProps {
  rowCount?: number;
  visibleColumns: string[];
  hasImage?: boolean;
}

export function QuestionTableSkeleton({
  rowCount = 10,
  visibleColumns,
  hasImage = false,
}: QuestionTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <TableRow key={idx} className="hover:bg-transparent border-b-border/40">
          {/* Leading spacing column (Collapsible Icon) */}
          <TableCell className="w-[50px]">
            <Skeleton className="h-10 w-6 mx-auto rounded-sm opacity-60" />
          </TableCell>

          {visibleColumns.map((colId) => {
            // Specific styling for certain columns
            if (colId === "srNo") {
              return (
                <TableCell key={colId} className="w-[80px] text-center">
                  <Skeleton className="h-10 w-8 mx-auto rounded" />
                </TableCell>
              );
            }

            if (colId === "image" && hasImage) {
              return (
                <TableCell key={colId} className="w-[80px] text-center">
                  <Skeleton className="h-12 w-12 mx-auto rounded-lg" />
                </TableCell>
              );
            }

            if (colId === "question") {
              return (
                <TableCell key={colId} className="min-w-[300px]">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-full max-w-[400px] rounded" />
                    <Skeleton className="h-3 w-1/2 rounded opacity-60" />
                  </div>
                </TableCell>
              );
            }

            if (colId === "marks") {
              return (
                <TableCell key={colId} className="w-[80px] text-center">
                  <Skeleton className="h-10 w-10 mx-auto rounded" />
                </TableCell>
              );
            }

            if (colId === "status") {
              return (
                <TableCell key={colId} className="w-[100px] text-center">
                  <Skeleton className="h-10 w-16 mx-auto rounded" />
                </TableCell>
              );
            }

            if (colId === "actions") {
              return (
                <TableCell key={colId} className="w-[140px] text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-10 w-8 rounded-lg" />
                    <Skeleton className="h-10 w-8 rounded-lg" />
                  </div>
                </TableCell>
              );
            }

            // Default skeleton for other columns (websiteUrl, companyName, Email, etc.)
            return (
              <TableCell key={colId} className="min-w-[120px]">
                <Skeleton className="h-10 w-full max-w-[150px] rounded" />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
