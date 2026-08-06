"use client";

import React, { useState, useEffect } from "react";
import { Download, Loader2, FileSpreadsheet, HelpCircle } from "lucide-react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi } from "@lib/api/classifications";
import { toast } from "@lib/toast";
import { Classification, Question } from "@types";
import { QUESTION_TYPES } from "@lib/constants/questions";
import ExcelJS from "exceljs";

interface ExportQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuestionType?: string;
}

function cleanValue(val: unknown): string {
  if (val === null || val === undefined || val === "nan" || val === "NaN") {
    return "";
  }
  return String(val).trim();
}

export function transformQuestionsToExcelRows(
  questions: Question[],
  typeCode: string,
): Record<string, unknown>[] {
  return questions.map((q) => {
    const questionId = q.id;
    const subjectCode =
      typeof q.subject === "object" && q.subject !== null
        ? q.subject.code
        : (q as unknown as { subject_type?: string }).subject_type || "";
    const examLevelCode =
      typeof q.exam_level === "object" && q.exam_level !== null
        ? q.exam_level.code
        : "";
    const marks = q.marks ?? 5;

    const optArray = Array.isArray(q.options) ? q.options : [];
    const optObj =
      typeof q.options === "object" &&
      !Array.isArray(q.options) &&
      q.options !== null
        ? (q.options as Record<string, unknown>)
        : {};

    const explanation = cleanValue(q.answer?.explanation);
    const answerText = cleanValue(q.answer?.answer_text);

    // Determine 1-based index for correct option if MCQ/Passage
    let correctOptionIdx = "";
    if (Array.isArray(q.options)) {
      const idx = q.options.findIndex(
        (o: { is_correct?: boolean }) => o?.is_correct,
      );
      if (idx !== -1) {
        correctOptionIdx = String(idx + 1);
      } else if (answerText) {
        const matchIdx = q.options.findIndex(
          (o: { option_label?: string }) =>
            cleanValue(o?.option_label).toUpperCase() ===
            answerText.toUpperCase(),
        );
        if (matchIdx !== -1) {
          correctOptionIdx = String(matchIdx + 1);
        }
      }
    }

    switch (typeCode) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Question Text": cleanValue(q.question_text),
          "Option 1": cleanValue(optArray[0]?.option_text),
          "Option 2": cleanValue(optArray[1]?.option_text),
          "Option 3": cleanValue(optArray[2]?.option_text),
          "Option 4": cleanValue(optArray[3]?.option_text),
          "Correct Option": correctOptionIdx,
          Explanation: explanation,
        };

      case QUESTION_TYPES.IMAGE_MULTIPLE_CHOICE:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Question Text": cleanValue(q.question_text),
          "Question Image": cleanValue(q.image_url),
          "Option 1": cleanValue(optArray[0]?.option_text),
          "Option 1 Image": cleanValue(optArray[0]?.image_url),
          "Option 2": cleanValue(optArray[1]?.option_text),
          "Option 2 Image": cleanValue(optArray[1]?.image_url),
          "Option 3": cleanValue(optArray[3]?.option_text),
          "Option 3 Image": cleanValue(optArray[2]?.image_url),
          "Option 4": cleanValue(optArray[3]?.option_text),
          "Option 4 Image": cleanValue(optArray[3]?.image_url),
          "Correct Option": correctOptionIdx,
          Explanation: explanation,
        };

      case QUESTION_TYPES.SUBJECTIVE:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Question Text": cleanValue(q.question_text),
          "Model Answer": answerText,
          "Answer Explanation": explanation,
        };

      case QUESTION_TYPES.IMAGE_SUBJECTIVE:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Question Text": cleanValue(q.question_text),
          "Question Image": cleanValue(q.image_url),
          "Model Answer": answerText,
          "Answer Explanation": explanation,
        };

      case QUESTION_TYPES.PASSAGE_CONTENT:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Passage Paragraph": cleanValue(q.passage),
          "Question Text": cleanValue(q.question_text),
          "Option 1": cleanValue(optArray[0]?.option_text),
          "Option 2": cleanValue(optArray[1]?.option_text),
          "Option 3": cleanValue(optArray[2]?.option_text),
          "Option 4": cleanValue(optArray[3]?.option_text),
          "Correct Option": correctOptionIdx,
          "Answer Explanation": explanation,
        };

      case QUESTION_TYPES.TYPING_TEST:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          Title: cleanValue(q.question_text),
          Paragraph: cleanValue(q.passage),
        };

      case QUESTION_TYPES.LEAD_GENERATION:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Company Name": cleanValue(optObj.company_name || q.question_text),
          Website: cleanValue(optObj.website),
          "Contact Person": cleanValue(
            optObj.contact_name || optObj.contact_person,
          ),
          Designation: cleanValue(optObj.designation),
          Email: cleanValue(optObj.email),
        };

      case QUESTION_TYPES.CONTACT_DETAILS:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Website URL": cleanValue(optObj.websiteUrl),
          Organization: cleanValue(optObj.companyName),
          "Street Address": cleanValue(optObj.streetAddress),
          City: cleanValue(optObj.city),
          State: cleanValue(optObj.state),
          "Zip Code": cleanValue(optObj.zipCode),
          Phone: cleanValue(optObj.companyPhoneNumber || optObj.phone),
          Email: cleanValue(optObj.generalEmail || optObj.email),
          "Facebook Page": cleanValue(optObj.facebookPage),
        };

      default:
        return {
          "Question Id": questionId,
          "Subject Code": subjectCode,
          "Exam Level Code": examLevelCode,
          Marks: marks,
          "Question Text": cleanValue(q.question_text),
          Explanation: explanation,
        };
    }
  });
}

