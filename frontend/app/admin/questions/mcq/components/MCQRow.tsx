import React from "react";
import { Loader2, Edit as EditIcon } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Button } from "@components/ui-elements/Button";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Question } from "@lib/api/questions";
import { QuestionDetailView } from "@components/ui-cards/QuestionDetailView";

interface MCQRowProps {
  row: Question;
  index: number;
  currentPage: number;
  pageSize: number;
  visibleColumns: string[];
  togglingId: number | null;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onEdit: (question: Question) => void;
}

export const MCQRow: React.FC<MCQRowProps> = ({
  row,
  index,
  currentPage,
  pageSize,
  visibleColumns,
  togglingId,
  onToggleStatus,
  onEdit,
}) => {
  return (
    <TableCollapsibleRow
      key={row.id}
      colSpan={visibleColumns.length + 1}
      className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300"
      expandedContent={
        <div className="px-5 py-4 bg-slate-50/20 dark:bg-slate-900/30 border-t border-border/40">
          <QuestionDetailView
            question={row}
            title="MCQ Analysis"
            className="bg-white dark:bg-slate-900"
          />
        </div>
      }
    >
      {visibleColumns.includes("srNo") && (
        <TableCell className="font-bold text-center text-slate-400 group-hover/row:text-brand-primary transition-colors">
          {((currentPage - 1) * pageSize + index + 1)
            .toString()
            .padStart(2, "0")}
        </TableCell>
      )}
      {visibleColumns.includes("question") && (
        <TableCell className="max-w-[400px]">
          <Typography
            variant="body4"
            weight="semibold"
            className="truncate group-hover/row:text-brand-primary transition-colors"
          >
            {row.question_text}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("subject") && (
        <TableCell>
          <Badge
            variant="outline"
            color={row.subject?.name ? "success" : "error"}
            shape="square"
            className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 bg-transparent border-border/60"
          >
            {typeof row.subject === "string"
              ? row.subject
              : (row.subject?.name ?? "N/A")}
          </Badge>
        </TableCell>
      )}
      {visibleColumns.includes("examLevel") && (
        <TableCell>
          <Badge
            variant="outline"
            color={row.exam_level?.name ? "primary" : "default"}
            shape="square"
            className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 bg-transparent border-border/60"
          >
            {typeof row.exam_level === "string"
              ? row.exam_level
              : (row.exam_level?.name ?? "N/A")}
          </Badge>
        </TableCell>
      )}
      {visibleColumns.includes("createdBy") && (
        <TableCell className="text-muted-foreground/70 font-medium italic text-[13px]">
          {"System"}
        </TableCell>
      )}
      {visibleColumns.includes("createdDate") && (
        <TableCell className="text-muted-foreground/60 text-[13px] font-medium">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </TableCell>
      )}
      {visibleColumns.includes("status") && (
        <TableCell className="text-center">
          <div
            className="flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {togglingId === row.id ? (
              <Loader2 size={18} className="animate-spin text-brand-primary" />
            ) : (
              <Switch
                checked={row.is_active !== false}
                onChange={() => onToggleStatus(row.id, row.is_active !== false)}
                size="sm"
              />
            )}
          </div>
        </TableCell>
      )}
      {visibleColumns.includes("actions") && (
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              color="primary"
              size="icon"
              animate="scale"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              title="Edit Question"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <EditIcon size={16} />
            </Button>
          </div>
        </TableCell>
      )}
    </TableCollapsibleRow>
  );
};
