import React, { useState, useEffect } from "react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import {
  ArrowLeft,
  FileText,
  PlusCircle,
  Loader2,
  BookOpen,
  Layers,
  Trophy,
  Clock,
  FileStack,
} from "lucide-react";
import { AddContentModal } from "./AddContentModal";
import { papersApi, PaperSetup } from "@lib/api/papers";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { toast } from "@lib/toast";

interface PaperSetupDetailProps {
  paperId: number;
  onBack: () => void;
}

export const PaperSetupDetail: React.FC<PaperSetupDetailProps> = ({
  paperId,
  onBack,
}) => {
  const [paper, setPaper] = useState<PaperSetup | null>(null);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubjectForAdd, setSelectedSubjectForAdd] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [paperData, subjectsData] = await Promise.all([
          papersApi.getPaperById(paperId),
          classificationsApi.getClassifications({
            type: "subject",
            limit: 100,
          }),
        ]);
        setPaper(paperData);
        setSubjects(subjectsData.data);
      } catch (error) {
        console.error("Failed to fetch details:", error);
        toast.error("Failed to load paper details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paperId]);

  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : `Subject ${subjectId}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
        <Typography variant="h4" className="text-muted-foreground">
          Paper not found or failed to load.
        </Typography>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative rounded-[2rem] border border-border/60 bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              className="rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              <ArrowLeft size={18} />
            </Button>
            <div className="h-6 w-[1px] bg-border/60 mx-1" />
            <div>
              <Typography
                variant="body2"
                weight="black"
                className="tracking-tight text-foreground/90 flex items-center gap-2"
              >
                Paper Overview
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground/70 uppercase tracking-[0.2em] font-black text-[9px]"
              >
                Configured Assessment Structure
              </Typography>
            </div>
          </div>
          <div className="hidden md:block">
            <Button
              variant="primary"
              color="primary"
              size="sm"
              shadow
              animate="scale"
              startIcon={<FileStack size={16} />}
              className="font-black text-[10px] tracking-widest uppercase border-none px-6 rounded-xl"
            >
              VIEW FULL PAPER SET
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<Layers className="text-emerald-600" />}
              label="Department"
              value={paper.department_name || "N/A"}
              bgColor="bg-emerald-50/30 dark:bg-emerald-500/5"
              borderColor="border-emerald-500/10"
              labelColor="text-emerald-600/60"
            />
            <StatsCard
              icon={<BookOpen className="text-blue-600" />}
              label="Paper Name"
              value={paper.paper_name}
              bgColor="bg-blue-50/30 dark:bg-blue-500/5"
              borderColor="border-blue-500/10"
              labelColor="text-blue-600/60"
            />
            <StatsCard
              icon={<Trophy className="text-amber-600" />}
              label="Total Marks"
              value={`${Number(paper.total_marks).toFixed(2)} pts`}
              bgColor="bg-amber-50/30 dark:bg-amber-500/5"
              borderColor="border-amber-500/10"
              labelColor="text-amber-600/60"
            />
            <StatsCard
              icon={<Clock className="text-brand-primary" />}
              label="Duration"
              value={paper.total_time || "N/A"}
              bgColor="bg-brand-primary/5 dark:bg-brand-primary/10"
              borderColor="border-brand-primary/10"
              labelColor="text-brand-primary/60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 relative group/desc transition-all duration-300 hover:border-brand-primary/20">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm z-10">
                <FileText size={12} className="text-brand-primary" />
                <Typography
                  variant="body5"
                  weight="black"
                  className="text-muted-foreground uppercase tracking-widest text-[9px]"
                >
                  Description of Paper
                </Typography>
              </div>
              <Typography
                variant="body4"
                className="leading-relaxed text-foreground/70 font-medium italic"
              >
                &quot;{paper.description}&quot;
              </Typography>
            </div>

            <div className="md:col-span-4 p-6 rounded-2xl bg-brand-primary/[0.03] border border-brand-primary/10 flex flex-col justify-center items-center text-center relative overflow-hidden group/level">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <Layers size={80} />
              </div>
              <Typography
                variant="body5"
                weight="black"
                className="text-brand-primary/60 uppercase tracking-[0.2em] mb-1 z-10"
              >
                Test Competency
              </Typography>
              <Typography
                variant="h2"
                weight="black"
                className="text-slate-900 dark:text-slate-100 z-10"
              >
                {paper.test_level_name || "General"}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 ml-2">
          <div className="h-6 w-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_theme(colors.brand-primary/40%)]" />
          <Typography
            variant="body4"
            weight="black"
            className="text-slate-900 dark:text-slate-200 uppercase tracking-[0.2em] text-[11px]"
          >
            Question Assignment Panel
          </Typography>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border/60 to-transparent" />
        </div>

        <div className="border border-border rounded-[1.5rem] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-950">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-border">
              <TableRow className="hover:bg-transparent h-14">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="text-center w-[80px] font-bold">
                  Sr. No.
                </TableHead>
                <TableHead className="font-bold">Subject</TableHead>
                <TableHead className="font-bold">
                  Total Selected Questions
                </TableHead>
                <TableHead className="font-bold">Question Count</TableHead>
                <TableHead className="font-bold">Question Marks</TableHead>
                <TableHead className="w-[100px] text-center font-bold">
                  Order
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...paper.subject_ids_data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((config, index: number) => (
                  <TableCollapsibleRow
                    key={config.id || index}
                    colSpan={7}
                    className={cn(
                      "group/row transition-all duration-300",
                      expandedSubjectId === config.subject_id
                        ? "bg-slate-50/80 dark:bg-slate-900/40"
                        : "",
                    )}
                    isOpen={expandedSubjectId === config.subject_id}
                    onOpenChange={(open) =>
                      setExpandedSubjectId(open ? config.subject_id : null)
                    }
                    expandedContent={
                      <div className="bg-white dark:bg-slate-950 border-t border-border shadow-inner">
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-border flex justify-between items-center px-8">
                          <Typography
                            variant="body5"
                            weight="bold"
                            className="text-muted-foreground italic"
                          >
                            Select questions from the list below to assign them
                            to this subject.
                          </Typography>
                          <Button
                            variant="primary"
                            size="sm"
                            startIcon={<PlusCircle size={16} />}
                            className="bg-brand-primary hover:bg-brand-primary/90 border-none h-9 px-6 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-primary/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubjectForAdd(
                                getSubjectName(config.subject_id),
                              );
                              setIsAddModalOpen(true);
                            }}
                          >
                            ADD CONTENT
                          </Button>
                        </div>
                        <Table>
                          <TableHeader className="bg-slate-100 dark:bg-slate-800/50 border-none">
                            <TableRow className="border-b-0 h-11 hover:bg-transparent">
                              <TableHead className="text-slate-500 font-black uppercase tracking-wider text-[10px] text-center w-[80px] pl-8">
                                No.
                              </TableHead>
                              <TableHead className="text-slate-500 font-black uppercase tracking-wider text-[10px]">
                                Questions
                              </TableHead>
                              <TableHead className="text-slate-500 font-black uppercase tracking-wider text-[10px] text-center w-[120px] pr-8">
                                Select
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center py-8 text-muted-foreground italic"
                              >
                                No questions assigned to this subject yet.
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    }
                  >
                    <TableCell className="text-center pl-6 h-20">
                      <div className="flex flex-col items-center justify-center">
                        <Typography
                          variant="body5"
                          weight="black"
                          className="text-slate-400 dark:text-slate-600"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </Typography>
                        <div className="w-4 h-[2px] bg-slate-100 dark:bg-slate-800 mt-1 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell className="font-extrabold text-brand-primary hover:text-brand-hover cursor-pointer transition-all">
                      {getSubjectName(config.subject_id)}
                    </TableCell>
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          shape="square"
                          color="primary"
                          className="font-black text-[10px] px-3 py-1 border-brand-primary/20"
                        >
                          0 / {config.question_count}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-slate-500">
                      {config.question_count}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body4"
                        weight="black"
                        className="text-slate-900 dark:text-slate-100"
                      >
                        {config.total_marks.toFixed(2)}
                        <span className="ml-1 text-[10px] text-muted-foreground/60 font-medium">
                          PTS
                        </span>
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center pr-8">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-[-4px] rounded-full border border-brand-primary/10 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500" />
                        <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-brand-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-900/20 dark:shadow-brand-primary/20 transition-transform duration-300 group-hover/row:scale-110">
                          {config.order}
                        </div>
                      </div>
                    </TableCell>
                  </TableCollapsibleRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isAddModalOpen && selectedSubjectForAdd && (
        <AddContentModal
          subjectName={selectedSubjectForAdd}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(ids) => {
            console.log("Selected Question IDs:", ids);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const StatsCard = ({
  icon,
  label,
  value,
  bgColor,
  borderColor,
  labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  borderColor: string;
  labelColor: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
      bgColor,
      borderColor,
    )}
  >
    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
      <Typography
        variant="body5"
        weight="black"
        className={cn("uppercase tracking-widest text-[9px]", labelColor)}
      >
        {label}
      </Typography>
      <Typography
        variant="body3"
        weight="black"
        className="text-slate-900 dark:text-slate-100"
      >
        {value}
      </Typography>
    </div>
  </div>
);
