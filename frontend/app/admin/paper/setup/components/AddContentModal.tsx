import React, { useState } from "react";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Input } from "@components/ui-elements/Input";
import { Checkbox } from "@components/ui-elements/Checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { X } from "lucide-react";

interface AddContentModalProps {
  subjectName: string;
  onClose: () => void;
  onSave: (selectedIds: number[]) => void;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  subjectName,
  onClose,
  onSave,
}) => {
  const [questionType, setQuestionType] = useState("Multiple Choice Question");
  const [questionCount, setQuestionCount] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([
    1, 2, 3, 4, 5,
  ]);

  // Mock questions based on screenshot
  const questions = [
    {
      id: 1,
      text: "Why did the shop owner not accept any money from the worker in the end?",
      type: "Multiple Choice Question",
    },
    {
      id: 2,
      text: "Where did the above scene take place?",
      type: "Multiple Choice Question",
    },
    {
      id: 3,
      text: "What was the commotion in the market about?",
      type: "Multiple Choice Question",
    },
    {
      id: 4,
      text: 'Choose the word which is most nearly the SAME in meaning as the word printed in BOLD as used in the passage: "PLUMP"',
      type: "Multiple Choice Question",
    },
    {
      id: 5,
      text: 'Choose the word which is most nearly the SAME in meaning as the word printed in BOLD as used in the passage: "INCOHERENT"',
      type: "Multiple Choice Question",
    },
    {
      id: 6,
      text: "The primary purpose of the passage is to advise people to:",
      type: "Multiple Choice Question",
    },
  ];

  const handleToggleQuestion = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <Typography
            variant="h3"
            weight="bold"
            className="text-slate-800 dark:text-white"
          >
            {subjectName}
          </Typography>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-b border-border">
          <div className="space-y-1.5">
            <SelectDropdown
              value={questionType}
              onChange={(val) => setQuestionType(String(val))}
              options={[
                {
                  id: "Multiple Choice Question",
                  label: "Multiple Choice Question",
                },
                { id: "Subjective Question", label: "Subjective Question" },
              ]}
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Input
              placeholder="Enter Number of question of this subject and type given in test"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="h-11 border-slate-300"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-[#0a1a33] hover:bg-[#0a1a33] sticky top-0 z-10 border-none">
              <TableRow className="border-b-0 h-12">
                <TableHead className="text-white font-bold w-[100px] text-center">
                  Sr. No.
                </TableHead>
                <TableHead className="text-white font-bold">
                  Questions
                </TableHead>
                <TableHead className="text-white font-bold">
                  Question Type
                </TableHead>
                <TableHead className="text-white font-bold w-[100px] text-center">
                  Select
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, index) => (
                <TableRow
                  key={q.id}
                  className="h-14 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="text-center text-slate-500 font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-4 max-w-md">
                    {q.text}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 italic">
                    {q.type}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={selectedQuestions.includes(q.id)}
                        onChange={() => handleToggleQuestion(q.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-8 bg-slate-400 hover:bg-slate-500 text-white min-w-[120px] rounded-md font-bold text-xs h-10 border-none"
          >
            CLOSE
          </Button>
          <Button
            variant="primary"
            onClick={() => onSave(selectedQuestions)}
            className="px-8 bg-blue-500 hover:bg-blue-600 text-white min-w-[140px] rounded-md font-bold text-xs h-10 border-none"
          >
            SAVE CHANGES
          </Button>
        </div>
      </div>
    </div>
  );
};
