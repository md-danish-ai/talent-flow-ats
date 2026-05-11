"use client";

import { Eye, Phone, Download, Loader2 } from "lucide-react";
import { useState as useLocalState } from "react";
import { toast } from "@lib/toast";
import { BASE_URL } from "@lib/api/client";
import Link from "next/link";
import {
  cn,
  getGradeConfig,
  formatLongDate,
  formatLongTime,
  humanizeString,
} from "@lib/utils";
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
import { useState, useMemo } from "react";
import { Tooltip } from "@components/ui-elements/Tooltip";

// ---------------------------------------------------------------------------
// PDF download helper (calls backend directly, no new tab)
// ---------------------------------------------------------------------------
async function downloadReportPdf(
  userId: number,
  attemptId: number,
  username: string,
): Promise<void> {
  // Read auth_token from cookie (same logic as client.ts)
  const authRow = document.cookie
    .split(";")
    .find((r) => r.trim().startsWith("auth_token="));
  let token = authRow ? authRow.trim().substring("auth_token=".length) : "";
  token = token.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
  try {
    token = decodeURIComponent(token);
  } catch {
    /* keep raw */
  }

  const res = await fetch(
    `${BASE_URL}/admin/results/report/${userId}/${attemptId}/pdf`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error("PDF generation failed");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .replace(/ /g, "-");

  const a = document.createElement("a");
  a.href = url;
  a.download = `Report_${username.replace(/\s+/g, "_")}_${formattedDate}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// Small stateful button that shows a spinner while downloading
function DownloadButton({
  userId,
  attemptId,
  username,
}: {
  userId: number;
  attemptId: number;
  username: string;
}) {
  const [loading, setLoading] = useLocalState(false);
  return (
    <TableIconButton
      iconColor="brand"
      animate="scale"
      title="Download Report Sheet"
      onClick={async (e) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
          await downloadReportPdf(userId, attemptId, username);
        } catch {
          toast.error("Failed to download report. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
    </TableIconButton>
  );
}

import { Checkbox } from "@components/ui-elements/Checkbox";
import { UserCheck, UserPlus } from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { AssignLeadModal } from "./AssignLeadModal";
import { STYLE_CONFIG } from "@lib/config/style";

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
}: ResultTableViewProps & { onRefresh?: (silent?: boolean) => void }) {
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    userId: number;
    attemptId: number;
    name: string;
    isBulk?: boolean;
  }>({
    isOpen: false,
    userId: 0,
    attemptId: 0,
    name: "",
    isBulk: false,
  });

  const [selectedItems, setSelectedItems] = useState<
    { user_id: number; attempt_id: number; name: string }[]
  >([]);

  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Only submitted results can be assigned a lead
  const selectableItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.latest_attempt?.status === "submitted" ||
        item.latest_attempt?.status === "completed",
    );
  }, [items]);

  const allSelected =
    selectableItems.length > 0 &&
    selectableItems.every((item) =>
      selectedItems.find(
        (i) => i.attempt_id === item.latest_attempt?.attempt_id,
      ),
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      // Remove current page's selectable items from selection
      const selectableIds = selectableItems.map(
        (i) => i.latest_attempt?.attempt_id,
      );
      setSelectedItems((prev) =>
        prev.filter((i) => !selectableIds.includes(i.attempt_id)),
      );
    } else {
      // Add current page's selectable items to selection (avoiding duplicates)
      setSelectedItems((prev) => {
        const newItems = selectableItems
          .filter(
            (item) =>
              !prev.find(
                (i) => i.attempt_id === item.latest_attempt?.attempt_id,
              ),
          )
          .map((item) => ({
            user_id: item.user_id,
            attempt_id: item.latest_attempt!.attempt_id,
            name: item.username,
          }));
        return [...prev, ...newItems];
      });
    }
  };

  const toggleSelectItem = (item: AdminUserResultListItem) => {
    const latest = item.latest_attempt;
    if (!latest) return;

    setSelectedItems((prev) => {
      const isSelected = prev.find((i) => i.attempt_id === latest.attempt_id);
      if (isSelected) {
        return prev.filter((i) => i.attempt_id !== latest.attempt_id);
      } else {
        return [
          ...prev,
          {
            user_id: item.user_id,
            attempt_id: latest.attempt_id,
            name: item.username,
          },
        ];
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-muted/20 hover:bg-muted/20 border-b-2 border-border/50">
            <TableHead className="w-[100px]">
              <div className="flex items-center gap-2">
                <span className="w-[40px] shrink-0"></span>
                <Checkbox
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  disabled={selectableItems.length === 0}
                  className="w-4 h-4"
                />
              </div>
            </TableHead>
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
                Interview Progress
              </TableHead>
            )}
            {visibleColumns.includes("project_lead") && (
              <TableHead className="min-w-[150px] whitespace-nowrap font-bold text-foreground/80">
                Project Lead
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
              const detailHref = `/admin/results/round-1/${item.user_id}`;
              const isSelectable =
                latest?.status === "submitted" ||
                latest?.status === "completed";
              return (
                <TableCollapsibleRow
                  key={latest?.attempt_id ?? item.user_id}
                  isOpen={
                    expandedRowId === (latest?.attempt_id ?? item.user_id)
                  }
                  onOpenChange={(expanded) =>
                    setExpandedRowId(
                      expanded ? (latest?.attempt_id ?? item.user_id) : null,
                    )
                  }
                  colSpan={visibleColumns.length + 1}
                  expandedContent={
                    <CollapsibleResultDetail
                      latest={latest}
                      attempts_count={item.attempts_count}
                    />
                  }
                  showToggleCell={false}
                >
                  <TableCell className="w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="w-[40px] shrink-0 flex justify-center">
                        <TableCollapsibleRow.Toggle />
                      </div>
                      <Checkbox
                        checked={
                          !!selectedItems.find(
                            (i) => i.attempt_id === latest?.attempt_id,
                          )
                        }
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectItem(item);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        disabled={!isSelectable}
                        className="w-4 h-4"
                      />
                    </div>
                  </TableCell>
                  {visibleColumns.includes("candidate") && (
                    <TableCell className="align-middle py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <Avatar
                            name={item.username}
                            variant="brand"
                            size="sm"
                          />
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-slate-900 rounded-full shadow-sm",
                              latest?.status === "submitted" ||
                                latest?.status === "completed"
                                ? "bg-green-500"
                                : latest?.status === "auto_submitted"
                                  ? "bg-blue-500"
                                  : latest?.status === "started"
                                    ? "bg-violet-500"
                                    : latest?.status === "expired"
                                      ? "bg-red-500"
                                      : "bg-slate-400",
                            )}
                          />
                        </div>
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
                              >
                                RE-ATTEMPT
                              </Badge>
                            ) : (
                              <Badge
                                color="success"
                                variant="outline"
                                animate="pulse"
                                shape="square"
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
                      >
                        {item.attempts_count > 0 ? item.attempts_count : 0}{" "}
                        {item.attempts_count > 1 ? "Attempts" : "Attempt"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("marks") && (
                    <TableCell className="text-center">
                      {latest?.total_marks ? (
                        <div className="flex flex-col gap-1.5 min-w-[100px] mx-auto">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[12px] font-bold text-foreground flex items-baseline gap-1">
                              {latest.obtained_marks || 0}
                              <span className="text-muted-foreground/40 font-medium">
                                /
                              </span>
                              {latest.total_marks}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200/60 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden border border-border/5">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,0,0,0.05)]",
                                getGradeConfig(latest.overall_grade).barBg,
                              )}
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
                            getGradeConfig(latest.overall_grade).badgeColor
                          }
                          shape="square"
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
                            : latest?.status === "auto_submitted"
                              ? "blue"
                              : latest?.status === "started"
                                ? "violet"
                                : latest?.status === "expired"
                                  ? "error"
                                  : "default"
                        }
                        shape="square"
                      >
                        {latest?.status
                          ? humanizeString(latest.status)
                          : "NOT STARTED"}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("project_lead") && (
                    <TableCell className="align-middle">
                      <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                        {latest?.interviewers &&
                        latest.interviewers.length > 0 ? (
                          <Tooltip
                            content={
                              <div className="flex flex-col gap-2 p-1 min-w-[140px]">
                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 border-b border-border dark:border-white/10 pb-1">
                                  Full Panel
                                </div>
                                {latest.interviewers.map((lead, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="relative shrink-0">
                                      <Avatar
                                        name={lead.name}
                                        variant="brand"
                                        className="w-5 h-5 text-[9px] rounded-sm border-none shadow-none"
                                      />
                                      <div
                                        className={cn(
                                          "absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-slate-900",
                                          lead.status === "completed"
                                            ? "bg-emerald-500"
                                            : "bg-amber-500",
                                        )}
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                                      {lead.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            }
                            side="top"
                          >
                            <div className="flex items-center gap-2 group cursor-default">
                              <div className="relative shrink-0">
                                <Avatar
                                  name={latest.interviewers[0].name}
                                  variant="brand"
                                  className="w-6 h-6 text-[10px] rounded-md border-orange-200/50 dark:border-orange-900/30 shadow-sm"
                                />
                                <div
                                  className={cn(
                                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-950",
                                    latest.interviewers[0].status ===
                                      "completed"
                                      ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"
                                      : "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] animate-pulse",
                                  )}
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight group-hover:text-brand-primary transition-colors whitespace-nowrap">
                                  {latest.interviewers[0].name}
                                </span>
                                {latest.interviewers.length > 1 && (
                                  <Badge
                                    variant="outline"
                                    color="default"
                                    shape="square"
                                  >
                                    +{latest.interviewers.length - 1}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Tooltip>
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
                            {formatLongDate(interviewDate)}
                          </span>
                          <span className="text-[11px] text-muted-foreground/80 font-medium">
                            {formatLongTime(interviewDate)}
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
                        {latest?.attempt_id && (
                          <DownloadButton
                            userId={item.user_id}
                            attemptId={latest.attempt_id}
                            username={item.username}
                          />
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

      {selectedItems.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={cn(
              "bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-6 border border-border dark:border-white/10 backdrop-blur-xl",
              STYLE_CONFIG.cardRadius,
            )}
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Bulk Actions
              </span>
              <span className="text-sm font-black tracking-tight">
                {selectedItems.length} Candidates Selected
              </span>
            </div>
            <div className="h-8 w-px bg-border dark:bg-white/10" />
            <Button
              color="primary"
              size="md"
              className={cn(
                "px-4 py-2.5 flex items-center gap-2 font-black text-xs uppercase tracking-wider",
              )}
              animate="scale"
              onClick={() =>
                setAssignModal({
                  isOpen: true,
                  userId: 0,
                  attemptId: 0,
                  name: "",
                  isBulk: true,
                })
              }
            >
              <UserCheck size={14} />
              Assign Project Lead
            </Button>
            <Button
              variant="outline"
              color="error"
              size="md"
              onClick={() => setSelectedItems([])}
              className={cn("font-black text-xs uppercase tracking-wider")}
              animate="scale"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      <AssignLeadModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}
        userId={assignModal.userId}
        attemptId={assignModal.attemptId}
        candidateName={assignModal.name}
        selectedItems={assignModal.isBulk ? selectedItems : []}
        onSuccess={() => {
          setSelectedItems([]);
          if (onRefresh) onRefresh(true);
        }}
      />
    </div>
  );
}
