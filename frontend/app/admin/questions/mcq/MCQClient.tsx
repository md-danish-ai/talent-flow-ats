"use client";

import React, { useState } from "react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Input } from "@components/ui-elements/Input";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { Filter, Search, RotateCcw, Plus, ListChecks } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";

interface MCQQuestion {
  id: number;
  question: string;
  subject: string;
  createdBy: string;
  createdDate: string;
}

interface MCQClientProps {
  initialData: MCQQuestion[];
  totalItems: number;
}

export function MCQClient({
  initialData,
  totalItems: initialTotalItems,
}: MCQClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<
    string | number | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Column Visibility State
  const allColumns = [
    { id: "srNo", label: "Sr. No." },
    { id: "question", label: "Question" },
    { id: "subject", label: "Subject" },
    { id: "createdBy", label: "Created By" },
    { id: "createdDate", label: "Created Date" },
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    "srNo",
    "question",
    "subject",
    "createdBy",
  ]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = initialTotalItems;
  const totalPages = Math.ceil(totalItems / pageSize);

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // For now we still use mock since we don't have a real API to call for filters/pagination in this demo
  const mockData =
    initialData.length > 0
      ? initialData
      : Array.from({ length: pageSize }).map((_, i) => {
          const actualId = (currentPage - 1) * pageSize + i + 1;
          return {
            id: actualId,
            question: `Sample Multiple Choice Question ${actualId} for testing the UI layout and scroll behavior.`,
            subject: i % 2 === 0 ? "Industry Awareness" : "Comprehension",
            createdBy: "Manish Joshi - Mohan Lal",
            createdDate: "17/11/2018",
          };
        });

  return (
    <PageContainer animate>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <ListChecks size={20} />
            </div>
            Multiple Choice Questions
          </>
        }
        className="mb-6 flex-1 flex flex-col min-h-[600px]"
        bodyClassName="p-0 flex flex-row items-stretch flex-1"
        action={
          <div className="flex items-center gap-3">
            <TableColumnToggle
              columns={allColumns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
            />
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant="action"
              size="rounded-icon"
              isActive={isFilterOpen}
              animate="scale"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title="Filter"
            >
              <Filter size={18} />
            </Button>
            <Button
              variant="primary"
              color="primary"
              size="default"
              shadow
              animate="scale"
              iconAnimation="rotate-90"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<Plus size={18} />}
              className="rounded-lg font-bold"
            >
              Add Question
            </Button>
          </div>
        }
      >
        {/* Main Content Area (Table + Pagination) */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden",
            isFilterOpen && "border-r border-border",
          )}
        >
          {/* Table Area */}
          <div className="flex-1 overflow-x-auto w-full min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  {visibleColumns.includes("srNo") && (
                    <TableHead className="w-[80px] text-center">
                      Sr. No.
                    </TableHead>
                  )}
                  {visibleColumns.includes("question") && (
                    <TableHead>Question</TableHead>
                  )}
                  {visibleColumns.includes("subject") && (
                    <TableHead>Subject</TableHead>
                  )}
                  {visibleColumns.includes("createdBy") && (
                    <TableHead>Created By</TableHead>
                  )}
                  {visibleColumns.includes("createdDate") && (
                    <TableHead>Created Date</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((row) => (
                  <TableCollapsibleRow
                    key={row.id}
                    colSpan={visibleColumns.length + 1}
                    expandedContent={
                      <div className="m-4 md:my-4 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        {/* Header Area */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                              <ListChecks size={18} />
                            </div>
                            <div>
                              <Typography variant="body3" weight="bold">
                                Question Details & Options
                              </Typography>
                              <Typography
                                variant="body5"
                                className="text-muted-foreground"
                              >
                                Review all options and correct answer
                                explanation.
                              </Typography>
                            </div>
                          </div>
                        </div>

                        {/* Options Grid */}
                        <div className="p-5">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/30 border-b border-border">
                                <TableHead className="w-[80px] h-10">
                                  Option
                                </TableHead>
                                <TableHead className="h-10">Content</TableHead>
                                <TableHead className="w-[120px] text-right h-10">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                <TableCell className="px-5 py-3 font-medium text-foreground">
                                  A
                                </TableCell>
                                <TableCell className="px-5 py-3 text-muted-foreground">
                                  Sample Option A
                                </TableCell>
                                <TableCell className="px-5 py-3 text-right text-red-500 font-medium">
                                  Incorrect
                                </TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border bg-green-500/5 hover:bg-green-500/10 transition-colors">
                                <TableCell className="px-5 py-3 font-medium text-foreground">
                                  B
                                </TableCell>
                                <TableCell className="px-5 py-3 text-muted-foreground font-bold text-green-600 dark:text-green-500">
                                  Sample Option B (Correct)
                                </TableCell>
                                <TableCell className="px-5 py-3 text-right text-green-500 font-medium">
                                  Correct
                                </TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                <TableCell className="px-5 py-3 font-medium text-foreground">
                                  C
                                </TableCell>
                                <TableCell className="px-5 py-3 text-muted-foreground">
                                  Sample Option C
                                </TableCell>
                                <TableCell className="px-5 py-3 text-right text-red-500 font-medium">
                                  Incorrect
                                </TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                <TableCell className="px-5 py-3 font-medium text-foreground">
                                  D
                                </TableCell>
                                <TableCell className="px-5 py-3 text-muted-foreground">
                                  Sample Option D
                                </TableCell>
                                <TableCell className="px-5 py-3 text-right text-red-500 font-medium">
                                  Incorrect
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Footer Notes */}
                        <div className="px-5 py-3 bg-muted/20 border-t border-border">
                          <Typography
                            variant="body3"
                            weight="semibold"
                            className="inline-block mr-1"
                          >
                            Explanation:
                          </Typography>
                          <Typography
                            variant="body3"
                            className="text-muted-foreground inline-block"
                          >
                            This is a sample explanation for the multiple choice
                            question. It expands seamlessly below the row.
                          </Typography>
                        </div>
                      </div>
                    }
                  >
                    {visibleColumns.includes("srNo") && (
                      <TableCell className="font-medium text-center">
                        {row.id}
                      </TableCell>
                    )}
                    {visibleColumns.includes("question") && (
                      <TableCell>{row.question}</TableCell>
                    )}
                    {visibleColumns.includes("subject") && (
                      <TableCell>{row.subject}</TableCell>
                    )}
                    {visibleColumns.includes("createdBy") && (
                      <TableCell>{row.createdBy}</TableCell>
                    )}
                    {visibleColumns.includes("createdDate") && (
                      <TableCell>{row.createdDate}</TableCell>
                    )}
                  </TableCollapsibleRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Area */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            className="mt-auto shrink-0"
          />
        </div>

        <InlineDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filters"
        >
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
            {/* Search */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Search Questions
              </Typography>
              <div className="relative group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors"
                  size={18}
                />
                <Input
                  placeholder="Search by keyword..."
                  className="pl-11 h-12 border-border/60 hover:border-border focus:border-brand-primary transition-all rounded-xl bg-muted/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                By Subject
              </Typography>
              <SelectDropdown
                placeholder="All Subjects"
                options={[
                  { id: "all", label: "All Subjects" },
                  { id: "ia", label: "Industry Awareness" },
                  { id: "comp", label: "Comprehension" },
                ]}
                value={subjectFilter || "all"}
                onChange={(val) => setSubjectFilter(val)}
                className="h-12 border-border/60 hover:border-border rounded-xl bg-muted/20"
                placement="bottom"
              />
            </div>

            {/* Reset Action directly after dropdown */}
            <div className="pt-2">
              <Button
                variant="outline"
                color="primary"
                size="default"
                shadow
                animate="scale"
                iconAnimation="rotate-360"
                startIcon={<RotateCcw size={18} />}
                onClick={() => {
                  setSearchQuery("");
                  setSubjectFilter(undefined);
                }}
                className="rounded-lg font-bold w-full h-12"
                title="Reset Filters"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </InlineDrawer>
      </MainCard>

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </PageContainer>
  );
}
