"use client";

import { useState, useEffect, useCallback } from "react";
import { papersApi } from "@lib/api/papers";
import {
  PaperSetup,
  PaperSubjectConfig,
  Question,
  Classification,
} from "@types";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi } from "@lib/api/classifications";
import { toast } from "@lib/toast";

export function useAutoAssign(id: number) {
  const [paper, setPaper] = useState<PaperSetup | null>(null);
  const [questionTypes, setQuestionTypes] = useState<Classification[]>([]);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State: { [subjectCode]: { [typeCode]: { [marks]: quantity } } }
  const [requirements, setRequirements] = useState<
    Record<string, Record<string, Record<number, number>>>
  >({});
  // State: { [subjectCode]: { [typeCode]: { [marks]: availableCount } } }
  const [availableCounts, setAvailableCounts] = useState<
    Record<string, Record<string, Record<number, number>>>
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
      const typeReqs = requirements[subjCode] || {};
      let total = 0;
      Object.values(typeReqs).forEach((markReqs) => {
        Object.values(markReqs).forEach((qty) => {
          total += qty;
        });
      });
      return total;
    },
    [requirements],
  );

  const getSubjectMarksTotal = useCallback(
    (subjCode: string) => {
      const typeReqs = requirements[subjCode] || {};
      let total = 0;
      Object.values(typeReqs).forEach((markMap) => {
        Object.entries(markMap).forEach(([marksStr, qty]) => {
          total += parseInt(marksStr) * qty;
        });
      });
      return total;
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

  const fetchData = useCallback(
    async (showLoader: boolean = true) => {
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

        const activeSubjects = subjectsRes.data || [];
        setSubjects(activeSubjects);

        // Filter paper subjects to only include active ones
        const filteredSubjectData = (paperRes.subject_ids_data || []).filter(
          (ps: PaperSubjectConfig) =>
            activeSubjects.some((s: Classification) => s.id === ps.subject_id),
        );

        // Update paper object with only active subjects for this view
        const updatedPaper = {
          ...paperRes,
          subject_ids_data: filteredSubjectData,
        };

        setPaper(updatedPaper);
        setQuestionTypes(typesRes.data || []);

        // Fetch availability for each subject
        const countsMap: Record<
          string,
          Record<string, Record<number, number>>
        > = {};
        const initialReqs: Record<
          string,
          Record<string, Record<number, number>>
        > = {};

        await Promise.all(
          filteredSubjectData.map(async (subj: PaperSubjectConfig) => {
            const subject = activeSubjects.find(
              (s: Classification) => s.id === subj.subject_id,
            );
            const subjCode = subject?.code || subj.subject_id.toString();

            const countsList = await questionsApi.getQuestionTypeCounts(
              subjCode,
              paperRes.test_level_id,
            );

            countsMap[subjCode] = {};
            countsList.forEach((item) => {
              if (!countsMap[subjCode][item.type_code]) {
                countsMap[subjCode][item.type_code] = {};
              }
              countsMap[subjCode][item.type_code][item.marks] = item.count;
            });

            initialReqs[subjCode] = {};
          }),
        );

        // Analyze existing questions in the paper to prepopulate 'requirements' correctly
        if (paperRes.question_id && paperRes.question_id.length > 0) {
          try {
            const existingQuestionsResponse =
              await questionsApi.getQuestionsByIds(paperRes.question_id);
            const existingResponse = existingQuestionsResponse as object;
            const existingQuestions = Array.isArray(existingQuestionsResponse)
              ? existingQuestionsResponse
              : existingResponse && "data" in existingResponse
                ? (existingResponse as { data: unknown[] }).data
                : [];

            if (Array.isArray(existingQuestions)) {
              existingQuestions.forEach((qItem: unknown) => {
                const q = qItem as Question;
                const subjCode = q.subject?.code;
                const typeCode = q.question_type?.code;
                const marks = q.marks || 0;
                if (subjCode && typeCode) {
                  // Only add to requirements if the subject is in our filtered list
                  if (filteredSubjectData.some(fs => {
                    const s = activeSubjects.find(as => as.id === fs.subject_id);
                    return s?.code === subjCode;
                  })) {
                    if (!initialReqs[subjCode]) initialReqs[subjCode] = {};
                    if (!initialReqs[subjCode][typeCode])
                      initialReqs[subjCode][typeCode] = {};
                    initialReqs[subjCode][typeCode][marks] =
                      (initialReqs[subjCode][typeCode][marks] || 0) + 1;
                  }
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
        filteredSubjectData.forEach((subj) => {
          const matchingSubject = activeSubjects.find(
            (s: Classification) => s.id === subj.subject_id,
          );
          const subjCode = matchingSubject?.code || subj.subject_id.toString();
          initialCollapse[subjCode] = true;
        });
        setCollapsedSubjects(initialCollapse);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load paper details");
      } finally {
        setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const handleQtyChange = (
    subjectCode: string,
    typeCode: string,
    marks: number,
    val: number,
  ) => {
    setRequirements((prev) => {
      const subjReqs = prev[subjectCode] || {};
      const typeReqs = subjReqs[typeCode] || {};

      return {
        ...prev,
        [subjectCode]: {
          ...subjReqs,
          [typeCode]: {
            ...typeReqs,
            [marks]: Math.max(0, val),
          },
        },
      };
    });
  };

  const handleAutoAssign = async (targetSubjectCode?: string) => {
    if (!paper) return;

    try {
      setIsSaving(true);
      let newGeneratedIds: number[] = [];
      let totalWarnings: string[] = [];
      const generatingSubjectCodes = new Set<string>();

      // Filter subjects to only process the target one if provided
      const subjectsToProcess = targetSubjectCode
        ? paper.subject_ids_data.filter(
            (s) => getSubjectCode(s.subject_id) === targetSubjectCode,
          )
        : paper.subject_ids_data;

      for (const subj of subjectsToProcess) {
        const subjCode = getSubjectCode(subj.subject_id);
        const typeReqs = requirements[subjCode] || {};

        const activeReqs: {
          type_code: string;
          count: number;
          marks: number;
        }[] = [];
        Object.entries(typeReqs).forEach(([typeCode, markMap]) => {
          Object.entries(markMap).forEach(([marksStr, count]) => {
            if (count > 0) {
              activeReqs.push({
                type_code: typeCode,
                count,
                marks: parseInt(marksStr),
              });
            }
          });
        });

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

      if (retainedIds.length > 0 && generatingSubjectCodes.size > 0) {
        try {
          const existingQuestions =
            await questionsApi.getQuestionsByIds(retainedIds);
          const existingResponse = existingQuestions as object;
          const questionsArray = Array.isArray(existingQuestions)
            ? existingQuestions
            : existingResponse && "data" in existingResponse
              ? (existingResponse as { data: typeof existingQuestions }).data
              : [];

          if (Array.isArray(questionsArray)) {
            retainedIds = questionsArray
              .filter((q) => {
                const qSubjCode = q.subject?.code;
                return !(qSubjCode && generatingSubjectCodes.has(qSubjCode));
              })
              .map((q) => q.id);
          }
        } catch (e) {
          console.error("Failed to filter existing questions.", e);
        }
      }

      const finalQuestionIds = Array.from(
        new Set([...retainedIds, ...newGeneratedIds]),
      );

      await papersApi.updatePaper(paper.id, {
        question_id: finalQuestionIds,
      });

      toast.success(
        `Successfully assigned ${newGeneratedIds.length} questions for ${targetSubjectCode || "selected subjects"}!`,
      );
      if (totalWarnings.length > 0) {
        totalWarnings.forEach((w) => console.warn(w));
      }

      await fetchData(false);
    } catch (error) {
      console.error("Failed to auto-assign:", error);
      toast.error("An error occurred while generating questions.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}
