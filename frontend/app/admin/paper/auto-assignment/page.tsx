"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { Button } from "@components/ui-elements/Button";
import { Plus, RefreshCcw } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { RuleTable } from "./components/RuleTable";
import { RuleModal } from "./components/RuleModal";
import { StatsCards } from "./components/StatsCards";
import {
  paperAssignmentsApi,
  AutoAssignmentRuleResponse,
} from "@lib/api/paper-assignments";
import { toast } from "@lib/toast";
import { DatePicker } from "@components/ui-elements/DatePicker";

export default function AutoAssignmentDashboard() {
  const [rules, setRules] = useState<AutoAssignmentRuleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] =
    useState<AutoAssignmentRuleResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchRules = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await paperAssignmentsApi.getAutoRules(selectedDate);
      setRules(response);
    } catch {
      toast.error("Failed to fetch rules");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const firstMountRef = React.useRef(true);
  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      fetchRules();
    }
  }, [fetchRules]);

  const handleEdit = (rule: AutoAssignmentRuleResponse) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const activeRulesCount = rules.filter((r) => r.is_active).length;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Auto-Assignment Dashboard"
        description="Manage rules and paper pools for automatic sequential distribution."
        className="mb-0"
        action={
          <div className="flex gap-4">
            <Button
              variant="outline"
              color="secondary"
              onClick={fetchRules}
              className="px-3"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              color="primary"
              onClick={() => {
                setEditingRule(null);
                setIsModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Configure New Rule
            </Button>
          </div>
        }
      />

      <StatsCards
        totalRules={rules.length}
        activeRules={activeRulesCount}
        assignmentsToday={0} // We can integrate a real count if API supports it later
        isLoading={isLoading}
      />

      <MainCard
        title={
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-brand-primary" />
            Configured Rules
          </div>
        }
        action={
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            className="w-52"
          />
        }
        bodyClassName="p-0"
        className="flex-1 overflow-hidden"
      >
        <RuleTable
          rules={rules}
          isLoading={isLoading}
          onEdit={handleEdit}
          onRefresh={fetchRules}
        />
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
    </div>
  );
}
