"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@components/ui-elements/Button";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Plus, RefreshCcw } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { RuleTable } from "./components/RuleTable";
import { RuleModal } from "./components/RuleModal";
import {
  paperAssignmentsApi,
  AutoAssignmentRuleResponse,
} from "@lib/api/paper-assignments";
import { toast } from "@lib/toast";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { Pagination } from "@components/ui-elements/Pagination";

export default function AutoAssignmentDashboard() {
  const [rules, setRules] = useState<AutoAssignmentRuleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] =
    useState<AutoAssignmentRuleResponse | null>(null);
  const [dateFilter, setDateFilter] = useState<{
    range?: { from?: string; to?: string };
    label?: string;
  }>({ label: "All Time" });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRules = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const dateFrom = dateFilter.range?.from;
      const dateTo = dateFilter.range?.to;
      const assignedDate =
        !dateFrom && !dateTo
          ? dateFilter.label === "Today"
            ? new Date().toISOString().split("T")[0]
            : undefined
          : undefined;

      const response = await paperAssignmentsApi.getAutoRules({
        assigned_date: assignedDate,
        date_from: dateFrom,
        date_to: dateTo,
        page: currentPage,
        limit: pageSize,
      });
      setRules(response.data);
      setTotalItems(response.pagination.total_records);
      setTotalPages(response.pagination.total_pages);
    } catch {
      toast.error("Failed to fetch rules");
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleEdit = (rule: AutoAssignmentRuleResponse) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleDateFilterChange = (
    range: { from: string; to: string } | null,
    label: string,
  ) => {
    setCurrentPage(1);
    setDateFilter({ range: range || undefined, label });
  };

  return (
    <>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <RefreshCcw size={18} />
            </div>
            Auto Assignment
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <DateRangePicker
              onRangeChange={handleDateFilterChange}
              initialLabel={dateFilter.label || "All Time"}
              className="w-64 font-medium"
            />
            <div className="h-6 w-px bg-border mx-1" />
            <Tooltip content="Refresh Dashboard" side="top">
              <Button
                variant="action"
                color="default"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-180"
                onClick={fetchRules}
              >
                <RefreshCcw size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Configure New Rule" side="top">
              <Button
                variant="action"
                color="primary"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-90"
                onClick={() => {
                  setEditingRule(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus size={20} />
              </Button>
            </Tooltip>
          </div>
        }
        bodyClassName="p-0 flex flex-col h-full"
        className="flex-1 overflow-hidden"
      >
        <div className="flex-1 overflow-auto">
          <RuleTable
            rules={rules}
            isLoading={isLoading}
            onEdit={handleEdit}
            onRefresh={fetchRules}
          />
        </div>
        {!isLoading && totalItems > 0 && (
          <div className="border-t border-border bg-slate-50/30 dark:bg-slate-900/30 shrink-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </MainCard>
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingRule(null);
          fetchRules();
        }}
        editingRule={editingRule}
      />
    </>
  );
}
