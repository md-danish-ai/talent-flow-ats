"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import { DatePicker } from "@components/ui-elements/DatePicker";
import { Button } from "@components/ui-elements/Button";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Modal } from "@components/ui-elements/Modal";
import { Input } from "@components/ui-elements/Input";
import { Badge } from "@components/ui-elements/Badge";
import { Search, Download, Printer, UserCircle, Loader2, CheckCircle2 } from "lucide-react";
import { resultsApi, type AdminUserResultListItem, type AdminUserResultDetail } from "@lib/api/results";

export default function ResultsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [usersList, setUsersList] = useState<AdminUserResultListItem[]>([]);
  const [userDetailsMap, setUserDetailsMap] = useState<Record<number, AdminUserResultDetail>>({});
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserResultDetail | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [subjectiveMarks, setSubjectiveMarks] = useState<{ [questionId: number]: number | string }>({});
  const [savingMarks, setSavingMarks] = useState(false);

  // Temporary State for Checkboxes
  const [forwardStatuses, setForwardStatuses] = useState<Record<number, boolean>>({});
  const [arcCrmStatuses, setArcCrmStatuses] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const list = await resultsApi.getUserResults();
        // Only take users who have attempted the exam
        const attemptedUsers = list.filter((u) => u.attempts_count > 0 && u.latest_attempt);
        setUsersList(attemptedUsers);

        // Fetch Individual Result detail for all attempted users
        const detailsPromises = attemptedUsers.map(u =>
          resultsApi.getUserResultDetail(u.user_id, u.latest_attempt!.attempt_id).catch(() => null)
        );

        const detailsRes = await Promise.all(detailsPromises);
        const newDetailsMap: Record<number, AdminUserResultDetail> = {};

        detailsRes.forEach((detail, idx) => {
          if (detail) {
            newDetailsMap[attemptedUsers[idx].user_id] = detail;
          }
        });

        setUserDetailsMap(newDetailsMap);
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleOpenResult = (userId: number) => {
    const detail = userDetailsMap[userId];
    if (!detail) return;

    setSelectedUserDetail(detail);
    const initialMarks: { [key: number]: number | string } = {};
    detail.answers.forEach((ans) => {
      initialMarks[ans.question_id] = ans.manual_marks !== undefined && ans.manual_marks !== null ? ans.manual_marks : ans.marks_obtained || "";
    });
    setSubjectiveMarks(initialMarks);
    setIsResultModalOpen(true);
  };

  const handleSaveMarks = async () => {
    if (!selectedUserDetail) return;

    setSavingMarks(true);
    try {
      // 1. Convert marks state to array format expected by the API
      const marksPayload = Object.entries(subjectiveMarks)
        .map(([qId, marks]) => ({
          question_id: Number(qId),
          marks: Number(marks) || 0
        }));

      // 2. Dispatch the update to the backend
      const res = (await resultsApi.updateSubjectiveMarks(selectedUserDetail.attempt.attempt_id, marksPayload)) as { data?: { total_marks_obtained?: number } };

      const newTotalMarks = res.data?.total_marks_obtained;

      // 3. Update local state explicitly mapping to the answers and attempt total score
      setUserDetailsMap(prev => {
        const currentDetail = prev[selectedUserDetail.user.id];
        if (!currentDetail) return prev;

        const updatedAnswers = currentDetail.answers.map(ans => ({
          ...ans,
          manual_marks: subjectiveMarks[ans.question_id] !== undefined
            ? Number(subjectiveMarks[ans.question_id])
            : ans.manual_marks,
          marks_obtained: subjectiveMarks[ans.question_id] !== undefined
            ? Number(subjectiveMarks[ans.question_id])
            : ans.marks_obtained,
        }));

        return {
          ...prev,
          [selectedUserDetail.user.id]: {
            ...currentDetail,
            answers: updatedAnswers,
            summary: {
              ...currentDetail.summary,
              total_marks_obtained: newTotalMarks !== undefined ? newTotalMarks : currentDetail.summary.total_marks_obtained
            }
          }
        };
      });

      setIsResultModalOpen(false);
    } catch (err) {
      console.error("Failed to save subjective marks", err);
      alert("Failed to save subjective marks. Please try again.");
    } finally {
      setSavingMarks(false);
    }
  };

  const getSubjectAnswersList = (detail: AdminUserResultDetail) => {
    return detail.answers.filter(ans =>
      ans.question_type.toLowerCase() !== "mcq" &&
      ans.question_type.toLowerCase() !== "objective"
    );
  };

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Exam Results"
        description="View candidate exam scores, check manual assessments, and monitor paper-wise subject analytics."
      />

      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 p-5 flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-end flex-1">
          <div className="w-full sm:w-56">
            <DatePicker
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="h-10 text-sm"
              label="From Date"
            />
          </div>
          <div className="w-full sm:w-56">
            <DatePicker
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="h-10 text-sm"
              label="To Date"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button color="primary" variant="primary" size="md" startIcon={<Search size={16} />}>
            Search
          </Button>
          <Button color="success" variant="primary" size="md" startIcon={<Download size={16} />}>
            Export
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[14px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-20 text-muted-foreground gap-3">
            <Loader2 className="animate-spin" size={24} />
            <Typography variant="body3">Fetching Result Details...</Typography>
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl m-4">
            No Exam Results found.
          </div>
        ) : (
          <Table className="min-w-[1100px]">
            <TableHeader>
              <tr className="bg-slate-100/50 dark:bg-slate-800/30">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[60px] text-center">Sr. No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead className="text-center">Total Score</TableHead>
                <TableHead className="text-center">Fact Sheet</TableHead>
                <TableHead className="text-center">Forward</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-center">ArcCrm Update</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {usersList.map((user, index) => {
                const detail = userDetailsMap[user.user_id];

                // Group subjects dynamically for the accordion UI
                const subjectsMap = new Map<string, number>();
                if (detail) {
                  detail.answers.forEach(ans => {
                    if (ans.subject_type) {
                      subjectsMap.set(ans.subject_type, (subjectsMap.get(ans.subject_type) || 0) + (ans.marks_obtained || 0));
                    }
                  });
                }

                const expandedUI = (
                  <div className="p-6 bg-slate-50/80 dark:bg-slate-900/40 rounded-b-xl border-x border-border shadow-inner">
                    <Typography variant="body3" weight="bold" className="mb-4 text-brand-primary/80 uppercase tracking-widest text-[11px]">
                      Subject-wise Breakdown
                    </Typography>
                    {subjectsMap.size > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {Array.from(subjectsMap.entries()).map(([sub, marks]) => (
                          <div key={sub} className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center hover:border-brand-primary/30 transition-colors">
                            <Typography variant="body5" className="text-muted-foreground font-semibold uppercase tracking-wider mb-2 text-[10px] break-words w-full line-clamp-2">{sub}</Typography>
                            <Typography variant="h5" weight="black" className="text-foreground">{marks.toFixed(2)}</Typography>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Typography variant="body4" className="text-muted-foreground italic">No subjects attempted by candidate.</Typography>
                    )}
                  </div>
                );

                return (
                  <TableCollapsibleRow
                    key={user.user_id}
                    colSpan={9}
                    expandedContent={expandedUI}
                  >
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-brand-primary whitespace-nowrap">{user.username}</TableCell>
                    <TableCell className="text-muted-foreground">{user.mobile}</TableCell>
                    <TableCell className="text-center font-bold text-brand-secondary text-lg">
                      {detail ? detail.summary.total_marks_obtained.toFixed(2) : user.latest_attempt?.obtained_marks?.toFixed(2) || "0.00"}
                    </TableCell>

                    <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" color="primary" size="icon-sm" className="opacity-70 hover:opacity-100">
                        <Printer size={16} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={!!forwardStatuses[user.user_id]}
                          onChange={(e) => {
                            e.stopPropagation();
                            setForwardStatuses(prev => ({ ...prev, [user.user_id]: !prev[user.user_id] }));
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="action"
                        size="sm"
                        className="h-8 text-xs font-bold w-20 shadow-none border border-brand-primary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenResult(user.user_id);
                        }}
                      >
                        Results
                      </Button>
                    </TableCell>
                    <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={!!arcCrmStatuses[user.user_id]}
                          onChange={(e) => {
                            e.stopPropagation();
                            setArcCrmStatuses(prev => ({ ...prev, [user.user_id]: !prev[user.user_id] }));
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableCollapsibleRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedUserDetail && (
        <Modal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          title={`Candidate Result: ${selectedUserDetail.user.username}`}
          closeOnOutsideClick={true}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20">
              <UserCircle size={40} className="text-brand-primary opacity-80" />
              <div>
                <Typography variant="h6" className="text-brand-primary m-0 leading-tight">
                  {selectedUserDetail.user.username}
                </Typography>
                <Typography variant="body4" className="text-muted-foreground m-0 leading-none mt-1">
                  Mobile: {selectedUserDetail.user.mobile}
                </Typography>
              </div>
              <div className="ml-auto flex gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-border shadow-sm">
                  <Typography variant="body5" className="text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Attempt Count</Typography>
                  <Typography variant="h6" weight="bold">
                    {selectedUserDetail.attempt.attempted_count} / {selectedUserDetail.attempt.total_questions}
                  </Typography>
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-border shadow-sm">
                  <Typography variant="body5" className="text-muted-foreground uppercase tracking-wider mb-1 text-[10px]">Total Marks</Typography>
                  <Typography variant="h6" weight="bold" className="text-brand-success">{selectedUserDetail.summary.total_marks_obtained.toFixed(2)}</Typography>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Typography variant="h6" className="border-b border-border pb-2">
                Subjective Questions (Manual Marking)
              </Typography>

              {getSubjectAnswersList(selectedUserDetail).length > 0 ? (
                getSubjectAnswersList(selectedUserDetail).map((ans, idx) => (
                  <div key={ans.question_id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-border flex flex-col gap-3 transition-colors hover:bg-slate-100/50">
                    <div className="flex justify-between items-start">
                      <div className="max-w-[80%]">
                        <Badge className="mb-2" variant="outline" color="primary">{ans.subject_type || "Subjective"}</Badge>
                        <Typography variant="body3" weight="semibold" className="text-foreground">
                          <span className="text-brand-primary mr-2">Q{idx + 1}.</span>
                          {ans.question_text}
                        </Typography>
                        {ans.passage && (
                          <div className="my-2 p-3 bg-white dark:bg-slate-800 rounded border border-border text-xs text-muted-foreground italic leading-relaxed">
                            Passage: {ans.passage}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold bg-muted px-3 py-1.5 rounded text-muted-foreground whitespace-nowrap border border-border">
                        Max: {ans.max_marks} Marks
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-border/60 text-sm text-foreground my-2 min-h-[60px] shadow-sm">
                      <span className="text-xs font-bold text-brand-secondary block mb-2 uppercase tracking-wider">Candidate Answer:</span>
                      {ans.user_answer ? (
                        <p className="whitespace-pre-wrap">{ans.user_answer}</p>
                      ) : (
                        <span className="text-muted-foreground italic">No answer provided</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                      <Typography variant="body4" weight="semibold" className="text-indigo-900 dark:text-indigo-300">
                        Assign Marks manually:
                      </Typography>
                      <Input
                        type="number"
                        min="0"
                        max={ans.max_marks}
                        value={subjectiveMarks[ans.question_id] ?? ""}
                        onChange={(e) => setSubjectiveMarks({ ...subjectiveMarks, [ans.question_id]: e.target.value })}
                        placeholder="0"
                        className="w-24 bg-white dark:bg-slate-950 text-center font-bold"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
                  <UserCircle size={32} className="opacity-20" />
                  <Typography variant="body4">No subjective answers found for this candidate.</Typography>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setIsResultModalOpen(false)} disabled={savingMarks}>
                Cancel
              </Button>
              <Button variant="primary" color="primary" onClick={handleSaveMarks} disabled={savingMarks} startIcon={savingMarks ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}>
                {savingMarks ? "Saving..." : "Save Marks & Update Results"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}

