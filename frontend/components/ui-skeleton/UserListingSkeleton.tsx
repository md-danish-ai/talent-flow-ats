import React from "react";
import { TableRow, TableCell } from "@components/ui-elements/Table";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { cn } from "@lib/utils";

interface UserListingSkeletonProps {
  rowCount?: number;
}

export function UserListingSkeleton({
  rowCount = 10,
}: UserListingSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, idx) => (
        <TableRow key={idx} className="hover:bg-transparent border-b-border/40">
          <TableCell className="w-[80px] text-center align-middle py-3">
            <Skeleton className="h-6 w-8 mx-auto rounded" />
          </TableCell>

          <TableCell className="align-middle py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded opacity-60" />
              </div>
            </div>
          </TableCell>

          <TableCell className="align-middle py-3">
            <Skeleton className="h-5 w-24 rounded" />
          </TableCell>

          <TableCell className="align-middle py-3 text-center">
            <Skeleton className="h-6 w-20 mx-auto rounded" />
          </TableCell>

          <TableCell className="align-middle py-3">
            <Skeleton className="h-6 w-16 rounded" />
          </TableCell>

          <TableCell className="align-middle py-3 text-center">
            <Skeleton className="h-6 w-16 mx-auto rounded" />
          </TableCell>

          <TableCell className="text-center align-middle py-3">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
