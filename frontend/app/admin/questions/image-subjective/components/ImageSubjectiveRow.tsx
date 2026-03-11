import React from "react";
import { Loader2, Edit as EditIcon, Image as ImageIcon } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Button } from "@components/ui-elements/Button";
import { TableCell, TableCollapsibleRow } from "@components/ui-elements/Table";
import { Question } from "@lib/api/questions";
import { QuestionDetailView } from "@components/ui-cards/QuestionDetailView";
import Image from "next/image";

interface ImageSubjectiveRowProps {
  row: Question;
  index: number;
  currentPage: number;
  pageSize: number;
  visibleColumns: string[];
  togglingId: number | null;
  onToggleStatus: (id: number) => void;
  onEdit: (question: Question) => void;
  onImageClick: (url: string) => void;
}

export const ImageSubjectiveRow: React.FC<ImageSubjectiveRowProps> = ({
  row,
  index,
  currentPage,
  pageSize,
  visibleColumns,
  togglingId,
  onToggleStatus,
  onEdit,
  onImageClick,
}) => {
  const getCanonicalImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    if (!base) return url;
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  return (
    <TableCollapsibleRow
      key={row.id}
      colSpan={visibleColumns.length + 1}
      className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300"
      expandedContent={
        <div className="px-5 py-4 bg-slate-50/20 dark:bg-slate-900/30 border-t border-border/40">
          <QuestionDetailView
            question={row}
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
      {visibleColumns.includes("image") && (
        <TableCell className="text-center">
          {row.image_url ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!row.image_url) return;
                const full = getCanonicalImageUrl(row.image_url);
                if (full) onImageClick(full);
              }}
              className="relative w-12 h-12 rounded-full overflow-hidden border border-border/60 hover:border-brand-primary transition-all group/img shadow-sm bg-muted/20"
              title="Open image lightbox"
            >
              <Image
                src={getCanonicalImageUrl(row.image_url) as string}
                alt="preview"
                fill
                className="object-cover group-hover/img:scale-110 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-colors">
                <ImageIcon
                  size={14}
                  className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                />
              </div>
            </button>
          ) : (
            <span className="text-muted-foreground/30">-</span>
          )}
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
                onChange={() => onToggleStatus(row.id)}
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
