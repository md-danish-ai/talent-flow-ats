import React from "react";
import { Pagination } from "@components/ui-elements/Pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { PaperSetup } from "@types";
import { PaperSetupRow } from "./PaperSetupRow";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { PaperSetupSkeleton } from "@components/ui-skeleton/PaperSetupSkeleton";

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
  onViewDetails: (id: number) => void;
  visibleColumns: string[];
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
  onViewDetails,
  visibleColumns,
}) => {
  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50 text-muted-foreground font-bold">
            <TableRow>
              {isVisible("sr_no") && (
                <TableHead className="w-[80px] text-center">Sr. No.</TableHead>
              )}
              {isVisible("paper_name") && <TableHead>Test Paper</TableHead>}
              {isVisible("department") && <TableHead>Department</TableHead>}
              {isVisible("test_level") && <TableHead>Test Level</TableHead>}
              {isVisible("description") && <TableHead>Description</TableHead>}
              {isVisible("timing") && <TableHead>Timing</TableHead>}
              {isVisible("total_marks") && <TableHead>Total Marks</TableHead>}
              {isVisible("active") && (
                <TableHead className="w-[100px] text-center">Status</TableHead>
              )}
              {isVisible("actions") && (
                <TableHead className="text-center">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PaperSetupSkeleton
                visibleColumns={visibleColumns}
                rowCount={pageSize}
              />
            ) : data.length === 0 ? (
              <EmptyState
                colSpan={visibleColumns.length}
                title="No papers found"
                description="We couldn't find any test papers matching your filters. Try adding a new paper or adjusting your search."
              />
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
                  onViewDetails={onViewDetails}
                  visibleColumns={visibleColumns}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / pageSize) || 1}
          onPageChange={onPageChange}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          className="mt-auto border-t border-border"
        />
      )}
    </div>
  );
};
