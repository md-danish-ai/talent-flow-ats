import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Edit, Trash2, Copy, Check } from "lucide-react";
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
  onDelete: (id: number) => void;
  onToggleStatus: (item: BaseType) => void;
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
  onDelete,
  onToggleStatus,
}: TypeTableProps) {
  const isSubject = activeTab === "subjects";
  const isLevel = activeTab === "levels";
  // Updated colSpan: 1 (Sr No) + 1 (Name) + 1 (Code) + 1 (Description) + (1 if isSubject for Exclusive) + 1 (Status) + 1 (Action)
  const colSpan = isSubject ? 7 : 6;

  return (
    <div className="overflow-x-auto w-full h-full flex flex-col">
      <Table aria-label={`${activeTab} table`} className="h-full">
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              {isSubject ? "Subject Name" : isLevel ? "Level Name" : "Result"}
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Code
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Description
            </TableHead>
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
          ) : currentData.length === 0 ? (
            <EmptyState
              colSpan={colSpan}
              variant="database"
              title={`No ${activeTab} found`}
              description={`You haven't added any ${activeTab} yet.`}
            />
          ) : (
            currentData.map((item, idx) => (
              <TableRow key={item.id}>
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
                <TableCell className="text-muted-foreground">
                  {item.description || "-"}
                </TableCell>
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
                    <TableIconButton
                      iconColor="red"
                      btnSize="sm"
                      animate="scale"
                      onClick={() => onDelete(item.id)}
                      title={`Delete ${item.name}`}
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </TableIconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
