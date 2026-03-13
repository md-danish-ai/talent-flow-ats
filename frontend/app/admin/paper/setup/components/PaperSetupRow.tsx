import React from "react";
import {
  Loader2,
  Edit as EditIcon,
  Trash2,
  Settings,
  GraduationCap,
  Eye,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Button } from "@components/ui-elements/Button";
import { TableCell, TableRow } from "@components/ui-elements/Table";
import { PaperSetup } from "@lib/api/papers";

interface PaperSetupRowProps {
  row: Partial<PaperSetup>;
  index: number;
  currentPage: number;
  pageSize: number;
  togglingId: number | null;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onEdit: (paper: Partial<PaperSetup>) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const PaperSetupRow: React.FC<PaperSetupRowProps> = ({
  row,
  index,
  currentPage,
  pageSize,
  togglingId,
  onToggleStatus,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <TableRow className="group/row border-b border-border transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
      <TableCell className="text-center font-bold text-[#b8c1cc]">
        {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, "0")}
      </TableCell>
      <TableCell>
        <div className="cursor-pointer" onClick={() => onViewDetails(row.id!)}>
          <Typography
            variant="body3"
            weight="bold"
            className="text-slate-600 dark:text-slate-300"
          >
            {row.paper_name}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          color="primary"
          shape="square"
          className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 border-orange-200/50 text-brand-primary"
        >
          {row.test_level_name ?? "N/A"}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[180px]">
        <Typography variant="body5" className="text-slate-400 truncate">
          {row.description || "No description"}
        </Typography>
      </TableCell>
      <TableCell className="font-bold text-slate-600 dark:text-slate-400">
        {row.total_time}
      </TableCell>
      <TableCell className="font-bold text-brand-primary">
        {row.total_marks ?? 0}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center">
          {togglingId === row.id ? (
            <Loader2 size={18} className="animate-spin text-brand-primary" />
          ) : (
            <Switch
              checked={row.is_active !== false}
              onChange={() => onToggleStatus(row.id!, row.is_active !== false)}
              size="sm"
            />
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-brand-primary group-hover/row:scale-110 transition-transform"
            onClick={() => onViewDetails(row.id!)}
            title="View Details"
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-brand-primary group-hover/row:scale-110 transition-transform"
            title="Settings"
          >
            <Settings size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-brand-primary group-hover/row:scale-110 transition-transform"
            title="Grading"
          >
            <GraduationCap size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 group-hover/row:scale-110 transition-transform"
            onClick={() => onEdit(row)}
            title="Edit"
          >
            <EditIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 group-hover/row:scale-110 transition-transform"
            onClick={() => onDelete(row.id!)}
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
