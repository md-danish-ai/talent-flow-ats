"use client";

import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Loader2 } from "lucide-react";
import { PaperHeaderCard } from "../components/PaperHeaderCard";
import { SubjectAssignmentCard } from "../components/SubjectAssignmentCard";
import { useAutoAssign } from "./useAutoAssign";

interface AutoAssignClientProps {
  id: number;
}

export function AutoAssignClient({ id }: AutoAssignClientProps) {
  const {
    paper,
    questionTypes,
    subjects,
    isLoading,
    isSaving,
    requirements,
    availableCounts,
    collapsedSubjects,
    toggleSubject,
    getSubjectTotal,
    getSubjectMarksTotal,
    getSubjectCode,
    handleQtyChange,
    handleAutoAssign,
  } = useAutoAssign(id);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-brand-primary animate-spin" />
          <Typography
            variant="body3"
            className="text-muted-foreground animate-pulse font-bold tracking-widest uppercase"
          >
            Preparing Intelligence Engine...
          </Typography>
        </div>
      </div>
    );
  }

  if (!paper) return null;

  return (
    <PageContainer animate>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <PaperHeaderCard paper={paper} />

        <div className="grid grid-cols-1 gap-8">
          {paper.subject_ids_data.map((subj) => {
            const subjCode = getSubjectCode(subj.subject_id);
            const counts = availableCounts[subjCode] || {};
            const subjectReqs = requirements[subjCode] || {};
            const isCollapsed = collapsedSubjects[subjCode];
            const currentTotal = getSubjectTotal(subjCode);
            const currentMarksTotal = getSubjectMarksTotal(subjCode);

            return (
              <SubjectAssignmentCard
                key={subj.id || subj.subject_id}
                subj={subj}
                subjCode={subjCode}
                counts={counts}
                subjectReqs={subjectReqs}
                isCollapsed={isCollapsed}
                currentTotal={currentTotal}
                currentMarksTotal={currentMarksTotal}
                questionTypes={questionTypes}
                paperId={paper.id}
                isSaving={isSaving}
                subjects={subjects}
                onToggle={() => toggleSubject(subjCode)}
                onQtyChange={handleQtyChange}
                onAutoAssign={handleAutoAssign}
              />
            );
          })}
        </div>

        <div className="pb-20" />
      </div>
    </PageContainer>
  );
}
