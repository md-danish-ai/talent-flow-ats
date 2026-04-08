"use client";

import React, { useState, useEffect, useCallback } from "react";

import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Loader2 } from "lucide-react";
import { papersApi, PaperSetup, PaperSubjectConfig } from "@lib/api/papers";
import { questionsApi, Question } from "@lib/api/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { toast } from "@lib/toast";

import { PaperHeaderCard } from "../components/PaperHeaderCard";
import { SubjectAssignmentCard } from "../components/SubjectAssignmentCard";

interface AutoAssignClientProps {
  id: number;
}

export function AutoAssignClient({ id }: AutoAssignClientProps) {

  const [paper, setPaper] = useState<PaperSetup | null>(null);
  const [questionTypes, setQuestionTypes] = useState<Classification[]>([]);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State: { [subjectCode]: { [typeCode]: quantity } }
  const [requirements, setRequirements] = useState<
    Record<string, Record<string, number>>
  >({});
  // State: { [subjectCode]: { [typeCode]: availableCount } }
  const [availableCounts, setAvailableCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  // Track collapsed subjects: { [subjCode]: isCollapsed }
  const [collapsedSubjects, setCollapsedSubjects] = useState<
    Record<string, boolean>
  >({});

  const toggleSubject = (subjCode: string) => {
    setCollapsedSubjects((prev) => ({
      ...prev,
      [subjCode]: !prev[subjCode],
    }));
  };

  const getSubjectTotal = useCallback(
    (subjCode: string) => {
      const reqs = requirements[subjCode] || {};
      return Object.values(reqs).reduce((sum, val) => sum + val, 0);
    },
    [requirements],
  );

  const getSubjectCode = useCallback(
    (subjectId: number) => {
      const subject = subjects.find((s) => s.id === subjectId);
      return subject?.code || subjectId.toString();
    },
    [subjects],
  );

  const fetchData = useCallback(async (showLoader: boolean = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const [paperRes, typesRes, subjectsRes] = await Promise.all([
        papersApi.getPaperById(id),
        classificationsApi.getClassifications({
          type: "question_type",
          is_active: true,
          limit: 100,
        }),
        classificationsApi.getClassifications({
          type: "subject",
          is_active: true,
          limit: 100,
        }),
      ]);

      setPaper(paperRes);
      setQuestionTypes(typesRes.data || []);
      setSubjects(subjectsRes.data || []);

      // Fetch availability for each subject - using codes from subjectsRes
      const countsMap: Record<string, Record<string, number>> = {};
      const initialReqs: Record<string, Record<string, number>> = {};

      await Promise.all(
        paperRes.subject_ids_data.map(async (subj: PaperSubjectConfig) => {
          const subject = subjectsRes.data.find(
            (s: Classification) => s.id === subj.subject_id,
          );
          const subjCode = subject?.code || subj.subject_id.toString();

          const counts = await questionsApi.getQuestionTypeCounts(
            subjCode,
            paperRes.test_level_id,
          );
          countsMap[subjCode] = counts || {};
          initialReqs[subjCode] = {};
        }),
      );

      // Analyze existing questions in the paper to prepopulate 'requirements' correctly
      if (paperRes.question_id && paperRes.question_id.length > 0) {
        try {
            const existingQuestionsResponse = await questionsApi.getQuestionsByIds(paperRes.question_id);
            const existingResponse = existingQuestionsResponse as object;
            const existingQuestions = Array.isArray(existingQuestionsResponse) 
                ? existingQuestionsResponse 
                : (existingResponse && 'data' in existingResponse ? (existingResponse as { data: unknown[] }).data : []);
            
            if (Array.isArray(existingQuestions)) {
               existingQuestions.forEach((qItem: unknown) => {
                  const q = qItem as Question;
                  const subjCode = q.subject?.code;
                  const typeCode = q.question_type?.code;
                  if (subjCode && typeCode) {
                     if (!initialReqs[subjCode]) initialReqs[subjCode] = {};
                     initialReqs[subjCode][typeCode] = (initialReqs[subjCode][typeCode] || 0) + 1;
                  }
               });
            }
        } catch (e) {
            console.error("Failed to load existing questions state", e);
        }
      }

      setAvailableCounts(countsMap);
      setRequirements(initialReqs);

      // Default state: All subject cards COLLAPSED
      const initialCollapse: Record<string, boolean> = {};
      paperRes.subject_ids_data.forEach((subj) => {
        const matchingSubject = subjectsRes.data.find(
          (s: Classification) => s.id === subj.subject_id,
        );
        const subjCode = matchingSubject?.code || subj.subject_id.toString();
        initialCollapse[subjCode] = true; // All collapsed by default
      });
      setCollapsedSubjects(initialCollapse);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load paper details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const handleQtyChange = (
    subjectCode: string,
    typeCode: string,
    val: number,
  ) => {
    setRequirements((prev) => ({
      ...prev,
      [subjectCode]: {
        ...prev[subjectCode],
        [typeCode]: Math.max(0, val),
      },
    }));
  };

  const handleAutoAssign = async () => {
    if (!paper) return;

    try {
      setIsSaving(true);
      let newGeneratedIds: number[] = [];
      let totalWarnings: string[] = [];
      
      // Track which subjects are being generated so we can replace ONLY their questions
      const generatingSubjectCodes = new Set<string>();

      for (const subj of paper.subject_ids_data) {
        const subjCode = getSubjectCode(subj.subject_id);
        const reqs = requirements[subjCode];

        const activeReqs = Object.entries(reqs || {})
          .filter(([, count]) => count > 0)
          .map(([typeCode, count]) => ({ type_code: typeCode, count }));

        if (activeReqs.length > 0) {
          generatingSubjectCodes.add(subjCode);
          const response = await questionsApi.autoGenerateQuestions({
            subject_code: subjCode,
            exam_level: paper.test_level_id,
            requirements: activeReqs,
          });

          newGeneratedIds = [...newGeneratedIds, ...response.question_ids];
          if (response.warnings) {
            totalWarnings = [
              ...totalWarnings,
              ...response.warnings.map(
                (w) => `${subj.subject_name || subjCode}: ${w}`,
              ),
            ];
          }
        }
      }

      if (newGeneratedIds.length === 0) {
        toast.error(
          "No questions were generated. Please check your quantities.",
        );
        return;
      }

      let retainedIds: number[] = paper.question_id || [];

      // Remove existing questions belonging to the subjects we just generated
      if (retainedIds.length > 0 && generatingSubjectCodes.size > 0) {
         try {
             const existingQuestions = await questionsApi.getQuestionsByIds(retainedIds);
             const existingResponse = existingQuestions as object;
             const questionsArray = Array.isArray(existingQuestions) 
                ? existingQuestions 
                : (existingResponse && 'data' in existingResponse ? (existingResponse as { data: typeof existingQuestions }).data : []);
             
             if (Array.isArray(questionsArray)) {
               retainedIds = questionsArray
                   .filter(q => {
                       const qSubjCode = q.subject?.code;
                       if (qSubjCode && generatingSubjectCodes.has(qSubjCode)) {
                          return false; // Replace this subject's old questions
                       }
                       return true; // Keep other subjects' questions
                   })
                   .map(q => q.id);
             }
         } catch(e) {
             console.error("Failed to filter existing questions.", e);
         }
      }

      // Merge remaining questions with the new ones
      const finalQuestionIds = Array.from(new Set([...retainedIds, ...newGeneratedIds]));

      // Update the paper with the combined set of IDs
      await papersApi.updatePaper(paper.id, {
        question_id: finalQuestionIds,
      });

      toast.success(
        `Successfully assigned ${newGeneratedIds.length} questions!`,
      );
      if (totalWarnings.length > 0) {
        totalWarnings.forEach((w) => console.warn(w));
      }
      
      // Refresh paper state so local count is correctly updated
      await fetchData(false);
    } catch (error) {
      console.error("Failed to auto-assign:", error);
      toast.error("An error occurred while generating questions.");
    } finally {
      setIsSaving(false);
    }
  };

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

            return (
              <SubjectAssignmentCard
                key={subj.id || subj.subject_id}
                subj={subj}
                subjCode={subjCode}
                counts={counts}
                subjectReqs={subjectReqs}
                isCollapsed={isCollapsed}
                currentTotal={currentTotal}
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
