"use client";

import { Eye, Phone } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { AdminUserResultListItem } from "@lib/api/results";
import { CollapsibleResultDetail } from "./CollapsibleResultDetail";

interface ResultTableViewProps {
  items: AdminUserResultListItem[];
  allSubjects: string[];
  visibleColumns: string[];
}

export function ResultTableView({
  items,
  allSubjects,
  visibleColumns,
}: ResultTableViewProps) {
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
            {visibleColumns.includes("date") && (
              <TableHead className="min-w-[100px] whitespace-nowrap font-bold text-foreground/80">
                Date
              </TableHead>
            )}
            {visibleColumns.includes("paper") && (
              <TableHead className="min-w-[140px] whitespace-nowrap text-center font-bold text-foreground/80">
                Assigned Paper
              </TableHead>
            )}
            {visibleColumns.includes("marks") && (
              <TableHead className="text-center min-w-[90px] whitespace-nowrap font-bold text-foreground/80">
                Marks
              </TableHead>
            )}

            {/* Dynamic Subjects */}
            {allSubjects.map((s) =>
              visibleColumns.includes(`subject_${s}`) ? (
                <TableHead
                  key={s}
                  className="text-center min-w-[130px] whitespace-nowrap font-bold text-foreground/80"
                >
                  {s}
                </TableHead>
              ) : null,
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
              <TableHead className="min-w-[120px] whitespace-nowrap font-bold text-foreground/80">
                Latest Status
              </TableHead>
            )}
            {visibleColumns.includes("actions") && (
              <TableHead className="text-right min-w-[80px] whitespace-nowrap sticky right-0 bg-[#f8fafc] dark:bg-[#0f172a] z-10 font-bold text-foreground/80 border-l border-border/50">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const latest = item.latest_attempt;
            return (
              <TableCollapsibleRow
                key={item.user_id}
                colSpan={visibleColumns.length + 1}
                expandedContent={
                  <CollapsibleResultDetail
                    latest={latest}
                    attempts_count={item.attempts_count}
                  />
                }
              >
                {visibleColumns.includes("candidate") && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-primary font-bold shadow-inner">
                        {item.username?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Typography variant="body3" className="font-bold">
                            {item.username || "Anonymous"}
                          </Typography>
                          {item.is_reattempt ? (
                            <Badge
                              variant="outline"
                              color="violet"
                              animate="pulse"
                            >
                              RE-ATTEMPT
                            </Badge>
                          ) : (
                            <Badge
                              color="success"
                              variant="outline"
                              animate="pulse"
                            >
                              NEW
                            </Badge>
                          )}
                        </div>
                        <Typography
                          variant="body5"
                          className="text-muted-foreground flex items-center gap-1.5"
                        >
                          <Phone size={11} className="opacity-60" />
                          {item.mobile}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("date") && (
                  <TableCell className="text-muted-foreground">
                    {latest?.submitted_at ? (
                      new Date(latest.submitted_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        },
                      )
                    ) : (
                      <span className="text-muted-foreground/60 font-medium">
                        N/A
                      </span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.includes("paper") && (
                  <TableCell className="text-muted-foreground">
                    {latest?.paper_name ? (
                      latest.paper_name
                    ) : (
                      <span className="text-muted-foreground/60 font-medium">
                        N/A
                      </span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.includes("marks") && (
                  <TableCell className="text-center">
                    {latest?.total_marks ? (
                      <div className="flex flex-col items-center">
                        <div className="px-3 py-1.5 rounded-xl bg-muted/30 border border-border/40 inline-flex items-center gap-2 shadow-sm min-w-[70px] justify-center">
                          <span className="font-black text-brand-primary leading-none text-sm">
                            {latest.obtained_marks || 0}
                          </span>
                          <span className="h-3 w-[1px] bg-border/60" />
                          <span className="text-[11px] font-bold text-muted-foreground/60">
                            {latest.total_marks}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60 font-medium">
                        N/A
                      </span>
                    )}
                  </TableCell>
                )}

                {/* Subject Grade Cells */}
                {allSubjects.map((s) => {
                  if (!visibleColumns.includes(`subject_${s}`)) return null;
                  const subRes = latest?.subject_results?.find(
                    (sr) => sr.section_name === s,
                  );
                  return (
                    <TableCell key={s} className="text-center">
                      {subRes ? (
                        <Badge
                          variant="outline"
                          color={
                            subRes.grade === "Excellent" ||
                            subRes.grade === "Good"
                              ? "success"
                              : subRes.grade === "Average"
                                ? "warning"
                                : "error"
                          }
                          className="rounded-lg font-bold text-[10px] px-2 h-6 border-none"
                        >
                          {subRes.grade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">
                          N/A
                        </span>
                      )}
                    </TableCell>
                  );
                })}

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
                  <TableCell>
                    <Badge
                      variant="fill"
                      color={
                        latest?.status === "submitted" ||
                        latest?.status === "completed"
                          ? "success"
                          : latest?.status === "not_started"
                            ? "default"
                            : "warning"
                      }
                      className="px-3 rounded-lg font-bold text-[10px]"
                    >
                      {latest?.status?.replace("_", " ") || "Not started"}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("actions") && (
                  <TableCell className="text-right">
                    <Link href={`/admin/results/${item.user_id}`}>
                      <Button
                        variant="ghost"
                        color="primary"
                        size="icon"
                        animate="scale"
                        title="View Result"
                      >
                        <Eye size={16} />
                      </Button>
                    </Link>
                  </TableCell>
                )}
              </TableCollapsibleRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
