import React from "react";
import { Pagination } from "@components/ui-elements/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { PaperSetup } from "@lib/api/papers";
import { PaperSetupRow } from "./PaperSetupRow";

interface PaperSetupTableProps {
  data: Partial<PaperSetup>[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
  togglingId: number | null;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onEdit: (paper: Partial<PaperSetup>) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const PaperSetupTable: React.FC<PaperSetupTableProps> = ({
  data,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  togglingId,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[80px] text-center text-slate-500 font-bold">
                Sr. No.
              </TableHead>
              <TableHead className="text-slate-500 font-bold">
                Test Paper
              </TableHead>
              <TableHead className="text-slate-500 font-bold">
                Test Level
              </TableHead>
              <TableHead className="text-slate-500 font-bold">
                Description
              </TableHead>
              <TableHead className="text-slate-500 font-bold">Timing</TableHead>
              <TableHead className="text-slate-500 font-bold">
                Total Marks
              </TableHead>
              <TableHead className="w-[100px] text-center text-slate-500 font-bold">
                Active
              </TableHead>
              <TableHead className="w-[200px] text-center text-brand-primary font-bold">
                Settings / Grading / Edit / Delete
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading papers...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No papers found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <PaperSetupRow
                  key={row.id}
                  row={row}
                  index={index}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  togglingId={togglingId}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewDetails={onViewDetails}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / pageSize) || 1}
        onPageChange={onPageChange}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        className="mt-auto border-t border-border"
      />
    </div>
  );
};
