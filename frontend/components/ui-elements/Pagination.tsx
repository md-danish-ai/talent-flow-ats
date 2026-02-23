"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { SelectDropdown } from "./SelectDropdown";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = pageSize
    ? Math.min(currentPage * pageSize, totalItems || 0)
    : 0;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-border bg-card/50 backdrop-blur-sm transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        {totalItems !== undefined && pageSize !== undefined && (
          <Typography
            variant="body5"
            className="text-muted-foreground font-medium"
          >
            Showing{" "}
            <span className="text-foreground font-bold">
              {startItem}-{endItem}
            </span>{" "}
            of <span className="text-foreground font-bold">{totalItems}</span>
          </Typography>
        )}

        {onPageSizeChange && pageSize && (
          <div className="flex items-center gap-3">
            <Typography
              variant="body5"
              className="text-muted-foreground uppercase tracking-widest font-black text-[9px] whitespace-nowrap"
            >
              Rows per page
            </Typography>
            <SelectDropdown
              value={pageSize}
              options={pageSizeOptions.map((size) => ({
                id: size,
                label: size.toString(),
              }))}
              onChange={(val) => onPageSizeChange(Number(val))}
              className="w-20 pl-4 py-2"
              placement="top"
              placeholder={pageSize.toString()}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          color="primary"
          size="icon-sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-xl border-border/50 hover:bg-brand-primary/5 transition-all duration-300"
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </Button>
        <Button
          variant="outline"
          color="primary"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl border-border/50 hover:bg-brand-primary/5 transition-all duration-300"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-2 mx-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-1 text-muted-foreground/30 font-medium tracking-widest text-xs">
                  •••
                </span>
              ) : (
                <Button
                  variant={currentPage === page ? "primary" : "outline"}
                  color="primary"
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "w-9 h-9 rounded-xl p-0 font-medium transition-all duration-300 text-sm",
                    currentPage === page
                      ? "shadow-lg shadow-brand-primary/25 scale-110 z-10"
                      : "border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/5 text-brand-primary",
                  )}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          color="primary"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl border-border/50 hover:bg-brand-primary/5 transition-all duration-300"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          variant="outline"
          color="primary"
          size="icon-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="rounded-xl border-border/50 hover:bg-brand-primary/5 transition-all duration-300"
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
}
