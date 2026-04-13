import React from "react";
import {
  Loader2,
  Edit as EditIcon,
  Trash2,
  Settings,
  Eye,
  Wand2,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Button } from "@components/ui-elements/Button";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { TableCell, TableRow } from "@components/ui-elements/Table";
import { PaperSetup } from "@lib/api/papers";
import { GradeSettingsModal } from "./GradeSettingsModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@components/ui-elements/Tooltip";

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
  visibleColumns: string[];
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
  visibleColumns,
}) => {
  const router = useRouter();
  const isVisible = (id: string) => visibleColumns.includes(id);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  return (
    <TableRow className="group/row border-b border-border transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
      {isVisible("sr_no") && (
        <TableCell className="text-center font-bold text-muted-foreground/60">
          {((currentPage - 1) * pageSize + index + 1)
            .toString()
            .padStart(2, "0")}
        </TableCell>
      )}
      {isVisible("paper_name") && (
        <TableCell>
          <div
            className="cursor-pointer"
            onClick={() => onViewDetails(row.id!)}
          >
            <Typography
              variant="body3"
              weight="bold"
              className="text-foreground/80"
            >
              {row.paper_name}
            </Typography>
          </div>
        </TableCell>
      )}
      {isVisible("department") && (
        <TableCell>
          <Badge
            variant="outline"
            color="secondary"
            shape="square"
            className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 border-blue-200/50 text-blue-600"
          >
            {row.department_name ?? "N/A"}
          </Badge>
        </TableCell>
      )}
      {isVisible("test_level") && (
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
      )}
      {isVisible("description") && (
        <TableCell className="max-w-[180px]">
          <Typography
            variant="body5"
            className="text-muted-foreground truncate"
          >
            {row.description || "No description"}
          </Typography>
        </TableCell>
      )}
      {isVisible("timing") && (
        <TableCell className="font-bold text-foreground/70">
          {row.total_time}
        </TableCell>
      )}
      {isVisible("total_marks") && (
        <TableCell className="font-bold text-brand-primary">
          {row.total_marks ?? 0}
        </TableCell>
      )}
      {isVisible("active") && (
        <TableCell className="text-center">
          <div className="flex justify-center">
            {togglingId === row.id ? (
              <Loader2 size={18} className="animate-spin text-brand-primary" />
            ) : (
              <Switch
                checked={row.is_active !== false}
                onChange={() =>
                  onToggleStatus(row.id!, row.is_active !== false)
                }
                size="sm"
              />
            )}
          </div>
        </TableCell>
      )}
      {isVisible("actions") && (
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-3">
            <TableIconButton
              iconColor="slate"
              animate="scale"
              title="View Details & Manual Question Setup"
              onClick={() => onViewDetails(row.id!)}
            >
              <Eye size={16} />
            </TableIconButton>

            <TableIconButton
              iconColor="amber"
              animate="scale"
              title="Auto Question Setup"
              onClick={() => router.push(`/admin/paper/setup/auto/${row.id}`)}
            >
              <Wand2 size={16} />
            </TableIconButton>

            <TableIconButton
              iconColor="brand"
              animate="scale"
              title="Grade Settings"
              onClick={() => setIsGradeModalOpen(true)}
            >
              <Settings size={16} />
            </TableIconButton>

            <TableIconButton
              iconColor="blue"
              animate="scale"
              title="Edit Paper"
              onClick={() => onEdit(row)}
            >
              <EditIcon size={16} />
            </TableIconButton>

            <TableIconButton
              iconColor="red"
              animate="scale"
              title="Delete Paper"
              onClick={() => onDelete(row.id!)}
            >
              <Trash2 size={16} />
            </TableIconButton>
          </div>
        </TableCell>
      )}

      {isGradeModalOpen && row.id && (
        <GradeSettingsModal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          paperId={row.id}
        />
      )}
    </TableRow>
  );
};
