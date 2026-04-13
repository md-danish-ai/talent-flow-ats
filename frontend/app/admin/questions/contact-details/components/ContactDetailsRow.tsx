import React from "react";
import { Edit as EditIcon } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Button } from "@components/ui-elements/Button";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Question } from "@lib/api/questions";

import { QuestionCollapsibleDetail } from "@components/features/questions/QuestionCollapsibleDetail";

interface ContactDetailsRowProps {
  row: Question;
  index: number;
  currentPage: number;
  pageSize: number;
  visibleColumns: string[];
  togglingId: number | null;
  onToggleStatus: (id: number) => void;
  onEdit: (question: Question) => void;
}

export const ContactDetailsRow: React.FC<ContactDetailsRowProps> = ({
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
      expandedContent={<QuestionCollapsibleDetail question={row} />}
    >
      {visibleColumns.includes("srNo") && (
        <TableCell className="font-bold text-center text-slate-400 group-hover/row:text-brand-primary transition-colors">
          {((currentPage - 1) * pageSize + index + 1)
            .toString()
            .padStart(2, "0")}
        </TableCell>
      )}
      {visibleColumns.includes("websiteUrl") && (
        <TableCell>
          <Typography
            variant="body4"
            weight="semibold"
            className="truncate group-hover/row:text-brand-primary transition-colors"
          >
            {((row.options as Record<string, unknown>)
              ?.websiteUrl as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("companyName") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.companyName as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("streetAddress") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.streetAddress as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("city") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.city as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("state") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.state as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("zipCode") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.zipCode as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("companyPhoneNumber") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.companyPhoneNumber as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("generalEmail") && (
        <TableCell>
          <Typography variant="body4" className="text-muted-foreground">
            {((row.options as Record<string, unknown>)
              ?.generalEmail as React.ReactNode) || "N/A"}
          </Typography>
        </TableCell>
      )}
      {visibleColumns.includes("facebookPage") && (
        <TableCell>
          <Typography
            variant="body4"
            className="text-muted-foreground truncate max-w-[200px]"
          >
            {((row.options as Record<string, unknown>)
              ?.facebookPage as React.ReactNode) || "N/A"}
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
            <TableIconButton
              iconColor="blue"
              btnSize="sm"
              animate="scale"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              title="Edit Company Contact Details"
            >
              <EditIcon size={16} />
            </TableIconButton>
          </div>
        </TableCell>
      )}
    </TableCollapsibleRow>
  );
};
