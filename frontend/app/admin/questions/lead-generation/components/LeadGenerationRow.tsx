import React from "react";
import { Edit as EditIcon } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Button } from "@components/ui-elements/Button";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Question } from "@lib/api/questions";

interface LeadGenerationRowProps {
  row: Question;
  index: number;
  currentPage: number;
  pageSize: number;
  visibleColumns: string[];
  togglingId: number | null;
  onToggleStatus: (id: number) => void;
  onEdit: (question: Question) => void;
}

export const LeadGenerationRow: React.FC<LeadGenerationRowProps> = ({
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
        <div className="px-5 py-4 bg-slate-50/20 dark:bg-slate-900/30 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <Typography variant="body3" weight="bold" className="mb-1 text-slate-700 dark:text-slate-300">
               Company Name:
             </Typography>
             <Typography variant="body4" className="text-muted-foreground">
               {String((row.options as Record<string, unknown>)?.companyName || "N/A")}
             </Typography>
           </div>
           <div>
             <Typography variant="body3" weight="bold" className="mb-1 text-slate-700 dark:text-slate-300">
               Website:
             </Typography>
             <Typography variant="body4" className="text-muted-foreground">
               {String((row.options as Record<string, unknown>)?.website || "N/A")}
             </Typography>
           </div>
           <div>
             <Typography variant="body3" weight="bold" className="mb-1 text-slate-700 dark:text-slate-300">
               Name:
             </Typography>
             <Typography variant="body4" className="text-muted-foreground">
               {String((row.options as Record<string, unknown>)?.name || "N/A")} ({String((row.options as Record<string, unknown>)?.title || "N/A")})
             </Typography>
           </div>
           <div>
             <Typography variant="body3" weight="bold" className="mb-1 text-slate-700 dark:text-slate-300">
               Email:
             </Typography>
             <Typography variant="body4" className="text-muted-foreground">
               {String((row.options as Record<string, unknown>)?.email || "N/A")}
             </Typography>
           </div>
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
        <TableCell className="text-center font-bold text-slate-600 dark:text-slate-300">
          <Badge
            color="primary"
            variant="outline"
            shape="square"
            className="flex items-center justify-center w-8 h-8 mx-auto"
          >
            {row.marks || "0"}
          </Badge>
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
            <Button
              variant="ghost"
              color="primary"
              size="icon"
              animate="scale"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              title="Edit Lead Generation"
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
