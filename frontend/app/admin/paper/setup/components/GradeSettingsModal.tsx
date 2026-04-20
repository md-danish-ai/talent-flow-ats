"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@components/ui-elements/Table";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { papersApi, GradeSetting } from "@lib/api/papers";
import { toast } from "@lib/toast";
import { Trash2, Edit2, Loader2 } from "lucide-react";

interface GradeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: number;
}

const GRADE_OPTIONS = [
  { label: "Poor", value: "Poor" },
  { label: "Average", value: "Average" },
  { label: "Good", value: "Good" },
  { label: "Excellent", value: "Excellent" },
];

export const GradeSettingsModal: React.FC<GradeSettingsModalProps> = ({
  isOpen,
  onClose,
  paperId,
}) => {
  const [grades, setGrades] = useState<GradeSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formMin, setFormMin] = useState("");
  const [formMax, setFormMax] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPaperData = async () => {
      try {
        setLoading(true);
        const response = await papersApi.getPaperById(paperId);
        const data = response;
        if (data.grade_settings) {
          setGrades(data.grade_settings);
        } else {
          setGrades([]);
        }
      } catch (error) {
        console.error("Failed to fetch paper grade settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && paperId) {
      fetchPaperData();
    }
  }, [isOpen, paperId]);

  const handleAddOrUpdateGrade = () => {
    if (!formMin || !formMax || !formLabel) {
      toast.error("All fields are required");
      return;
    }

    const minNum = parseFloat(formMin);
    const maxNum = parseFloat(formMax);

    if (isNaN(minNum) || isNaN(maxNum)) {
      toast.error("Min and Max must be numbers");
      return;
    }

    if (minNum >= maxNum) {
      toast.error("Min should be less than Max");
      return;
    }

    const existingIndex = grades.findIndex((g) => g.grade_label === formLabel);
    if (existingIndex !== -1 && existingIndex !== editingIndex) {
      toast.error(`Grade "${formLabel}" is already added.`);
      return;
    }

    const newGrade: GradeSetting = {
      min: minNum,
      max: maxNum,
      grade_label: formLabel,
    };

    const updatedGrades = [...grades];
    if (editingIndex !== null) {
      updatedGrades[editingIndex] = newGrade;
    } else {
      updatedGrades.push(newGrade);
    }

    // Sort by min value
    updatedGrades.sort((a, b) => a.min - b.min);

    setGrades(updatedGrades);
    resetForm();
  };

  const resetForm = () => {
    setFormMin("");
    setFormMax("");
    setFormLabel("");
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    const item = grades[index];
    setFormMin(item.min.toString());
    setFormMax(item.max.toString());
    setFormLabel(item.grade_label);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedGrades = grades.filter((_, i) => i !== index);
    setGrades(updatedGrades);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await papersApi.updateGradeSettings(paperId, grades);
      toast.success("Grade settings saved successfully");
      onClose();
    } catch (error) {
      console.error("Failed to save grade settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grade Settings">
      <div className="space-y-6">
        {/* Form Area */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Typography
                variant="body5"
                className="mb-1.5 ml-1 text-muted-foreground uppercase font-bold tracking-wider"
              >
                From (%)
              </Typography>
              <Input
                placeholder="0.00"
                value={formMin}
                onChange={(e) => setFormMin(e.target.value)}
              />
            </div>
            <div>
              <Typography
                variant="body5"
                className="mb-1.5 ml-1 text-muted-foreground uppercase font-bold tracking-wider"
              >
                To (%)
              </Typography>
              <Input
                placeholder="49.99"
                value={formMax}
                onChange={(e) => setFormMax(e.target.value)}
              />
            </div>
            <div>
              <Typography
                variant="body5"
                className="mb-1.5 ml-1 text-muted-foreground uppercase font-bold tracking-wider"
              >
                Select Grade
              </Typography>
              <SelectDropdown
                placeholder="Please Select Grade"
                value={formLabel}
                onChange={(value) => setFormLabel(String(value))}
                options={GRADE_OPTIONS.map((opt) => ({
                  id: opt.value,
                  label: opt.label,
                }))}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddOrUpdateGrade} color="primary" size="md">
              {editingIndex !== null ? "Update Rule" : "Add Grade Rule"}
            </Button>
            {editingIndex !== null && (
              <Button variant="ghost" onClick={resetForm} className="ml-2">
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* List Area */}
        <div className="border border-border/50 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-800 dark:bg-slate-950">
              <TableRow>
                <TableHead className="text-white font-bold text-center w-20">
                  Sr. No.
                </TableHead>
                <TableHead className="text-white font-bold">
                  Range From(%)
                </TableHead>
                <TableHead className="text-white font-bold">
                  Range To(%)
                </TableHead>
                <TableHead className="text-white font-bold">Grade</TableHead>
                <TableHead className="text-white font-bold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-brand-primary h-8 w-8" />
                      <Typography
                        variant="body4"
                        className="text-muted-foreground"
                      >
                        Loading configurations...
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              ) : grades.length === 0 ? (
                <EmptyState
                  colSpan={5}
                  title="No grading rules defined"
                  description="No grading rules defined yet. Add your first range above."
                />
              ) : (
                grades.map((grade, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell className="text-center font-bold text-muted-foreground/60">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {grade.min.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {grade.max.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" color="primary" shape="square">
                        {grade.grade_label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center p-0">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500"
                          onClick={() => handleEdit(idx)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDelete(idx)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Area */}
        <div className="flex justify-end w-full pt-4">
          <div className="flex gap-3">
            <Button variant="outline" color="primary" onClick={onClose}>
              CLOSE
            </Button>
            <Button color="primary" onClick={handleSaveAll} disabled={saving}>
              {saving ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              SAVE GRADE
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
