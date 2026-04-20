import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";

interface ResetUserListingSkeletonProps {
  rowCount?: number;
}

export function ResetUserListingSkeleton({
  rowCount = 10,
}: ResetUserListingSkeletonProps) {
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
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-4 w-14 rounded" />
                </div>
                <Skeleton className="h-3 w-28 rounded opacity-60" />
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
          <TableCell className="align-middle py-4 text-center">
            <Skeleton className="h-6 w-24 mx-auto rounded opacity-80" />
          </TableCell>

          {/* Test Level */}
          <TableCell className="align-middle py-4 text-center">
            <Skeleton className="h-6 w-20 mx-auto rounded opacity-80" />
          </TableCell>

          {/* Status */}
          <TableCell className="align-middle py-4 text-center">
            <Skeleton className="h-6 w-16 mx-auto rounded-full opacity-60" />
          </TableCell>

          {/* Actions */}
          <TableCell className="text-center align-middle py-4">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg opacity-80" />
              <Skeleton className="h-8 w-8 rounded-lg opacity-80" />
              <Skeleton className="h-8 w-8 rounded-lg opacity-80" />
              <Skeleton className="h-8 w-8 rounded-lg opacity-80" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
