"use client";

import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PaperHeaderCard } from "../components/PaperHeaderCard";
import { SubjectAssignmentCard } from "../components/SubjectAssignmentCard";
import { useAutoAssign } from "./useAutoAssign";
import { AutoAssignSkeleton } from "@components/ui-skeleton/AutoAssignSkeleton";

interface AutoAssignClientProps {
  id: number;
}

export function AutoAssignClient({ id }: AutoAssignClientProps) {
  const {
    paper,
    questionTypes,
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
      <PageContainer animate>
        <AutoAssignSkeleton />
      </PageContainer>
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
                onToggle={() => toggleSubject(subjCode)}
                onQtyChange={handleQtyChange}
                onAutoAssign={() => handleAutoAssign(subjCode)}
              />
            );
          })}
        </div>

        <div className="pb-20" />
      </div>
    </PageContainer>
  );
}
