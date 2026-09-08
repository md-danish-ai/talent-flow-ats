import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { PaperOverviewCardSkeleton } from "@components/features/paper-setup/PaperOverviewCard";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@components/ui-elements/Table";

export function PaperDetailSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PaperOverviewCardSkeleton />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 ml-2">
          <Skeleton className="h-6 w-1.5 rounded-full" />
          <Skeleton className="h-6 w-56 rounded" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border/60 to-transparent" />
        </div>

        {/* Table Skeleton */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden shadow-sm bg-white dark:bg-slate-950">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-20">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="w-20">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-transparent border-b-border/40"
                >
                  <TableCell className="w-12">
                    <Skeleton className="h-4 w-4 rounded-sm mx-auto opacity-40" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-9 w-9 rounded-full mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
