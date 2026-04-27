import { UserCheck, User, Eye } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui-elements/Table";
import { EvaluationTask } from "@types";

interface CandidateListProps {
  tasks: EvaluationTask[];
  onEvaluate: (task: EvaluationTask) => void;
}

export function CandidateList({ tasks, onEvaluate }: CandidateListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        variant="database"
        title="No candidates found"
        description="You don't have any assigned candidates in this category."
        // className="py-12"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6">Candidate</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id} className="group transition-all">
            <TableCell className="pl-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm border border-brand-primary/20">
                  <User size={20} />
                </div>
                <Typography
                  variant="body4"
                  className="font-bold uppercase tracking-tight"
                >
                  {task.candidate_name}
                </Typography>
              </div>
            </TableCell>
            <TableCell>
              <Typography
                variant="body5"
                className="text-muted-foreground font-medium"
              >
                {task.candidate_mobile}
              </Typography>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                shape="curve"
                color={task.status === "completed" ? "success" : "warning"}
                className="font-bold text-[10px] uppercase"
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right pr-6">
              <div className="flex items-center justify-end gap-2">
                <TableIconButton
                  title="View Results"
                  iconColor="amber"
                  btnSize="sm"
                >
                  <Eye size={18} />
                </TableIconButton>
                {task.status === "completed" ? (
                  <TableIconButton
                    title="View Results"
                    iconColor="brand"
                    btnSize="sm"
                    onClick={() => onEvaluate(task)}
                  >
                    <UserCheck size={18} />
                  </TableIconButton>
                ) : (
                  <TableIconButton
                    title="Start Evaluation"
                    iconColor="brand"
                    btnSize="sm"
                    onClick={() => onEvaluate(task)}
                  >
                    <UserCheck size={18} />
                  </TableIconButton>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
