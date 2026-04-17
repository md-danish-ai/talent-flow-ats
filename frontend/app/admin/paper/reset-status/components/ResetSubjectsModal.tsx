"use client";

import { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { resultsApi, type AdminUserResultDetail } from "@lib/api/results";
import { UserListResponse } from "@lib/api/auth";
import { toast } from "@lib/toast";
import {
  RefreshCw,
  BookOpen,
  AlertCircle,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";

interface ResetSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserListResponse;
  onSuccess: () => void;
}

export function ResetSubjectsModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ResetSubjectsModalProps) {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [data, setData] = useState<AdminUserResultDetail | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && user.id) {
      fetchAttemptDetail();
    } else {
      setData(null);
      setSelectedSubjects([]);
    }
  }, [isOpen, user.id]);

  const fetchAttemptDetail = async () => {
    try {
      setLoading(true);
      // We need the subjects from the latest attempt
      const detail = await resultsApi.getUserResultDetail(user.id);
      setData(detail);
    } catch (error) {
      console.error("Failed to fetch attempt detail:", error);
      toast.error("Failed to load subjects for this user.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName],
    );
  };

  const handleSelectAll = () => {
    if (!data) return;
    const subjects = data.subject_results ?? [];
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects.map((s) => s.section_name));
    }
  };

  const handleReset = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject to unlock.");
      return;
    }

    try {
      setResetting(true);
      if (!data?.attempt.attempt_id) {
        toast.error("No active attempt found to reset.");
        return;
      }

      await resultsApi.resetUserSubjects(
        user.id,
        data.attempt.attempt_id,
        selectedSubjects,
      );

      toast.success(
        `Successfully unlocked ${selectedSubjects.length} subjects.`,
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to reset subjects:", error);
      toast.error("An error occurred while resetting subjects.");
    } finally {
      setResetting(false);
    }
  };

  const isAttemptSubmitted =
    data?.attempt?.status === "submitted" ||
    data?.attempt?.status === "auto_submitted";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock Subject Status"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header decoration */}
        <div className="flex items-center gap-4 border-b border-border/50 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
            {resetting ? (
              <RefreshCw size={24} className="animate-spin" />
            ) : (
              <Unlock size={24} />
            )}
          </div>
          <div>
            <Typography
              variant="h4"
              className="font-black uppercase tracking-tight"
            >
              Unlock Paper Subjects
            </Typography>
            <Typography
              variant="body5"
              className="text-muted-foreground font-medium italic opacity-70"
            >
              Select specific subjects to unlock and reset for {user.username}
            </Typography>
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3 opacity-50">
            <Loader2 size={32} className="animate-spin text-brand-primary" />
            <Typography variant="body5" className="italic font-medium">
              Fetching subjects and attempt details...
            </Typography>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-black border border-border shadow-sm">
                  <BookOpen size={20} className="text-brand-primary" />
                </div>
                <div>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground uppercase tracking-widest text-[10px] font-black opacity-60"
                  >
                    Target Paper
                  </Typography>
                  <Typography variant="h4" className="font-black">
                    {data.attempt.paper_name}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Typography
                  variant="body5"
                  className="text-muted-foreground uppercase tracking-widest text-[10px] font-black opacity-60"
                >
                  Global State
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  {isAttemptSubmitted ? (
                    <Badge
                      color="success"
                      variant="fill"
                      icon={<Lock size={12} />}
                      className="font-black px-3 py-1 shadow-sm"
                    >
                      SUBMITTED (LOCKED)
                    </Badge>
                  ) : (
                    <Badge
                      color="warning"
                      variant="fill"
                      className="font-black px-3 py-1 shadow-sm"
                    >
                      IN PROGRESS (LIVE)
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Subjects List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <Typography
                  variant="body5"
                  className="font-black uppercase tracking-widest text-[10px] text-muted-foreground"
                >
                  Paper Curriculum ({(data.subject_results ?? []).length}{" "}
                  Sections)
                </Typography>
                <button
                  onClick={handleSelectAll}
                  className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline transition-all"
                >
                  {selectedSubjects.length ===
                  (data.subject_results ?? []).length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {data?.subject_results?.map((subject) => {
                  const isSubjectSubmitted =
                    subject.attempted_count === subject.total_questions ||
                    isAttemptSubmitted;

                  return (
                    <div
                      key={subject.section_name}
                      onClick={() => handleToggleSubject(subject.section_name)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                        selectedSubjects.includes(subject.section_name)
                          ? "bg-brand-primary/5 border-brand-primary shadow-md ring-1 ring-brand-primary/20"
                          : "bg-card border-border/50 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Selection Highlight */}
                      {selectedSubjects.includes(subject.section_name) && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
                      )}

                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedSubjects.includes(
                            subject.section_name,
                          )}
                          id={`subject-${subject.section_name}`}
                          className="pointer-events-none w-5 h-5"
                        />
                        <div>
                          <Typography
                            variant="body4"
                            className={`font-bold uppercase tracking-tight ${
                              selectedSubjects.includes(subject.section_name)
                                ? "text-brand-primary"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {subject.section_name}
                          </Typography>
                          <div className="flex items-center gap-2">
                            <Typography
                              variant="body5"
                              className="text-[10px] text-muted-foreground italic font-medium opacity-70"
                            >
                              {subject.total_questions} Questions •{" "}
                              {subject.attempted_count} Attempted
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isSubjectSubmitted ? (
                          <Badge
                            variant="fill"
                            color="success"
                            icon={<Lock size={12} />}
                            className="text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm"
                          >
                            LOCKED
                          </Badge>
                        ) : subject.attempted_count > 0 ? (
                          <Badge
                            variant="fill"
                            color="warning"
                            className="text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm"
                          >
                            IN PROGRESS
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 border-slate-500/20"
                          >
                            READY
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warning box */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 flex gap-3">
              <Unlock
                className="text-blue-600 dark:text-blue-400 shrink-0"
                size={20}
              />
              <Typography
                variant="body5"
                className="text-blue-700 dark:text-blue-200 font-medium leading-relaxed italic"
              >
                Unlocking subjects will delete existing responses for the
                selected sections and allow the candidate to resume from that
                point.
              </Typography>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center gap-3 opacity-50 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
            <AlertCircle size={32} />
            <Typography
              variant="body5"
              className="italic font-medium text-center px-8"
            >
              No attempt data found for this user. They might not have started
              the interview yet.
            </Typography>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-border/50 pt-7">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={resetting}
            className="px-6 font-bold uppercase tracking-widest text-[11px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            color="primary"
            onClick={handleReset}
            disabled={resetting || !data || selectedSubjects.length === 0}
            className="min-w-[160px] font-black uppercase tracking-widest text-[11px] h-11"
          >
            {resetting ? (
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Unlocking...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Unlock size={14} />
                Unlock {selectedSubjects.length} Subject
                {selectedSubjects.length !== 1 ? "s" : ""}
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
