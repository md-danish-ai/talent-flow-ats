"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { papersApi } from "@lib/api/papers";
import { type GradeSetting } from "@types";
import { toast } from "@lib/toast";
import {
  Trash2,
  Edit2,
  Loader2,
  AlertTriangle,
  Info,
  Plus,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { GRADE_OPTIONS, GRADE_CONFIG } from "@lib/utils/gradeUtils";

interface GradeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: number;
}

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

  // Allow only valid numeric input (digits + at most one decimal point)
  const handleNumericInput = (value: string, setter: (v: string) => void) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const normalized =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
    setter(normalized);
  };

  const handleAddOrUpdateGrade = () => {
    if (!formMin || !formMax || !formLabel) {
      toast.error("All fields are required");
      return;
    }

    const minNum = parseFloat(formMin);
    const maxNum = parseFloat(formMax);

    if (isNaN(minNum) || isNaN(maxNum)) {
      toast.error("Min and Max must be valid numbers");
      return;
    }

    if (minNum < 0 || maxNum < 0) {
      toast.error("Values cannot be negative");
      return;
    }

    if (minNum >= maxNum) {
      toast.error('"From" must be less than "To"');
      return;
    }

    // Check for duplicate label (ignoring the entry being edited)
    const existingIndex = grades.findIndex((g) => g.grade_label === formLabel);
    if (existingIndex !== -1 && existingIndex !== editingIndex) {
      toast.error(`Grade "${formLabel}" is already added.`);
      return;
    }

    // Check for range overlap with other grades
    const otherGrades = grades.filter((_, i) => i !== editingIndex);
    const hasOverlap = otherGrades.some(
      (g) => minNum < g.max && maxNum > g.min,
    );

    if (hasOverlap) {
      const highestMax = Math.max(...otherGrades.map((g) => g.max));
      toast.error(
        `Range overlaps with an existing grade. Your "From (%)" must start at ${highestMax.toFixed(2)} or above.`,
      );
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

  const isEditing = editingIndex !== null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-brand-primary/10">
            <TrendingUp size={16} className="text-brand-primary" />
          </div>
          <span>Grade Settings</span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* ── Form Card ─────────────────────────────────── */}
        <div
          className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
            isEditing
              ? "border-blue-400/50 dark:border-blue-500/40 bg-blue-50/50 dark:bg-blue-500/5"
              : "border-border/60 bg-slate-50/80 dark:bg-slate-900/40"
          }`}
        >
          {/* Form header strip */}
          <div
            className={`px-5 py-3 border-b flex items-center gap-2 ${
              isEditing
                ? "border-blue-400/30 dark:border-blue-500/20 bg-blue-100/60 dark:bg-blue-500/10"
                : "border-border/40 bg-white/60 dark:bg-slate-800/40"
            }`}
          >
            <div
              className={`p-1 rounded-md ${isEditing ? "bg-blue-500/20" : "bg-brand-primary/10"}`}
            >
              {isEditing ? (
                <Edit2 size={12} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Plus size={12} className="text-brand-primary" />
              )}
            </div>
            <Typography
              variant="body5"
              className={`font-bold uppercase tracking-wider text-[11px] ${
                isEditing
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground"
              }`}
            >
              {isEditing
                ? `Editing Rule #${editingIndex! + 1}`
                : "Add New Grade Rule"}
            </Typography>
          </div>

          {/* Inputs */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* From */}
              <div>
                <Typography
                  variant="body5"
                  className="mb-1.5 ml-0.5 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  From (%)
                </Typography>
                <Input
                  placeholder="e.g. 0.00"
                  value={formMin}
                  inputMode="decimal"
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setFormMin)
                  }
                />
              </div>

              {/* Arrow divider on md+ */}
              <div className="hidden md:flex absolute" />

              {/* To */}
              <div>
                <Typography
                  variant="body5"
                  className="mb-1.5 ml-0.5 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  To (%)
                </Typography>
                <Input
                  placeholder="e.g. 49.99"
                  value={formMax}
                  inputMode="decimal"
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setFormMax)
                  }
                />
              </div>

              {/* Grade */}
              <div>
                <Typography
                  variant="body5"
                  className="mb-1.5 ml-0.5 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
                  Grade Label
                </Typography>
                <SelectDropdown
                  placeholder="Select a grade"
                  value={formLabel}
                  onChange={(value) => setFormLabel(String(value))}
                  options={GRADE_OPTIONS}
                />
              </div>
            </div>

            {/* CTA row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle size={13} className="shrink-0" />
                <span className="text-[11px] font-medium">
                  Fill all fields, then click &quot;
                  {isEditing ? "Update Rule" : "Add Grade Rule"}&quot;
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw size={13} className="mr-1.5" />
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleAddOrUpdateGrade}
                  color="primary"
                  size="md"
                  animate="scale"
                >
                  {isEditing ? (
                    <>
                      <Edit2 size={14} className="mr-1.5" />
                      Update Rule
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="mr-1.5" />
                      Add Grade Rule
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Grade Rules List ───────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Typography
              variant="body5"
              className="font-bold text-foreground uppercase tracking-wider text-[11px]"
            >
              Defined Rules
              {grades.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-black">
                  {grades.length}
                </span>
              )}
            </Typography>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 border border-border/50 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
              <div className="relative">
                <Loader2 className="animate-spin text-brand-primary h-8 w-8" />
                <div className="absolute inset-0 rounded-full bg-brand-primary/10 blur-md" />
              </div>
              <Typography variant="body4" className="text-muted-foreground">
                Loading configurations...
              </Typography>
            </div>
          ) : grades.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-border/50 rounded-2xl bg-slate-50/30 dark:bg-slate-900/20">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <TrendingUp size={22} className="text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <Typography
                  variant="body4"
                  className="text-foreground font-semibold"
                >
                  No rules defined yet
                </Typography>
                <Typography
                  variant="body5"
                  className="text-muted-foreground text-[12px] mt-0.5"
                >
                  Add your first grade range using the form above.
                </Typography>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {grades.map((grade, idx) => {
                const cfg =
                  GRADE_CONFIG[grade.grade_label] ?? GRADE_CONFIG["N/A"];
                const isEditingThis = editingIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                      isEditingThis
                        ? "border-blue-400/60 dark:border-blue-500/40 bg-blue-50/60 dark:bg-blue-500/5 shadow-sm"
                        : "border-border/50 bg-white dark:bg-slate-900/60 hover:border-border hover:shadow-sm dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Sr. No. */}
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-[11px] font-black text-muted-foreground">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Single-row: badge + range pill + bar */}
                    <div className="flex-1 min-w-0 flex items-center gap-2.5">
                      {/* Grade badge — fixed width so bar always aligns */}
                      <div className="shrink-0 w-[112px] flex items-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                        >
                          {grade.grade_label}
                        </span>
                        {isEditingThis && (
                          <span className="ml-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider whitespace-nowrap">
                            • editing
                          </span>
                        )}
                      </div>
                      {/* Range pill — fixed width so bar always aligns */}
                      <div className="shrink-0 w-[148px] flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        <span className="text-[11px] font-bold text-foreground tabular-nums">
                          {grade.min.toFixed(2)}%
                        </span>
                        <span className="text-muted-foreground/50 text-[10px]">
                          →
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span className="text-[11px] font-bold text-foreground tabular-nums">
                          {grade.max.toFixed(2)}%
                        </span>
                      </div>
                      {/* Mini bar — always starts from same left edge */}
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${cfg.barBg}`}
                          style={{
                            marginLeft: `${grade.min}%`,
                            width: `${grade.max - grade.min}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        title="Edit rule"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete rule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {/* Always-visible actions on editing row */}
                    {isEditingThis && (
                      <div className="shrink-0 flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          title="Edit rule"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="Delete rule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Save Note ─────────────────────────────────── */}
        <div className="flex items-start gap-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/70 dark:border-blue-500/25 rounded-xl px-4 py-3">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <Typography
            variant="body5"
            className="text-blue-700 dark:text-blue-400 text-[12px] leading-snug"
          >
            Once all rules are added, click{" "}
            <span className="font-bold">&ldquo;Save Grade&rdquo;</span> to apply
            grades to this paper — unsaved rules will be lost.
          </Typography>
        </div>

        {/* ── Footer ────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          {/* Left: summary */}
          <div className="flex items-center gap-2">
            {grades.length > 0 && (
              <>
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-[12px] text-muted-foreground font-medium">
                  {grades.length} rule{grades.length !== 1 ? "s" : ""} ready
                </span>
              </>
            )}
          </div>
          {/* Right: actions */}
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              color="primary"
              onClick={onClose}
              animate="scale"
              size="md"
            >
              Close
            </Button>
            <Button
              color="primary"
              onClick={handleSaveAll}
              disabled={saving || grades.length === 0}
              animate="scale"
              size="md"
            >
              {saving ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <CheckCircle2 size={15} className="mr-1.5" />
              )}
              Save Grade
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
