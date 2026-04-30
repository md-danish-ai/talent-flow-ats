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
import { TodayUserListingSkeleton } from "@components/ui-skeleton/TodayUserListingSkeleton";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Avatar } from "@components/ui-elements/Avatar";
import { Badge } from "@components/ui-elements/Badge";
import { CopyableText } from "@components/ui-elements/CopyableText";
import { Mail, ClipboardCheck } from "lucide-react";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { UserListResponse } from "@types";

interface UserTableProps {
  users: UserListResponse[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onAssignPaper: (user: UserListResponse) => void;
}

export function UserTable({
  users,
  loading,
  currentPage,
  pageSize,
  onAssignPaper,
}: UserTableProps) {
  return (
    <div className="flex-1 overflow-x-auto w-full">
      <Table aria-label="Candidates list table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
              Sr. No.
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Candidate Name
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Contact Info
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase text-center">
              Target Profile
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase">
              Assigned Paper
            </TableHead>
            <TableHead className="font-bold text-slate-500 text-xs uppercase text-center">
              Attempt Status
            </TableHead>
            <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TodayUserListingSkeleton rowCount={pageSize} />
          ) : users.length === 0 ? (
            <EmptyState
              colSpan={7}
              variant="search"
              title="No candidates found"
              description="Try adjusting your filters or date range."
            />
          ) : (
            users.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-center align-middle py-3">
                  {(currentPage - 1) * pageSize + idx + 1}
                </TableCell>
                <TableCell className="align-middle py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={row.username} variant="brand" size="sm" />
                      {/* Status Dot Indicators */}
                      {(row.process_status === "submitted" ||
                        row.assignment?.is_attempted) && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full" />
                      )}
                      {(row.process_status === "inprogress" ||
                        row.assignment?.has_started) && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
                      )}
                      {row.process_status === "ready" &&
                        !row.assignment?.has_started && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-950 rounded-full" />
                        )}
                      {row.process_status === "expired" && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full" />
                      )}
                      {(!row.process_status ||
                        row.process_status === "pending" ||
                        !row.assignment?.is_assigned) &&
                        row.process_status !== "submitted" &&
                        row.process_status !== "inprogress" &&
                        row.process_status !== "ready" &&
                        row.process_status !== "expired" && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 border-2 border-white dark:border-slate-950 rounded-full" />
                        )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-950 dark:text-white uppercase tracking-tight text-[13px] whitespace-nowrap">
                          {row.username || "Unnamed Candidate"}
                        </span>
                        {row.is_reinterview ? (
                          <Badge
                            variant="outline"
                            color="violet"
                            animate="pulse"
                            shape="square"
                            className="font-bold text-[9px] uppercase tracking-tighter"
                          >
                            RETURNING
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            color="success"
                            animate="pulse"
                            shape="square"
                            className="font-bold text-[9px] uppercase tracking-tighter"
                          >
                            NEW
                          </Badge>
                        )}
                      </div>
                      <CopyableText
                        value={row.email || "-"}
                        className="text-slate-500 dark:text-slate-300 font-medium italic mt-0.5"
                        title="Copy Email"
                      >
                        <Mail size={11} />
                        <span className="text-[11px] truncate max-w-[150px]">
                          {row.email || "-"}
                        </span>
                      </CopyableText>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-middle py-3">
                  <CopyableText
                    value={row.mobile || ""}
                    className="inline-flex text-[12px] font-medium tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-brand-primary"
                    title="Copy Phone Number"
                  >
                    <span className="mb-[1px]">{row.mobile}</span>
                  </CopyableText>
                </TableCell>
                <TableCell className="align-middle py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                      {row.department_name ||
                        row.assignment?.department_name ||
                        "N/A"}
                    </span>
                    <Badge
                      color="primary"
                      shape="square"
                      variant="outline"
                      className="text-[9px] font-bold py-0 h-4 px-1"
                    >
                      {row.assignment?.test_level_name ||
                        row.test_level_name ||
                        "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="align-middle py-3">
                  {row.assignment?.paper_name ? (
                    <span className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                      {row.assignment.paper_name}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      No Paper Set
                    </span>
                  )}
                </TableCell>
                <TableCell className="align-middle py-3 text-center">
                  {row.process_status === "submitted" ||
                  row.is_interview_submitted ||
                  row.assignment?.is_attempted ? (
                    <Badge
                      variant="outline"
                      color="success"
                      animate="pulse"
                      shape="square"
                      className="font-bold text-[10px]"
                    >
                      SUBMITTED
                    </Badge>
                  ) : row.process_status === "inprogress" ||
                    row.assignment?.has_started ? (
                    <Badge
                      variant="outline"
                      color="violet"
                      animate="pulse"
                      shape="square"
                      className="font-bold text-[10px]"
                    >
                      IN PROGRESS
                    </Badge>
                  ) : row.process_status === "ready" ? (
                    <Badge
                      variant="outline"
                      color="primary"
                      animate="pulse"
                      shape="square"
                      className="font-bold text-[10px]"
                    >
                      READY
                    </Badge>
                  ) : row.process_status === "expired" ? (
                    <Badge
                      variant="outline"
                      color="error"
                      shape="square"
                      className="font-bold text-[10px]"
                    >
                      EXPIRED
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      shape="square"
                      color="warning"
                      className="font-bold text-[10px]"
                    >
                      PENDING
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center align-middle py-3">
                  <TableIconButton
                    iconColor={
                      row.process_status === "submitted" ||
                      row.assignment?.is_attempted
                        ? "green"
                        : row.process_status === "inprogress" ||
                            row.assignment?.has_started
                          ? "orange"
                          : row.process_status === "ready"
                            ? "blue"
                            : row.process_status === "expired"
                              ? "red"
                              : "amber"
                    }
                    title={
                      row.assignment?.is_attempted
                        ? "Assessment Already Completed"
                        : "Assign Fresh Paper Set"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignPaper(row);
                    }}
                    aria-label={`Assign paper to ${row.username}`}
                  >
                    <ClipboardCheck size={18} />
                  </TableIconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
