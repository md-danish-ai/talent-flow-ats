import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Classification } from "@lib/api/classifications";

interface PassageFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string | number | undefined;
  onSubjectFilterChange: (value: string | number | undefined) => void;
  subjects: Classification[];
  examLevelFilter: string | number | undefined;
  onExamLevelFilterChange: (value: string | number | undefined) => void;
  examLevels: Classification[];
  marksFilter: string | number | undefined;
  onMarksFilterChange: (value: string | number | undefined) => void;
  statusFilter: string | number | undefined;
  onStatusFilterChange: (value: string | number | undefined) => void;
  onReset: () => void;
}

export const PassageFilters: React.FC<PassageFiltersProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  subjects,
  examLevelFilter,
  onExamLevelFilterChange,
  examLevels,
  marksFilter,
  onMarksFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}) => {
  return (
    <InlineDrawer isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
        <div className="space-y-3">
          <Typography
            variant="body5"
            weight="bold"
            className="uppercase tracking-widest text-muted-foreground"
          >
            Search Questions
          </Typography>
          <div className="relative group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors"
              size={18}
            />
            <Input
              placeholder="Search by keyword..."
              className="pl-11 h-12 border-border/60 hover:border-border focus:border-brand-primary transition-all bg-muted/20"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Typography
            variant="body5"
            weight="bold"
            className="uppercase tracking-widest text-muted-foreground"
          >
            By Subject
          </Typography>
          <SelectDropdown
            placeholder="All Subjects"
            options={[
              { id: "all", label: "All Subjects" },
              ...(subjects.map((s) => ({ id: s.code, label: s.name })) || []),
            ]}
            value={subjectFilter || "all"}
            onChange={onSubjectFilterChange}
            className="h-12 border-border/60 hover:border-border bg-muted/20"
            placement="bottom"
          />
        </div>

        <div className="space-y-3">
          <Typography
            variant="body5"
            weight="bold"
            className="uppercase tracking-widest text-muted-foreground"
          >
            Exam Level
          </Typography>
          <SelectDropdown
            placeholder="All Levels"
            options={[
              { id: "all", label: "All Levels" },
              ...(examLevels.map((e) => ({ id: e.code, label: e.name })) || []),
            ]}
            value={examLevelFilter || "all"}
            onChange={onExamLevelFilterChange}
            className="h-12 border-border/60 hover:border-border bg-muted/20"
            placement="bottom"
          />
        </div>

        <div className="space-y-3">
          <Typography
            variant="body5"
            weight="bold"
            className="uppercase tracking-widest text-muted-foreground"
          >
            By Marks
          </Typography>
          <SelectDropdown
            placeholder="All Marks"
            options={[
              { id: "all", label: "All Marks" },
              ...Array.from({ length: 10 }, (_, i) => ({
                id: String(i + 1),
                label: `${i + 1} Mark${i > 0 ? "s" : ""}`,
              })),
            ]}
            value={marksFilter || "all"}
            onChange={onMarksFilterChange}
            className="h-12 border-border/60 hover:border-border bg-muted/20"
            placement="top"
          />
        </div>

        <div className="space-y-3">
          <Typography
            variant="body5"
            weight="bold"
            className="uppercase tracking-widest text-muted-foreground"
          >
            By Status
          </Typography>
          <SelectDropdown
            placeholder="All Status"
            options={[
              { id: "all", label: "All Status" },
              { id: "true", label: "Active" },
              { id: "false", label: "Inactive" },
            ]}
            value={statusFilter || "all"}
            onChange={onStatusFilterChange}
            className="h-12 border-border/60 hover:border-border bg-muted/20"
            placement="top"
          />
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            color="primary"
            size="md"
            shadow
            animate="scale"
            iconAnimation="rotate-360"
            startIcon={<RotateCcw size={18} />}
            onClick={onReset}
            className="font-bold w-full"
            title="Reset Filters"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </InlineDrawer>
  );
};
