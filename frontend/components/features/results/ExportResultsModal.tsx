"use client";

import React, { useState } from "react";
import { Download, Loader2, FileSpreadsheet, Calendar } from "lucide-react";
import ExcelJS from "exceljs";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { Typography } from "@components/ui-elements/Typography";
import { reportsApi } from "@lib/api/reports";
import { toast } from "@lib/toast";
import { getTodayISODate } from "@lib/utils";
import { type ExportReportItem } from "@types";

interface ExportResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportResultsModal({
  isOpen,
  onClose,
}: ExportResultsModalProps) {
  const [startDate, setStartDate] = useState<string>(getTodayISODate());
  const [endDate, setEndDate] = useState<string>(getTodayISODate());
  const [dateLabel, setDateLabel] = useState<string>("Today");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const response = await reportsApi.exportAllReports({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      const records = Array.isArray(response)
        ? response
        : (response as { data?: ExportReportItem[] })?.data || [];

      if (!records || records.length === 0) {
        toast.info("No exam records found for the selected date range.");
        setIsExporting(false);
        return;
      }

      // Create Excel Workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "TalentFlow ATS";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Exam Results", {
        views: [{ showGridLines: true }],
      });

      // Define columns exactly as shown in reference layout
      worksheet.columns = [
        { header: "Sr. No.", key: "sr_no", width: 10 },
        { header: "Name", key: "name", width: 26 },
        { header: "Mobile", key: "mobile", width: 16 },
        { header: "Comprehension", key: "comprehension", width: 18 },
        { header: "Written", key: "written", width: 16 },
        { header: "Grammar", key: "grammar", width: 16 },
        { header: "Aptitude", key: "aptitude", width: 16 },
        { header: "Industry Awareness", key: "industry_awareness", width: 22 },
        { header: "Internet Marks", key: "internet_marks", width: 16 },
        { header: "Typing Words/Min.", key: "typing_wpm", width: 20 },
        { header: "Typing Accuracy", key: "typing_accuracy", width: 18 },
      ];

      // Format Header Row (Orange Background #F96331, Bold White Text, Centered)
      const headerRow = worksheet.getRow(1);
      headerRow.height = 24;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF96331" }, // Orange #F96331 (same as Question Export)
        };
        cell.font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: false,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD3D3D3" } },
          bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
          left: { style: "thin", color: { argb: "FFD3D3D3" } },
          right: { style: "thin", color: { argb: "FFD3D3D3" } },
        };
      });

      const GRADE_EXCEL_COLORS: Record<string, string> = {
        excellent: "FF10B981", // Emerald Green
        good: "FF3B82F6", // Blue
        "above average": "FF8B5CF6", // Violet
        average: "FFF59E0B", // Amber
        "below average": "FFF97316", // Orange
        poor: "FFEF4444", // Red
      };

      const getGradeArgbColor = (grade?: string): string => {
        if (!grade) return "FF333333";
        const norm = grade.trim().toLowerCase();
        return GRADE_EXCEL_COLORS[norm] || "FF333333";
      };

      // Add Data Rows
      records.forEach((item, index) => {
        const row = worksheet.addRow({
          sr_no: index + 1,
          name: item.name || "-",
          mobile: item.mobile || "-",
          comprehension: item.comprehension || "-",
          written: item.written || "-",
          grammar: item.grammar || "-",
          aptitude: item.aptitude || "-",
          industry_awareness: item.industry_awareness || "-",
          internet_marks: item.internet_marks || "0.00",
          typing_wpm: item.typing_wpm || "0.00",
          typing_accuracy: item.typing_accuracy || "0.00",
        });

        row.height = 20;

        row.eachCell((cell, colNumber) => {
          const isGradeColumn = colNumber >= 4 && colNumber <= 8;
          const cellValue = String(cell.value || "");
          const isGrade =
            isGradeColumn && cellValue !== "-" && cellValue !== "N/A";

          cell.font = {
            name: "Calibri",
            size: 11,
            bold: isGrade,
            color: {
              argb: isGrade ? getGradeArgbColor(cellValue) : "FF333333",
            },
          };
          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };

          // Alignment logic per column
          if (colNumber === 1) {
            // Sr. No.
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else if (colNumber === 2) {
            // Name
            cell.alignment = { vertical: "middle", horizontal: "left" };
          } else if (colNumber === 3) {
            // Mobile
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else if (colNumber >= 4 && colNumber <= 8) {
            // Grades
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            // Numbers (Internet Marks, Typing)
            cell.alignment = { vertical: "middle", horizontal: "right" };
          }
        });
      });

      // Write buffer and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName =
        startDate === endDate
          ? `Exam_Results_${startDate || "All"}.xlsx`
          : `Exam_Results_${startDate}_to_${endDate}.xlsx`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(
        `Successfully exported ${records.length} candidate results.`,
      );
      onClose();
    } catch (error: unknown) {
      console.error("Export error:", error);
      const errMsg =
        error instanceof Error
          ? error.message
          : "Failed to export exam results. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Exam Results"
      className="max-w-lg"
    >
      <div className="space-y-6 py-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            Date Range
          </label>
          <DateRangePicker
            initialLabel={dateLabel}
            onRangeChange={(range, label) => {
              setDateLabel(label);
              if (range) {
                setStartDate(range.from);
                setEndDate(range.to);
              } else {
                setStartDate("");
                setEndDate("");
              }
            }}
            className="w-full"
          />
        </div>

        <div className="p-3.5 bg-muted/40 border border-border/60 rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary mt-0.5 shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <Typography
              variant="body5"
              weight="bold"
              className="text-foreground"
            >
              Included Columns in Export:
            </Typography>
            <Typography
              variant="body5"
              className="text-muted-foreground leading-relaxed"
            >
              Sr. No., Name, Mobile, Comprehension, Written, Grammar, Aptitude,
              Industry Awareness, Internet Marks, Typing Words/Min., Typing
              Accuracy.
            </Typography>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export to Excel</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
