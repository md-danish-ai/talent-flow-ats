"use client";

import { Eye, Phone } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@components/ui-elements/Avatar";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { CopyableText } from "@components/ui-elements/CopyableText";
import { ResultTableSkeleton } from "@components/ui-skeleton/ResultTableSkeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import { Badge } from "@components/ui-elements/Badge";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { type AdminUserResultListItem } from "@types";
import { CollapsibleResultDetail } from "./CollapsibleResultDetail";
import { UserPlus } from "lucide-react";
import { AssignLeadModal } from "./AssignLeadModal";
import { useState } from "react";

interface ResultTableViewProps {
  items: AdminUserResultListItem[];
  visibleColumns: string[];
  isLoading?: boolean;
  limit?: number;
}

export function ResultTableView({
  items,
  visibleColumns,
  isLoading,
  limit = 10,
  onRefresh,
}: ResultTableViewProps & { onRefresh?: () => void }) {
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    userId: number;
    attemptId: number;
    name: string;
  }>({
    isOpen: false,
    userId: 0,
    attemptId: 0,
    name: "",
  });

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-muted/20 hover:bg-muted/20 border-b-2 border-border/50">
            <TableHead className="w-[40px]"></TableHead>
            {visibleColumns.includes("candidate") && (
              <TableHead className="min-w-[200px] whitespace-nowrap font-bold text-foreground/80">
                Candidate
              </TableHead>
            )}
            {visibleColumns.includes("paper") && (
              <TableHead className="min-w-[140px] whitespace-nowrap text-left font-bold text-foreground/80">
                Assigned Paper
              </TableHead>
            )}
            {visibleColumns.includes("attempts") && (
              <TableHead className="text-center min-w-[90px] whitespace-nowrap font-bold text-foreground/80">
                Total Attempts
              </TableHead>
            )}
            {visibleColumns.includes("marks") && (
              <TableHead className="text-center min-w-[90px] whitespace-nowrap font-bold text-foreground/80">
                Marks
              </TableHead>
            )}
            {visibleColumns.includes("grade") && (
              <TableHead className="text-center min-w-[100px] whitespace-nowrap font-bold text-foreground/80">
                Overall Grade
              </TableHead>
            )}

            {visibleColumns.includes("typing_wpm") && (
              <TableHead className="text-center min-w-[110px] whitespace-nowrap font-bold text-foreground/80">
                Typing WPM
              </TableHead>
            )}
            {visibleColumns.includes("typing_acc") && (
              <TableHead className="text-center min-w-[110px] whitespace-nowrap font-bold text-foreground/80">
                Accuracy
              </TableHead>
            )}
            {visibleColumns.includes("status") && (
              <TableHead className="min-w-[120px] whitespace-nowrap font-bold text-foreground/80 text-center">
                Latest Status
              </TableHead>
            )}
            {visibleColumns.includes("project_lead") && (
              <TableHead className="min-w-[150px] whitespace-nowrap font-bold text-foreground/80">
                Interviewer(s)
              </TableHead>
            )}
            {visibleColumns.includes("date") && (
              <TableHead className="min-w-[100px] whitespace-nowrap font-bold text-foreground/80">
                Date
              </TableHead>
            )}
            {visibleColumns.includes("actions") && (
              <TableHead className="text-right min-w-[80px] whitespace-nowrap sticky z-10 font-bold text-foreground/80">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <ResultTableSkeleton
              visibleColumns={visibleColumns}
              rowCount={limit}
            />
          ) : items.length === 0 ? (
            <EmptyState
              colSpan={visibleColumns.length + 1}
              variant="search"
              title="No results found"
              description="No results found matching your criteria. Try adjusting your search or filters."
            />
          ) : (
            items.map((item) => {
              const latest = item.latest_attempt;
              const interviewDate = latest?.submitted_at || latest?.started_at;
              const detailHref = `/admin/results/${item.user_id}`;
              return (
                <TableCollapsibleRow
                  key={latest?.attempt_id ?? item.user_id}
                  colSpan={visibleColumns.length + 1}
                  expandedContent={
                    <CollapsibleResultDetail
                      latest={latest}
                      attempts_count={item.attempts_count}
                    />
                  }
                >
                  {visibleColumns.includes("candidate") && (
                    <TableCell className="align-middle py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={item.username}
                          variant="brand"
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-950 dark:text-white uppercase tracking-tight text-[13px] whitespace-nowrap">
                              {item.username || "Anonymous"}
                            </span>
                            {item.is_reattempt ? (
                              <Badge
                                variant="outline"
                                color="violet"
                                animate="pulse"
                                shape="square"
                                className="text-[9px] font-bold"
                              >
                                RE-ATTEMPT
                              </Badge>
                            ) : (
                              <Badge
                                color="success"
                                variant="outline"
                                animate="pulse"
                                shape="square"
                                className="text-[9px] font-bold"
                              >
                                NEW
                              </Badge>
                            )}
                          </div>
                          <CopyableText
                            value={item.mobile}
                            className="text-slate-500 dark:text-slate-300 font-medium"
                            title="Copy Phone Number"
                          >
                            <Phone size={11} className="w-[11px] h-[11px]" />
                            <span className="text-[11px] font-medium tracking-tight">
                              {item.mobile}
                            </span>
                          </CopyableText>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("paper") && (
                    <TableCell className="text-muted-foreground font-medium text-left">
                      {latest?.paper_name ? (
                        latest.paper_name
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.includes("attempts") && (
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        color={item.attempts_count > 1 ? "warning" : "default"}
                        shape="square"
                        className="font-bold text-[11px] px-2.5 py-0.5 uppercase tracking-tight"
                      >
                        {item.attempts_count > 0 ? item.attempts_count : 0}{" "}
                        {item.attempts_count > 1 ? "Attempts" : "Attempt"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("marks") && (
                    <TableCell className="text-center">
                      {latest?.total_marks ? (
                        <div className="flex flex-col items-center justify-center mx-auto gap-[5px] w-max min-w-[64px]">
                          <div className="flex items-baseline justify-center gap-1 w-full">
                            <span className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
                              {latest.obtained_marks || 0}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-none">
                              / {latest.total_marks}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                ((latest.obtained_marks || 0) /
                                  latest.total_marks) *
                                  100 >=
                                80
                                  ? "bg-emerald-500"
                                  : ((latest.obtained_marks || 0) /
                                        latest.total_marks) *
                                        100 >=
                                      60
                                    ? "bg-brand-primary"
                                    : ((latest.obtained_marks || 0) /
                                          latest.total_marks) *
                                          100 >=
                                        40
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                              }`}
                              style={{
                                width: `${Math.min(((latest.obtained_marks || 0) / latest.total_marks) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.includes("grade") && (
                    <TableCell className="text-center">
                      {latest?.overall_grade &&
                      latest?.overall_grade !== "N/A" ? (
                        <Badge
                          variant="outline"
                          color={
                            latest.overall_grade === "Excellent" ||
                            latest.overall_grade === "Good"
                              ? "success"
                              : latest.overall_grade === "Average"
                                ? "warning"
                                : "error"
                          }
                          shape="square"
                          animate="pulse"
                        >
                          {latest.overall_grade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  )}

                  {visibleColumns.includes("typing_wpm") && (
                    <TableCell className="text-center font-medium">
                      {latest?.typing_stats &&
                      typeof latest.typing_stats.wpm === "number" ? (
                        latest.typing_stats.wpm
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.includes("typing_acc") && (
                    <TableCell className="text-center font-medium">
                      {latest?.typing_stats &&
                      typeof latest.typing_stats.accuracy === "number" ? (
                        `${latest.typing_stats.accuracy}%`
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        color={
                          latest?.status === "submitted" ||
                          latest?.status === "completed"
                            ? "success"
                            : latest?.status === "not_started"
                              ? "default"
                              : "warning"
                        }
                        shape="square"
                        animate="pulse"
                        className="font-bold uppercase tracking-wider"
                      >
                        {latest?.status?.replace("_", " ") || "NOT STARTED"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("project_lead") && (
                    <TableCell className="align-middle">
                      <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                        {latest?.interviewers &&
                        latest.interviewers.length > 0 ? (
                          latest.interviewers.map(([name, status], idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              color={
                                status === "completed" ? "success" : "default"
                              }
                              shape="square"
                              className="text-[10px] font-bold py-0.5 px-1.5 whitespace-nowrap"
                            >
                              {name}
                              {status === "completed" && " ✓"}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground/40 text-[11px] font-medium italic">
                            Not Assigned
                          </span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("date") && (
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {interviewDate ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 text-[13px]">
                            {new Date(interviewDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="text-[11px] text-muted-foreground/80 font-medium">
                            {new Date(interviewDate).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.includes("actions") && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {latest?.status === "submitted" && (
                          <TableIconButton
                            iconColor="green"
                            animate="scale"
                            title="Assign to Project Lead"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignModal({
                                isOpen: true,
                                userId: item.user_id,
                                attemptId: latest.attempt_id,
                                name: item.username,
                              });
                            }}
                          >
                            <UserPlus size={16} />
                          </TableIconButton>
                        )}
                        <Link href={detailHref}>
                          <TableIconButton
                            iconColor="brand"
                            animate="scale"
                            title="View Result"
                          >
                            <Eye size={16} />
                          </TableIconButton>
                        </Link>
                      </div>
                    </TableCell>
                  )}
                </TableCollapsibleRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <AssignLeadModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}
        userId={assignModal.userId}
        attemptId={assignModal.attemptId}
        candidateName={assignModal.name}
        onSuccess={onRefresh}
      />
    </div>
  );
}
