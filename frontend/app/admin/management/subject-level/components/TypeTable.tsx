"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { EmptyState } from "@components/ui-elements/EmptyState";

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
  const colSpan = isSubject ? 7 : 5;

  return (
    <div className="overflow-x-auto w-full">
      <Table aria-label={`${isSubject ? "Subjects" : "Levels"} table`}>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              {isSubject ? "Subject Name" : "Level Name"}
            </TableHead>
            {isSubject && (
              <TableHead className="font-bold text-slate-500 text-xs uppercase">
                Code
              </TableHead>
            )}
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
                {isSubject && (
                  <TableCell>
                    {item.code ? (
                      <Badge
                        variant="outline"
                        shape="square"
                        color="primary"
                        className="font-black text-[9px] px-2 py-0.5 border-brand-primary/20 uppercase tracking-widest"
                      >
                        {item.code}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        —
                      </span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground">
                  {item.description || "-"}
                </TableCell>
                {isSubject && (
                  <TableCell className="text-center">
                    {item.metadata?.is_exclusive ? (
                      <Badge
                        variant="outline"
                        color="success"
                        shape="square"
                        className="text-[9px]"
                      >
                        YES
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        color="error"
                        shape="square"
                        className="text-[9px]"
                      >
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
                      className="text-[9px] font-bold"
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
