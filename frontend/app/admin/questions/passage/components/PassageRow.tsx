import React from "react";
import { Edit as EditIcon } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Question } from "@types";
import { QuestionDetailView } from "@components/ui-cards/QuestionDetailView";
import { formatDate } from "@lib/utils";

interface PassageRowProps {
  row: Question;
  index: number;
  currentPage: number;
  pageSize: number;
  visibleColumns: string[];
  togglingId: number | null;
  onToggleStatus: (id: number) => void;
  onEdit: (question: Question) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const PassageRow: React.FC<PassageRowProps> = ({
  row,
  index,
  currentPage,
  pageSize,
  visibleColumns,
  togglingId,
  onToggleStatus,
  onEdit,
  isExpanded,
  onExpandChange,
}) => {
  return (
    <TableCollapsibleRow
      key={row.id}
      isOpen={isExpanded}
      onOpenChange={onExpandChange}
      colSpan={visibleColumns.length + 1}
      className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300"
      expandedContent={
        <div className="px-5 py-4 bg-slate-50/20 dark:bg-slate-900/30 border-t border-border/40">
          <QuestionDetailView
            question={row}
            title="Passage Analysis"
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
      {visibleColumns.includes("passage") && (
        <TableCell className="w-[300px] max-w-[300px]">
          {row.passage ? (
            <div className="pl-3 border-l-2 border-brand-primary/40 dark:border-brand-primary/60 py-0.5">
              <p
                className="text-[13px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed select-text"
                title={row.passage}
              >
                {row.passage}
              </p>
            </div>
          ) : (
            <span className="text-slate-400 text-xs italic">-</span>
          )}
        </TableCell>
      )}
      {visibleColumns.includes("question") && (
        <TableCell
          className="w-[300px] max-w-[300px]"
          title={row.question_text}
        >
          <Typography
            variant="body4"
            weight="semibold"
            className="text-[13px] line-clamp-2 leading-relaxed text-slate-900 dark:text-slate-100 group-hover/row:text-brand-primary transition-colors select-text"
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
          >
            {typeof row.exam_level === "string"
              ? row.exam_level
              : (row.exam_level?.name ?? "N/A")}
          </Badge>
        </TableCell>
      )}
      {visibleColumns.includes("marks") && (
        <TableCell className="text-left font-bold text-slate-600 dark:text-slate-300">
          <Badge color="primary" variant="outline" shape="square">
            {row.marks || "0"}
          </Badge>
        </TableCell>
      )}
      {visibleColumns.includes("createdDate") && (
        <TableCell className="text-muted-foreground/60 text-[13px] font-medium">
          {row.created_at ? formatDate(row.created_at) : "N/A"}
        </TableCell>
      )}
      {visibleColumns.includes("status") && (
        <TableCell>
          <div className="flex flex-col items-center justify-center gap-1">
            <Switch
              checked={row.is_active !== false}
              onChange={() => onToggleStatus(row.id)}
              size="sm"
              disabled={togglingId === row.id}
            />
            <Badge
              variant="outline"
              shape="square"
              color={row.is_active !== false ? "success" : "error"}
            >
              {row.is_active !== false ? "Activate" : "Deactivate"}
            </Badge>
          </div>
        </TableCell>
      )}
      {visibleColumns.includes("actions") && (
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TableIconButton
              iconColor="blue"
              btnSize="sm"
              animate="scale"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              title="Edit Question"
            >
              <EditIcon size={16} />
            </TableIconButton>
          </div>
        </TableCell>
      )}
    </TableCollapsibleRow>
  );
};
