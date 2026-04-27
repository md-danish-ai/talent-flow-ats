import React from "react";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@components/ui-elements/Table";

export function PaperDetailSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Card Skeleton */}
      <div className="relative rounded-[2rem] border border-border/40 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="h-6 w-[1px] bg-border/60 mx-1" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-slate-50/10">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 p-6 rounded-2xl bg-slate-50/30 dark:bg-slate-800/20 border border-border/40 relative">
              <Skeleton className="absolute -top-3 left-6 h-6 w-32 rounded-full" />
              <div className="space-y-3 mt-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </div>
            <div className="md:col-span-4 p-6 rounded-2xl bg-brand-primary/[0.02] border border-brand-primary/10 flex flex-col justify-center items-center gap-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 ml-2">
          <Skeleton className="h-6 w-1.5 rounded-full" />
          <Skeleton className="h-4 w-48 rounded" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border/60 to-transparent" />
        </div>

        {/* Table Skeleton */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden shadow-sm bg-white dark:bg-slate-950">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-20"><Skeleton className="h-4 w-12 mx-auto" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead className="w-20"><Skeleton className="h-4 w-12 mx-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent border-b-border/40">
                  <TableCell className="w-12"><Skeleton className="h-4 w-4 rounded-sm mx-auto opacity-40" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-9 w-9 rounded-full mx-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
