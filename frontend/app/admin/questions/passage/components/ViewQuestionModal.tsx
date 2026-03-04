"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { questionsApi, type Question } from "@lib/api/questions";
import { cn } from "@lib/utils";
import { 
  FileText, 
  HelpCircle, 
  BookOpen, 
  MessageSquareText, 
  Loader2,
  Calendar,
  Layers,
  Tag,
  Trophy
} from "lucide-react";

interface ViewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
}

export const ViewQuestionModal = ({
  isOpen,
  onClose,
  questionId,
}: ViewQuestionModalProps) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && questionId) {
      const fetchQuestion = async () => {
        setLoading(true);
        try {
          const q = await questionsApi.getQuestion(questionId);
          setQuestion(q);
        } catch (error) {
          console.error("Failed to fetch question details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [isOpen, questionId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Question Details"
    >
      <div className="py-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            <Typography variant="body3" className="text-muted-foreground animate-pulse">
              Retrieving question details...
            </Typography>
          </div>
        ) : question ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge icon={<Tag size={14}/>} label={question.subject?.name} color="blue" />
              <Badge icon={<Layers size={14}/>} label={question.exam_level?.name} color="purple" />
              <Badge icon={<Trophy size={14}/>} label={`${question.marks} Marks`} color="orange" />
              <Badge icon={<Calendar size={14}/>} label={question.created_at ? new Date(question.created_at).toLocaleDateString() : ""} color="slate" />
            </div>

            {/* Passage Section */}
            <Section 
              title="Passage / Paragraph" 
              icon={<FileText size={18} className="text-brand-primary" />}
              bgColor="bg-brand-primary/5"
            >
              <div className="bg-muted/30 rounded-xl p-5 border border-border/50 max-h-[300px] overflow-y-auto">
                <Typography variant="body4" className="leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {question.passage}
                </Typography>
              </div>
            </Section>

            {/* Question Text Section */}
            <Section 
              title="Question Text" 
              icon={<HelpCircle size={18} className="text-brand-primary" />}
              bgColor="bg-brand-primary/5"
            >
              <Typography variant="h5" weight="semibold" className="text-foreground pl-1">
                {question.question_text}
              </Typography>
            </Section>

            {/* Answer Section */}
            <Section 
              title="Expected Answer" 
              icon={<BookOpen size={18} className="text-emerald-500" />}
              bgColor="bg-emerald-500/5"
            >
              <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/10">
                <Typography variant="body4" className="leading-relaxed text-foreground font-medium">
                  {question.answer?.answer_text}
                </Typography>
              </div>
            </Section>

            {/* Explanation Section */}
            {question.answer?.explanation && (
              <Section 
                title="Explanation" 
                icon={<MessageSquareText size={18} className="text-brand-primary" />}
                bgColor="bg-brand-primary/5"
              >
                <div className="bg-brand-primary/5 rounded-xl p-5 border border-brand-primary/10 italic">
                  <Typography variant="body4" className="text-muted-foreground leading-relaxed">
                    {question.answer.explanation}
                  </Typography>
                </div>
              </Section>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Typography variant="body3" className="text-red-500">
              Error: Could not load question details.
            </Typography>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Helper Components
const Badge = ({ icon, label, color }: { icon: React.ReactNode, label?: string, color: string }) => {
  if (!label) return null;
  const colors = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/10",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/10",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/10",
    slate: "bg-slate-500/10 text-slate-600 border-slate-500/10",
  };
  return (
    <div className={cn("px-3 py-1.5 rounded-full border flex items-center gap-2", colors[color as keyof typeof colors])}>
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
};

const Section = ({ title, icon, children, bgColor }: { title: string, icon: React.ReactNode, children: React.ReactNode, bgColor: string }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2.5">
      <div className={cn("p-1.5 rounded-lg", bgColor)}>
        {icon}
      </div>
      <Typography variant="body3" weight="bold" className="text-foreground tracking-tight">
        {title}
      </Typography>
    </div>
    {children}
  </div>
);
