"use client";

import React, { useState, useEffect } from "react";
import { Upload, Loader2, FileUp, Database } from "lucide-react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { BulkUploadGuideCard } from "@components/ui-cards/BulkUploadGuideCard";
import { BulkUploadErrorCard } from "@components/ui-cards/BulkUploadErrorCard";
import { questionsApi } from "@lib/api/questions";
import { toast } from "@lib/toast";
import { cn } from "@lib/utils";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<
    { row: number; errors: string[] }[]
  >([]);

  const [formData, setFormData] = useState({
    file: null as File | null,
    zipFile: null as File | null,
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        file: null,
        zipFile: null,
      });
      setUploadErrors([]);
    }
  }, [isOpen]);

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
        {/* Preparation Section OR Error Display Section */}
        {uploadErrors.length > 0 ? (
          <BulkUploadErrorCard errors={uploadErrors} />
        ) : (
          <BulkUploadGuideCard
            questionType={questionType}
            isImageBased={isImageBased}
          />
        )}

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
                    <p className="font-bold text-foreground text-sm break-all px-2">
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
                      <p className="font-bold text-foreground text-sm break-all px-2">
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
      </div>
    </Modal>
  );
}