export function ExportQuestionsModal({
  isOpen,
  onClose,
  defaultQuestionType = QUESTION_TYPES.MULTIPLE_CHOICE,
}: ExportQuestionsModalProps) {
  const [questionTypes, setQuestionTypes] = useState<Classification[]>([]);
  const [selectedType, setSelectedType] = useState<string>(defaultQuestionType);
  const [isLoadingTypes, setIsLoadingTypes] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedType(defaultQuestionType);
      const fetchQuestionTypes = async () => {
        setIsLoadingTypes(true);
        try {
          const res = await classificationsApi.getClassifications({
            type: "question_type",
            is_active: true,
            limit: 100,
          });
          const data = res.data || [];
          setQuestionTypes(data);

          if (
            data.length > 0 &&
            !data.some((item) => item.code === defaultQuestionType)
          ) {
            setSelectedType(data[0].code);
          }
        } catch (err) {
          console.error("Failed to load question types:", err);
          toast.error("Failed to load question types from database");
        } finally {
          setIsLoadingTypes(false);
        }
      };
      void fetchQuestionTypes();
    }
  }, [isOpen, defaultQuestionType]);

  const handleExport = async () => {
    if (!selectedType) {
      toast.error("Please select a question type");
      return;
    }

    setIsExporting(true);
    try {
      const allQuestions: Question[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await questionsApi.getQuestions({
          question_type: selectedType,
          page: currentPage,
          limit: 100,
        });

        const pageData = response.data || [];
        allQuestions.push(...pageData);

        const pagination = (
          response as unknown as { pagination?: { total_pages?: number } }
        ).pagination;
        totalPages = pagination?.total_pages || 1;
        currentPage++;
      } while (currentPage <= totalPages);

      if (allQuestions.length === 0) {
        toast.error("No questions found for the selected question type");
        setIsExporting(false);
        return;
      }

      // Sort questions by Question ID in ascending order (1, 2, 3...)
      allQuestions.sort((a, b) => a.id - b.id);

      const rows = transformQuestionsToExcelRows(allQuestions, selectedType);
      if (rows.length === 0) {
        toast.error("No questions found to export");
        setIsExporting(false);
        return;
      }

      const headers = Object.keys(rows[0]);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Questions");

      // Add Header Row
      const headerRow = worksheet.addRow(headers);
      headerRow.height = 24;

      // Style Header Row (Orange Background #F96331, Bold White Text, Centered)
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF96331" },
        };
        cell.font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD3D3D3" } },
          left: { style: "thin", color: { argb: "FFD3D3D3" } },
          bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
          right: { style: "thin", color: { argb: "FFD3D3D3" } },
        };
      });

      // Centered Columns List
      const centerAlignedHeaders = new Set([
        "Question Id",
        "Subject Code",
        "Exam Level Code",
        "Marks",
        "Correct Option",
        "Zip Code",
        "Phone",
      ]);

      // Add Data Rows & Apply Styling
      rows.forEach((rowObj) => {
        const rowValues = headers.map((h) => rowObj[h] ?? "");
        const dataRow = worksheet.addRow(rowValues);
        dataRow.height = 20;

        dataRow.eachCell((cell, colNumber) => {
          const headerName = headers[colNumber - 1];
          const isCenter = centerAlignedHeaders.has(headerName);

          cell.font = {
            name: "Calibri",
            size: 11,
            color: { argb: "FF333333" },
          };
          cell.alignment = {
            horizontal: isCenter ? "center" : "left",
            vertical: "middle",
            wrapText: false,
          };
          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };
        });
      });

      // Calculate Auto Column Widths
      worksheet.columns.forEach((column, index) => {
        const headerText = headers[index] || "";
        let maxLen = headerText.length;

        rows.forEach((row) => {
          const valStr = String(row[headerText] ?? "");
          if (valStr.length > maxLen) {
            maxLen = valStr.length;
          }
        });

        // Set width capped reasonably for clean display
        column.width = Math.min(Math.max(maxLen + 2, 12), 45);
      });

      // Trigger Browser File Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const selectedTypeName =
        questionTypes.find((t) => t.code === selectedType)?.name ||
        selectedType;

      const fileName = `${selectedType.toLowerCase()}_questions_export.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `Successfully exported ${allQuestions.length} questions for ${selectedTypeName}`,
      );
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export questions");
    } finally {
      setIsExporting(false);
    }
  };

  const dropdownOptions = questionTypes.map((t) => ({
    id: t.code,
    label: t.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Questions Data"
      className="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            color="primary"
            shadow
            animate="scale"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            color="primary"
            onClick={handleExport}
            disabled={isExporting || !selectedType || isLoadingTypes}
            className="min-w-[140px]"
            shadow
            animate="scale"
            startIcon={
              isExporting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )
            }
          >
            {isExporting ? "Exporting..." : "Download Excel"}
          </Button>
        </div>
      }
    >
      <div className="space-y-3.5">
        <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <FileSpreadsheet size={16} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground">
              Download Questions with Template Styling & Q-ID
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Select a Question Type from the database to pull all questions and
              answers into an Excel file styled with official template header
              colors (<b>#F96331</b> background, white bold text) and{" "}
              <b>Question Id</b> as the 1st column.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle size={14} className="text-brand-primary" />
            Select Question Type
          </label>
          <SelectDropdown
            options={dropdownOptions}
            value={selectedType}
            onChange={(val) => setSelectedType(String(val))}
            placeholder="Select Question Type..."
            isLoading={isLoadingTypes}
            disabled={isExporting || isLoadingTypes}
            isClearable={false}
          />
        </div>
      </div>
    </Modal>
  );
}
