import {
  Loader2,
  Pencil,
  ClipboardList,
  Wand2,
  SlidersHorizontal,
  Calendar,
  Target,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { TableCell, TableRow } from "@components/ui-elements/Table";
import { PaperSetup } from "@types";
import { GradeSettingsModal } from "./GradeSettingsModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@lib/utils";

interface PaperSetupRowProps {
  row: Partial<PaperSetup>;
  index: number;
  currentPage: number;
  pageSize: number;
  togglingId: number | null;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onEdit: (paper: Partial<PaperSetup>) => void;
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
  onViewDetails,
  visibleColumns,
}) => {
  const router = useRouter();
  const isVisible = (id: string) => visibleColumns.includes(id);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  return (
    <TableRow className="group/row">
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
            className="px-3 py-1.5 font-bold tracking-tight"
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
            className="px-3 py-1.5 font-bold tracking-tight"
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
        <TableCell>
          <Badge
            variant="outline"
            color="violet"
            shape="square"
            icon={<Target size={13} className="shrink-0" />}
            className="font-bold text-[12px] px-3 py-1.5 tracking-tight whitespace-nowrap"
          >
            {row.total_marks ?? 0} Marks
          </Badge>
        </TableCell>
      )}
      {isVisible("created_at") && (
        <TableCell className="text-muted-foreground text-[13px] font-medium whitespace-nowrap">
          {row.created_at ? (
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-muted-foreground shrink-0" />
              <span>{formatDate(row.created_at)}</span>
            </div>
          ) : (
            "N/A"
          )}
        </TableCell>
      )}
      {isVisible("active") && (
        <TableCell>
          <div className="flex flex-col items-center justify-center gap-1">
            {togglingId === row.id ? (
              <Loader2
                size={18}
                className="animate-spin text-brand-primary my-2"
              />
            ) : (
              <>
                <Switch
                  checked={row.is_active !== false}
                  onChange={() =>
                    onToggleStatus(row.id!, row.is_active !== false)
                  }
                  size="sm"
                />
                <Badge
                  variant="outline"
                  shape="square"
                  color={row.is_active !== false ? "success" : "error"}
                >
                  {row.is_active !== false ? "Enabled" : "Disabled"}
                </Badge>
              </>
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
              title="Question Setup & Paper Details"
              onClick={() => onViewDetails(row.id!)}
            >
              <ClipboardList size={16} />
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
              title="Grade & Cutoff Settings"
              onClick={() => setIsGradeModalOpen(true)}
            >
              <SlidersHorizontal size={16} />
            </TableIconButton>

            <TableIconButton
              iconColor="blue"
              animate="scale"
              title="Edit Paper"
              onClick={() => onEdit(row)}
            >
              <Pencil size={16} />
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
