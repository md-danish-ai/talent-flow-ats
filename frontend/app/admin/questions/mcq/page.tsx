"use client";

import React, { useState } from "react";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Input } from "@components/ui-elements/Input";
import { AddQuestionModal } from "./components/AddQuestionModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import { Filter, Search, RotateCcw, Plus } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";

export default function MCQPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<
    string | number | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for the table based on reference image
  const mockData = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    question: `Sample Multiple Choice Question ${i + 1} for testing the UI layout and scroll behavior.`,
    subject: i % 2 === 0 ? "Industry Awareness" : "Comprehension",
    createdBy: "Manish Joshi - Mohan Lal",
    createdDate: "17/11/2018",
  }));

  return (
    <>
      <MainCard
        title="Multiple Choice Questions"
        className="mb-6"
        bodyClassName="p-0 flex flex-row items-stretch"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="action"
              size="rounded-icon"
              isActive={isFilterOpen}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title="Filter"
            >
              <Filter size={18} />
            </Button>
            <Button
              size="sm"
              color="primary"
              shadow
              animate="scale"
              startIcon={<Plus size={14} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Question
            </Button>
          </div>
        }
      >
        {/* Table Area */}
        <div className="flex-1 overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[80px] text-center">Sr. No.</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableCollapsibleRow
                  key={row.id}
                  colSpan={6}
                  expandedContent={
                    <div className="m-4 md:my-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <Typography
                          variant="body3"
                          weight="semibold"
                          className="text-slate-800"
                        >
                          Options & Answer
                        </Typography>
                      </div>

                      {/* Inner Table */}
                      <div className="overflow-x-auto pb-1">
                        <Table>
                          <TableHeader className="bg-transparent text-slate-800 [&_tr]:border-b-0 border-b border-slate-200">
                            <TableRow className="hover:bg-transparent border-0">
                              <TableHead className="font-semibold text-slate-800 px-5 py-3 h-auto w-[120px]">
                                Option
                              </TableHead>
                              <TableHead className="font-semibold text-slate-800 px-5 py-3 h-auto">
                                Value
                              </TableHead>
                              <TableHead className="font-semibold text-slate-800 px-5 py-3 text-right h-auto w-[150px]">
                                Is Correct
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="[&_tr:last-child]:border-0 bg-transparent">
                            <TableRow className="border-b border-slate-100 bg-red-50/30 hover:bg-red-50/50 transition-colors">
                              <TableCell className="px-5 py-3 font-medium text-slate-800">
                                A
                              </TableCell>
                              <TableCell className="px-5 py-3 text-slate-600">
                                Sample Option A
                              </TableCell>
                              <TableCell className="px-5 py-3 text-right text-red-500 font-medium">
                                Incorrect
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-b border-slate-100 bg-green-50/30 hover:bg-green-50/50 transition-colors">
                              <TableCell className="px-5 py-3 font-medium text-slate-800">
                                B
                              </TableCell>
                              <TableCell className="px-5 py-3 text-slate-600">
                                Sample Option B
                              </TableCell>
                              <TableCell className="px-5 py-3 text-right text-green-600 font-medium">
                                Correct
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-b border-slate-100 bg-red-50/30 hover:bg-red-50/50 transition-colors">
                              <TableCell className="px-5 py-3 font-medium text-slate-800">
                                C
                              </TableCell>
                              <TableCell className="px-5 py-3 text-slate-600">
                                Sample Option C
                              </TableCell>
                              <TableCell className="px-5 py-3 text-right text-red-500 font-medium">
                                Incorrect
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-b border-slate-100 bg-red-50/30 hover:bg-red-50/50 transition-colors">
                              <TableCell className="px-5 py-3 font-medium text-slate-800">
                                D
                              </TableCell>
                              <TableCell className="px-5 py-3 text-slate-600">
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
                      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
                        <Typography
                          variant="body3"
                          weight="semibold"
                          className="text-slate-800 inline-block mr-1"
                        >
                          Explanation:
                        </Typography>
                        <Typography
                          variant="body3"
                          className="text-slate-600 inline-block"
                        >
                          This is a sample explanation for the multiple choice
                          question. It expands seamlessly below the row.
                        </Typography>
                      </div>
                    </div>
                  }
                >
                  <TableCell className="font-medium text-center">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.question}</TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell>{row.createdDate}</TableCell>
                </TableCollapsibleRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <InlineDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filter"
        >
          <div className="p-5 flex-1 space-y-6">
            <div>
              <Typography
                as="label"
                variant="body3"
                weight="medium"
                className="block mb-1.5 text-slate-700"
              >
                Subject
              </Typography>
              <SelectDropdown
                placeholder="Please Select Subject"
                value={subjectFilter}
                onChange={setSubjectFilter}
                options={[
                  { id: "Industry Awareness", label: "Industry Awareness" },
                  { id: "Comprehension", label: "Comprehension" },
                ]}
                placement="bottom"
                className="h-10 py-2 text-sm"
              />
            </div>

            <div>
              <Typography
                as="label"
                variant="body3"
                weight="medium"
                className="block mb-1.5 text-slate-700"
              >
                Search Question
              </Typography>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Question---"
                  className="h-10 py-2 text-sm"
                  startIcon={<Search className="w-4 h-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-center mt-auto">
              <Button
                variant="outline"
                color="primary"
                size="sm"
                startIcon={<RotateCcw size={14} />}
                onClick={() => {
                  setSubjectFilter(undefined);
                  setSearchQuery("");
                }}
                animate="scale"
                // className="w-1/2"
              >
                Reset
              </Button>
            </div>
          </div>
        </InlineDrawer>
      </MainCard>

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
