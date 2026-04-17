"use client";
import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui-elements/Table";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Edit2, Trash2, Layers, Calendar } from "lucide-react";
import {
  AutoAssignmentRuleResponse,
  paperAssignmentsApi,
} from "@lib/api/paper-assignments";
import { toast } from "@lib/toast";

interface RuleTableProps {
  rules: AutoAssignmentRuleResponse[];
  isLoading: boolean;
  onEdit: (rule: AutoAssignmentRuleResponse) => void;
  onRefresh: () => void;
}

export function RuleTable({
  rules,
  isLoading,
  onEdit,
  onRefresh,
}: RuleTableProps) {
  const handleDelete = async (ruleId: number) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      await paperAssignmentsApi.deleteAutoRule(ruleId);
      toast.success("Rule deleted successfully");
      onRefresh();
    } catch {
      toast.error("Failed to delete rule");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase tracking-wider">
            Sr. No.
          </TableHead>
          <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
            Assignment Target
          </TableHead>
          <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
            Active Date
          </TableHead>
          <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
            Papers in Pool
          </TableHead>
          <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
            Status
          </TableHead>
          <TableHead className="w-[100px] text-center font-bold text-slate-500 text-xs uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-32 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                Fetching rules...
              </div>
            </TableCell>
          </TableRow>
        ) : rules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center bg-muted/5">
              <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                <Layers size={32} />
                <Typography variant="body4" weight="medium" className="italic">
                  No auto-assignment rules found for the selected date.
                </Typography>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          rules.map((row, idx) => (
            <TableRow
              key={row.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
            >
              <TableCell className="font-medium text-center align-middle">
                {idx + 1}
              </TableCell>
              <TableCell className="align-middle">
                <div className="flex flex-col gap-0.5">
                  <Typography
                    variant="body4"
                    weight="bold"
                    className="text-slate-900 dark:text-white uppercase"
                  >
                    {row.department_name}
                  </Typography>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Layers className="h-3 w-3" />
                    <Typography
                      variant="body5"
                      weight="bold"
                      className="uppercase tracking-tight opacity-70"
                    >
                      {row.test_level_name}
                    </Typography>
                  </div>
                </div>
              </TableCell>
              <TableCell className="align-middle text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-border">
                  <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                  <Typography variant="body4" weight="bold">
                    {new Date(row.assigned_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </div>
              </TableCell>
              <TableCell className="align-middle">
                <div className="flex flex-wrap gap-1.5">
                  {row.paper_names && row.paper_names.length > 0 ? (
                    <div className="flex gap-1.5 flex-wrap">
                      {row.paper_names.map((name, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          color="primary"
                          shape="square"
                          className="text-[10px] font-bold py-1 px-2 border-brand-primary/20 bg-brand-primary/5"
                        >
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge variant="fill" color="error" shape="square">
                      EMPTY POOL
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="align-middle text-center">
                <Badge
                  variant="outline"
                  color={row.is_active ? "success" : "default"}
                  shape="square"
                  className="text-[10px] font-black uppercase tracking-widest px-3"
                  animate={row.is_active ? "pulse" : "none"}
                >
                  {row.is_active ? "Running" : "Paused"}
                </Badge>
              </TableCell>
              <TableCell className="align-middle text-center">
                <div className="flex items-center justify-center gap-1">
                  <TableIconButton
                    iconColor="blue"
                    title="Edit Rule"
                    onClick={() => onEdit(row)}
                  >
                    <Edit2 size={16} />
                  </TableIconButton>
                  <TableIconButton
                    iconColor="red"
                    title="Delete Rule"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 size={16} />
                  </TableIconButton>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
