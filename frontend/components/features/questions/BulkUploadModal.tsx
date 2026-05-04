"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Loader2,
  FileUp,
  Database,
  Award,
  Target,
  Download,
} from "lucide-react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { classificationsApi } from "@lib/api/classifications";
import { questionsApi } from "@lib/api/questions";
import { type Classification } from "@types";
import { toast } from "@lib/toast";
import { cn } from "@lib/utils";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";
import { QUESTION_TYPES } from "@lib/constants/questions";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  questionType?: string;
}

export function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
  questionType,
}: BulkUploadModalProps) {
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [examLevels, setExamLevels] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<
    { row: number; errors: string[] }[]
  >([]);

  const [formData, setFormData] = useState({
    subject: "",
    examLevel: "",
    marks: "",
    file: null as File | null,
    zipFile: null as File | null,
  });

  const fetchClassifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subjectsRes, examLevelsRes] = await Promise.all([
        classificationsApi.getClassifications({
          type: "subject",
          is_active: true,
          limit: 100,
        }),
        classificationsApi.getClassifications({
          type: "exam_level",
          is_active: true,
          limit: 100,
        }),
      ]);
      const filteredSubjects = filterSubjectsForQuestionType(
        subjectsRes.data || [],
        questionType,
      );
      setSubjects(filteredSubjects);
      setExamLevels(examLevelsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch classifications:", error);
      toast.error("Failed to load classifications");
    } finally {
      setIsLoading(false);
    }
  }, [questionType]);

  useEffect(() => {
    if (isOpen) {
      fetchClassifications();
    } else {
      setFormData({
        subject: "",
        examLevel: "",
        marks: "",
        file: null,
        zipFile: null,
      });
      setUploadErrors([]);
    }
  }, [isOpen, fetchClassifications]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "excel" | "zip" = "excel",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";

      if (type === "zip") {
        if (extension !== "zip") {
          toast.error("Please upload a .zip file containing images only.");
          return;
        }
        setFormData((prev) => ({ ...prev, zipFile: file }));
      } else {
        if (!["xlsx", "xls", "csv"].includes(extension)) {
          toast.error(
            "Please upload an Excel or CSV file (.xlsx, .xls, .csv).",
          );
          return;
        }
        setFormData((prev) => ({ ...prev, file: file }));
      }
      setUploadErrors([]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.file) {
      toast.error("Please select a file first");
      return;
    }

    if (questionType?.startsWith("IMAGE_") && !formData.zipFile) {
      toast.error("Please upload the images ZIP file");
      return;
    }

    setIsSubmitting(true);
    setUploadErrors([]);

    try {
      const response = await questionsApi.bulkUploadQuestions(
        formData.file,
        formData.zipFile,
        {
          subject: formData.subject || undefined,
          exam_level: formData.examLevel || undefined,
          marks: formData.marks ? parseInt(formData.marks) : undefined,
          question_type: questionType || QUESTION_TYPES.MULTIPLE_CHOICE,
        },
      );

      if (response.success) {
        toast.success(`Successfully uploaded ${response.count} questions`);
        if (onSuccess) onSuccess();
        onClose();
      } else if (response.errors) {
        setUploadErrors(response.errors);
        toast.error("Validation failed. Please check the errors below.");
      }
    } catch (error: unknown) {
      console.error("Upload failed:", error);

      // Typed error handling for the API client
      const err = error as {
        data?: {
          data?: { errors?: { row: number; errors: string[] }[] };
          errors?: { row: number; errors: string[] }[];
          message?: string;
        };
        message?: string;
      };

      const apiErrors = err.data?.data?.errors || err.data?.errors;
      const errorMessage =
        err.data?.message ||
        err.message ||
        "An unexpected error occurred during upload";

      if (apiErrors && Array.isArray(apiErrors)) {
        setUploadErrors(apiErrors);
        toast.error("Validation failed. Please fix the errors in the file.");
      } else {
        toast.error(String(errorMessage));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = subjects.map((s) => ({
    id: s.code || s.name,
    label: s.name,
  }));
  const examLevelOptions = examLevels.map((l) => ({
    id: l.name,
    label: l.name,
  }));
  const marksOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => ({
    id: m.toString(),
    label: `${m} Marks`,
  }));

  const isImageBased = questionType?.startsWith("IMAGE_");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Upload Questions"
      className="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            color="primary"
            shadow
            animate="scale"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            color="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.file ||
              (isImageBased && !formData.zipFile)
            }
            className="min-w-[140px]"
            shadow
            animate="scale"
            startIcon={
              isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )
            }
          >
            {isSubmitting ? "Uploading..." : "Upload Now"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Database size={14} className="text-brand-primary" />
              Subject
            </label>
            <SelectDropdown
              options={subjectOptions}
              value={formData.subject}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  subject: val?.toString() || "",
                }))
              }
              placeholder="Select Subject"
              className={isLoading ? "opacity-50 pointer-events-none" : ""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Award size={14} className="text-brand-primary" />
              Exam Level
            </label>
            <SelectDropdown
              options={examLevelOptions}
              value={formData.examLevel}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  examLevel: val?.toString() || "",
                }))
              }
              placeholder="Select Level"
              className={isLoading ? "opacity-50 pointer-events-none" : ""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target size={14} className="text-brand-primary" />
              Marks
            </label>
            <SelectDropdown
              options={marksOptions}
              value={formData.marks}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  marks: val?.toString() || "",
                }))
              }
              placeholder="Select Marks"
              className={isLoading ? "opacity-50 pointer-events-none" : ""}
            />
          </div>
        </div>

        {/* Template Downloads */}
        <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4">
          <h4 className="text-sm font-bold text-brand-primary flex items-center gap-2 mb-3">
            <Download size={16} />
            Download Sample Template
          </h4>
          <div className="flex flex-wrap gap-3">
            {questionType === QUESTION_TYPES.MULTIPLE_CHOICE && (
              <a
                href="/templates/sample_mcq_upload.xlsx"
                download
                className="flex items-center gap-2 text-xs font-bold bg-white border-2 border-green-500/20 p-2.5 rounded-lg hover:border-green-500/50 hover:shadow-md transition-all text-slate-800"
              >
                <div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center font-black">
                  X
                </div>
                Normal MCQ Template
              </a>
            )}

            {questionType === QUESTION_TYPES.SUBJECTIVE && (
              <a
                href="/templates/sample_subjective_upload.xlsx"
                download
                className="flex items-center gap-2 text-xs font-bold bg-white border-2 border-blue-500/20 p-2.5 rounded-lg hover:border-blue-500/50 hover:shadow-md transition-all text-slate-800"
              >
                <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center font-black">
                  X
                </div>
                Subjective Template
              </a>
            )}

            {questionType === QUESTION_TYPES.IMAGE_MULTIPLE_CHOICE && (
              <a
                href="/templates/sample_image_mcq_upload.xlsx"
                download
                className="flex items-center gap-2 text-xs font-bold bg-white border-2 border-purple-500/20 p-2.5 rounded-lg hover:border-purple-500/50 hover:shadow-md transition-all text-slate-800"
              >
                <div className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center font-black">
                  X
                </div>
                Image MCQ Template
              </a>
            )}

            {questionType === QUESTION_TYPES.IMAGE_SUBJECTIVE && (
              <a
                href="/templates/sample_image_subjective_upload.xlsx"
                download
                className="flex items-center gap-2 text-xs font-bold bg-white border-2 border-orange-500/20 p-2.5 rounded-lg hover:border-orange-500/50 hover:shadow-md transition-all text-slate-800"
              >
                <div className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center font-black">
                  X
                </div>
                Image Subjective Template
              </a>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div
          className={cn(
            "grid gap-6",
            isImageBased ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {/* Excel Upload Box */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Database size={14} className="text-brand-primary" />
              Step 1: Upload Data (Excel/CSV)
            </label>
            <div
              className={cn(
                "relative group h-48 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden bg-muted/20",
                formData.file
                  ? "border-brand-primary/50 bg-brand-primary/5 shadow-inner"
                  : "border-muted-foreground/20 hover:border-brand-primary/40 hover:bg-brand-primary/[0.02]",
              )}
            >
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "excel")}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                accept=".xlsx,.xls,.csv"
                disabled={isSubmitting}
              />
              {formData.file ? (
                <div className="flex flex-col items-center gap-3 text-center p-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm ring-1 ring-brand-primary/20">
                    <FileUp size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground truncate max-w-[180px]">
                      {formData.file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {(formData.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-300">
                    <Upload size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      Upload Excel/CSV
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Contains question text & details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ZIP Upload Box */}
          {isImageBased && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileUp size={14} className="text-purple-500" />
                Step 2: Upload Images (ZIP)
              </label>
              <div
                className={cn(
                  "relative group h-48 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden bg-muted/20",
                  formData.zipFile
                    ? "border-purple-500/50 bg-purple-500/5 shadow-inner"
                    : "border-muted-foreground/20 hover:border-purple-500/40 hover:bg-purple-500/[0.02]",
                )}
              >
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "zip")}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept=".zip"
                  disabled={isSubmitting}
                />
                {formData.zipFile ? (
                  <div className="flex flex-col items-center gap-3 text-center p-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm ring-1 ring-purple-500/20">
                      <FileUp size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground truncate max-w-[180px]">
                        {formData.zipFile.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {(formData.zipFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center p-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-purple-500/10 group-hover:text-purple-500 transition-all duration-300">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        Upload Images ZIP
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Contains all question/option images
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Display Section */}
        {uploadErrors.length > 0 && (
          <div className="p-5 rounded-2xl bg-error/5 border border-error/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-sm font-bold text-error flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
              Found {uploadErrors.length} validation errors:
            </h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {uploadErrors.map((err, idx) => (
                <div
                  key={idx}
                  className="text-xs space-y-1.5 bg-white/[0.03] border-l-2 border-error/40 p-3 rounded-r-xl transition-all hover:bg-white/[0.05]"
                >
                  <p className="font-bold text-error/90 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-error/10 text-[10px]">
                      ROW {err.row}
                    </span>
                  </p>
                  <ul className="space-y-1 pl-1 text-muted-foreground/80">
                    {err.errors.map((msg, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2">
                        <span className="mt-1 w-1 h-1 rounded-full bg-error/30 shrink-0" />
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
