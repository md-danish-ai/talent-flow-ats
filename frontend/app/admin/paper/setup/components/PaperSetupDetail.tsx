import React, { useState } from "react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { ArrowLeft, FileText, PlusCircle } from "lucide-react";
import { AddContentModal } from "./AddContentModal";

interface PaperSetupDetailProps {
  paperId: number;
  onBack: () => void;
}

export const PaperSetupDetail: React.FC<PaperSetupDetailProps> = ({
  paperId,
  onBack,
}) => {
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubjectForAdd, setSelectedSubjectForAdd] = useState<
    string | null
  >(null);

  interface SubjectConfig {
    id: number;
    subject_name: string;
    question_count: number;
    total_marks: number;
    order: number;
    selected_count: number;
  }

  interface Question {
    id: number;
    text: string;
    selected: boolean;
  }

  interface Paper {
    id: number;
    paper_name: string;
    department_name: string;
    test_level_name: string;
    description: string;
    total_time: string;
    total_marks: number;
    subject_configs: SubjectConfig[];
    questions: Record<string, Question[]>;
  }

  // Mock detailed data
  const paper: Paper = {
    id: paperId,
    paper_name: "Temp",
    department_name: "KPO",
    test_level_name: "Team Lead",
    description: "Temp",
    total_time: "01:50:00",
    total_marks: 350,
    subject_configs: [
      {
        id: 1,
        subject_name: "Comprehension",
        question_count: 5,
        total_marks: 10,
        order: 1,
        selected_count: 5,
      },
      {
        id: 2,
        subject_name: "Written",
        question_count: 10,
        total_marks: 20,
        order: 2,
        selected_count: 16,
      },
      {
        id: 3,
        subject_name: "Grammar",
        question_count: 7,
        total_marks: 7,
        order: 3,
        selected_count: 11,
      },
      {
        id: 4,
        subject_name: "Aptitude",
        question_count: 8,
        total_marks: 8,
        order: 4,
        selected_count: 11,
      },
      {
        id: 5,
        subject_name: "Industry Awareness",
        question_count: 5,
        total_marks: 5,
        order: 5,
        selected_count: 10,
      },
    ],
    questions: {
      "1": [
        {
          id: 101,
          text: "Why did the shop owner not accept any money from the worker in the end?",
          selected: true,
        },
        {
          id: 102,
          text: "Where did the above scene take place?",
          selected: true,
        },
        {
          id: 103,
          text: "What was the commotion in the market about?",
          selected: true,
        },
        {
          id: 104,
          text: "Choose the word which is most nearly the SAME in meaning as the word printed in BOLD...",
          selected: true,
        },
      ],
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <MainCard
        title={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft size={18} />
            </Button>
            Paper Overview
          </div>
        }
        className="overflow-hidden border-none shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <DetailItem label="Department:" value={paper.department_name} />
          <DetailItem label="Paper Name:" value={paper.paper_name} />
          <DetailItem
            label="Total marks:"
            value={Number(paper.total_marks).toFixed(2)}
          />
          <DetailItem label="Descriptions:" value={paper.description} />
          <DetailItem label="Timings:" value={paper.total_time} />
          <DetailItem label="Test Level:" value={paper.test_level_name} />

          <div className="md:col-span-3 mt-4">
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              startIcon={<FileText size={18} />}
              className="font-bold tracking-wide border-none bg-blue-500 hover:bg-blue-600 px-6 h-10"
            >
              VIEW FULL PAPER SET
            </Button>
          </div>
        </div>
      </MainCard>

      <Typography
        variant="body5"
        weight="bold"
        className="text-muted-foreground ml-2"
      >
        Instructions: Click on Subject to Assign Question
      </Typography>

      <div className="border border-border rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900 hover:bg-slate-900 border-b-0 h-14">
              <TableHead className="text-white font-bold text-center w-[80px]">
                Sr. No.
              </TableHead>
              <TableHead className="text-white font-bold">Subject</TableHead>
              <TableHead className="text-white font-bold">
                Total Selected Questions
              </TableHead>
              <TableHead className="text-white font-bold">
                Question Count
              </TableHead>
              <TableHead className="text-white font-bold">
                Question Marks
              </TableHead>
              <TableHead className="text-white font-bold w-[100px] text-center">
                Order
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paper.subject_configs.map(
              (config: SubjectConfig, index: number) => (
                <TableCollapsibleRow
                  key={config.id}
                  colSpan={6}
                  className="group/row transition-all duration-300"
                  isOpen={expandedSubjectId === config.id}
                  onOpenChange={(open) =>
                    setExpandedSubjectId(open ? config.id : null)
                  }
                  expandedContent={
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-border">
                      <div className="p-4 border-b border-border flex justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          startIcon={<PlusCircle size={16} />}
                          className="bg-blue-500 hover:bg-blue-600 border-none h-9 px-4 font-bold text-[11px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubjectForAdd(config.subject_name);
                            setIsAddModalOpen(true);
                          }}
                        >
                          ADD CONTENT
                        </Button>
                      </div>
                      <Table>
                        <TableHeader className="bg-[#0a1a33] hover:bg-[#0a1a33] border-none">
                          <TableRow className="border-b-0 h-10 hover:bg-transparent">
                            <TableHead className="text-white font-bold text-center w-[80px] text-[11px]">
                              Sr. No.
                            </TableHead>
                            <TableHead className="text-white font-bold text-[11px]">
                              Questions
                            </TableHead>
                            <TableHead className="text-white font-bold text-center w-[100px] text-[11px]">
                              Select
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(paper.questions[config.id.toString()] || []).map(
                            (q: Question, qIdx: number) => (
                              <TableRow
                                key={q.id}
                                className="h-10 border-b border-border/40 last:border-0 hover:bg-white/40 dark:hover:bg-slate-800/40"
                              >
                                <TableCell className="text-center text-muted-foreground font-medium">
                                  {qIdx + 1}
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300 font-medium py-3">
                                  {q.text}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={q.selected}
                                      onChange={() => {}}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  }
                >
                  <TableCell className="text-center font-bold text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-blue-600 hover:underline cursor-pointer">
                    {config.subject_name}
                  </TableCell>
                  <TableCell>{config.selected_count}</TableCell>
                  <TableCell>{config.question_count}</TableCell>
                  <TableCell>{config.total_marks.toFixed(2)}</TableCell>
                  <TableCell className="text-center font-medium">
                    {config.order}
                  </TableCell>
                </TableCollapsibleRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>

      {isAddModalOpen && selectedSubjectForAdd && (
        <AddContentModal
          subjectName={selectedSubjectForAdd}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(ids) => {
            console.log("Selected Question IDs:", ids);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2 py-1">
    <Typography
      variant="body5"
      weight="bold"
      className="text-slate-800 dark:text-slate-400 min-w-[100px]"
    >
      {label}
    </Typography>
    <Typography
      variant="body3"
      weight="medium"
      className="text-slate-500 border-b border-dotted border-slate-300 pb-0.5"
    >
      {value}
    </Typography>
  </div>
);
