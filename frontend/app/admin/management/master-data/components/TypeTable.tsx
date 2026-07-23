import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Edit, Copy, Check, Grip } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Tooltip } from "@components/ui-elements/Tooltip";

export interface BaseType {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

interface TypeTableProps {
  activeTab: string;
  currentData: BaseType[];
  isFetching: boolean;
  currentPage: number;
  pageSize: number;
  togglingId: number | null;
  onEdit: (item: BaseType) => void;
  onToggleStatus: (item: BaseType) => void;
  onReorder?: (newItems: BaseType[]) => void;
}

function CopyCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex items-center gap-2 group/copy">
      <Badge variant="outline" shape="square" color="primary">
        {code}
      </Badge>
      <Tooltip content={copied ? "Copied!" : "Copy Code"} side="top">
        <button
          onClick={handleCopy}
          className="p-1 rounded-md hover:bg-brand-primary/10 text-muted-foreground hover:text-brand-primary transition-colors"
          type="button"
        >
          {copied ? (
            <Check size={12} className="text-success" />
          ) : (
            <Copy size={12} />
          )}
        </button>
      </Tooltip>
    </div>
  );
}

export function TypeTable({
  activeTab,
  currentData,
  isFetching,
  currentPage,
  pageSize,
  togglingId,
  onEdit,
  onToggleStatus,
  onReorder,
}: TypeTableProps) {
  const isSubject = activeTab === "subject";
  const hasDescription =
    activeTab === "subject" ||
    activeTab === "exam_level" ||
    activeTab === "interview_result";

  const [items, setItems] = useState<BaseType[]>(currentData);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    setItems(currentData);
  }, [currentData]);

  const colSpan = 6 + (hasDescription ? 1 : 0) + (isSubject ? 1 : 0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...items];
    const [movedItem] = updated.splice(draggedIdx, 1);
    updated.splice(dropIdx, 0, movedItem);

    setItems(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);

    if (onReorder) {
      onReorder(updated);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="overflow-x-auto w-full h-full flex flex-col">
      <Table aria-label={`${activeTab} table`} className="h-full">
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[48px] text-center">
              <Tooltip content="Drag rows to reorder" side="top">
                <div className="flex justify-center items-center text-slate-400">
                  <Grip size={15} />
                </div>
              </Tooltip>
            </TableHead>
            <TableHead className="w-[70px] text-center font-bold text-slate-500 text-xs uppercase">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Name
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Code
            </TableHead>
            {hasDescription && (
              <TableHead className="font-bold text-slate-500 text-xs uppercase">
                Description
              </TableHead>
            )}
            {isSubject && (
              <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                Exclusive
              </TableHead>
            )}
            <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
              Status
            </TableHead>
            <TableHead className="text-center w-[120px] font-bold text-slate-500 text-xs uppercase">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <SimpleTableSkeleton columnCount={colSpan} rowCount={pageSize} />
          ) : items.length === 0 ? (
            <EmptyState
              colSpan={colSpan}
              variant="database"
              title={`No ${activeTab} found`}
              description={`You haven't added any ${activeTab} yet.`}
            />
          ) : (
            items.map((item, idx) => {
              const isDragging = draggedIdx === idx;
              const isOver = dragOverIdx === idx;
              return (
                <TableRow
                  key={item.id}
                  draggable={!isFetching}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`transition-colors duration-150 ${
                    isDragging ? "opacity-40 bg-muted/40" : ""
                  } ${
                    isOver && !isDragging
                      ? "border-t-2 border-brand-primary bg-brand-primary/5"
                      : ""
                  }`}
                >
                  <TableCell className="text-center p-0 w-[48px]">
                    <Tooltip content="Drag to reorder" side="top">
                      <div className="flex items-center justify-center py-2">
                        <div className="w-7 h-7 rounded-md bg-muted/40 hover:bg-brand-primary/10 text-muted-foreground/60 hover:text-brand-primary border border-border/40 hover:border-brand-primary/30 transition-all flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xs">
                          <Grip size={15} />
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="font-semibold">{item.name}</TableCell>
                  <TableCell>
                    {item.code ? (
                      <CopyCodeBadge code={item.code} />
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        —
                      </span>
                    )}
                  </TableCell>
                  {hasDescription && (
                    <TableCell className="text-muted-foreground">
                      {item.description || "-"}
                    </TableCell>
                  )}
                  {isSubject && (
                    <TableCell className="text-center">
                      {item.metadata?.is_exclusive ? (
                        <Badge variant="outline" color="success" shape="square">
                          YES
                        </Badge>
                      ) : (
                        <Badge variant="outline" color="error" shape="square">
                          NO
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Switch
                        checked={item.is_active}
                        onChange={() => onToggleStatus(item)}
                        size="sm"
                        disabled={togglingId === item.id}
                        aria-label={`Toggle active status for ${item.name}`}
                      />
                      <Badge
                        variant="outline"
                        shape="square"
                        color={item.is_active ? "success" : "error"}
                      >
                        {item.is_active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <TableIconButton
                        iconColor="blue"
                        btnSize="sm"
                        animate="scale"
                        onClick={() => onEdit(item)}
                        title={`Edit ${item.name}`}
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit size={16} />
                      </TableIconButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
