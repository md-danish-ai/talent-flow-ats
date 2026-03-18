"use client";

import React, { useState, useEffect } from "react";
import { Upload, Loader2, FileUp, Database, Award, Target } from "lucide-react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { toast } from "@lib/toast";
import { cn } from "@lib/utils";

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

  const [formData, setFormData] = useState({
    subject: "",
    examLevel: "",
    marks: "",
    file: null as File | null,
  });

  useEffect(() => {
    if (isOpen) {
      fetchClassifications();
    }
  }, [isOpen]);

  const fetchClassifications = async () => {
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
      setSubjects(subjectsRes.data || []);
      setExamLevels(examLevelsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch classifications:", error);
      toast.error("Failed to load classifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!["xlsx", "xls", "csv"].includes(extension || "")) {
        toast.error("Please upload an Excel or CSV file");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.subject ||
      !formData.examLevel ||
      !formData.marks ||
      !formData.file
    ) {
      toast.error("Please fill all fields and select a file");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would normally call the API
      // For demonstration, we simulate success
      console.log("Uploading for type:", questionType);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Questions uploaded successfully");
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setFormData({
        subject: "",
        examLevel: "",
        marks: "",
        file: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload questions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = subjects.map((s) => ({ id: s.name, label: s.name }));
  const examLevelOptions = examLevels.map((l) => ({ id: l.name, label: l.name }));
  const marksOptions = [1, 2, 3, 4, 5, 10, 20].map((m) => ({
    id: m.toString(),
    label: `${m} Marks`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Upload Questions"
      className="max-w-2xl"
    >
      <div className="space-y-6 py-2">
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
                setFormData((prev) => ({ ...prev, subject: val.toString() }))
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
                setFormData((prev) => ({ ...prev, examLevel: val.toString() }))
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
                setFormData((prev) => ({ ...prev, marks: val.toString() }))
              }
              placeholder="Select Marks"
              className={isLoading ? "opacity-50 pointer-events-none" : ""}
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Upload File
          </label>
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group",
              formData.file
                ? "border-brand-primary/40 bg-brand-primary/5 shadow-sm"
                : "border-border/60 hover:border-brand-primary/30 hover:bg-muted/30",
            )}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".xlsx,.xls,.csv"
              disabled={isSubmitting}
            />

            {formData.file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <FileUp size={28} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground truncate max-w-[300px]">
                    {formData.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="text"
                  size="sm"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData((prev) => ({ ...prev, file: null }));
                  }}
                  className="mt-2 h-8"
                >
                  Change File
                </Button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-300">
                  <Upload size={40} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-lg">
                    Click or Drag to Upload
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports Excel, XLS or CSV files
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
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
              !formData.subject ||
              !formData.examLevel ||
              !formData.marks
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
      </div>
    </Modal>
  );
}
