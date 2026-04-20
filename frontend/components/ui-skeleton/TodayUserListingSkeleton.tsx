import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface TodayUserListingSkeletonProps {
  rowCount?: number;
}

export function TodayUserListingSkeleton({
  rowCount = 10,
}: TodayUserListingSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <TableRow key={idx} className="hover:bg-transparent border-b-border/40">
          {/* Sr. No. */}
          <TableCell className="w-[80px] text-center align-middle py-4">
            <Skeleton className="h-6 w-8 mx-auto rounded" />
          </TableCell>

          {/* Candidate Name */}
          <TableCell className="align-middle py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-3 w-24 rounded opacity-60" />
              </div>
            </div>
          </TableCell>

          {/* Contact Info */}
          <TableCell className="align-middle py-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28 rounded opacity-70" />
              <Skeleton className="h-4 w-20 rounded opacity-40" />
            </div>
          </TableCell>

          {/* Department */}
          <TableCell className="align-middle py-4">
            <Skeleton className="h-6 w-24 rounded opacity-80" />
          </TableCell>

          {/* Test Level */}
          <TableCell className="align-middle py-4">
            <Skeleton className="h-6 w-20 rounded opacity-80" />
          </TableCell>

          {/* Assigned Paper */}
          <TableCell className="align-middle py-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded opacity-60" />
            </div>
          </TableCell>

          {/* Action */}
          <TableCell className="text-center align-middle py-4">
            <div className="flex items-center justify-center">
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
