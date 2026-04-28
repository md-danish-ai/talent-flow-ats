import { UserCheck, Eye, Phone, ShieldCheck, Calendar } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Avatar } from "@components/ui-elements/Avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui-elements/Table";
import { EvaluationTask } from "@types";

interface UserListProps {
  tasks: EvaluationTask[];
  onEvaluate: (task: EvaluationTask) => void;
}

export function UserList({ tasks, onEvaluate }: UserListProps) {
  return (
    <div className="flex flex-col space-y-2">
      {tasks.length === 0 ? (
        <EmptyState
          variant="database"
          title="No users found"
          description="You don't have any assigned users in this category."
        />
      ) : (
        <Table>
      <TableHeader className="bg-muted/30">
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Grade</TableHead>
          <TableHead>Verdict</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow
            key={task.id}
            className="hover:bg-muted/20 transition-colors"
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar name={task.candidate_name} variant="brand" size="sm" />
                <div className="flex flex-col">
                  <span className="font-bold text-[13px] uppercase tracking-tight">
                    {task.candidate_name}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Phone size={10} /> {task.candidate_mobile}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant="outline"
                shape="square"
                color={task.status === "completed" ? "success" : "warning"}
                className="uppercase tracking-widest text-[9px] font-black"
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {task.overall_grade ? (
                <Badge
                  variant="outline"
                  shape="square"
                  color={
                    task.overall_grade.toLowerCase() === "excellent"
                      ? "success"
                      : task.overall_grade.toLowerCase() === "good"
                        ? "blue"
                        : task.overall_grade.toLowerCase() === "average"
                          ? "warning"
                          : "error"
                  }
                  className="font-bold uppercase"
                >
                  {task.overall_grade}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {task.verdict_name ? (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]">
                  <ShieldCheck size={14} />
                  {task.verdict_name}
                </div>
              ) : (
                <span className="text-muted-foreground italic text-xs">
                  Pending Decision
                </span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(task.created_at).toLocaleDateString()}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <TableIconButton
                  title="View Results"
                  iconColor="amber"
                  btnSize="sm"
                >
                  <Eye size={18} />
                </TableIconButton>
                <TableIconButton
                  title={
                    task.status === "completed"
                      ? "View Evaluation"
                      : "Start Evaluation"
                  }
                  iconColor="brand"
                  btnSize="sm"
                  onClick={() => onEvaluate(task)}
                >
                  <UserCheck size={18} />
                </TableIconButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      )}
    </div>
  );
}
