"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";

import { MainCard } from "@components/ui-cards/MainCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui-elements/Table";
import { Badge } from "@components/ui-elements/Badge";
import { Avatar } from "@components/ui-elements/Avatar";
import {
  Eye,
  Users,
  Calendar,
  Phone,
  ShieldCheck,
  UserMinus,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { evaluationsApi } from "@lib/api/evaluations";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { toast } from "@lib/toast";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

import { Pagination } from "@components/ui-elements/Pagination";
import { ListingIcons } from "@components/ui-elements/ListingHeaderActions";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { useListing } from "@hooks/useListing";
import { managementApi } from "@lib/api/management";
import { cn, formatDate } from "@lib/utils";
import {
  EvaluationHistoryItem,
  PaginatedResponse,
  FilterOption,
  UserListResponse,
} from "@types";

export default function F2FResultsClient() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [leadsOptions, setLeadsOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    managementApi.getProjectLeads({ limit: 100 }).then((res) => {
      const options = (res.data || []).map((l: UserListResponse) => ({
        id: l.id.toString(),
        label: l.username,
      }));
      setLeadsOptions([{ id: "all", label: "All Leads" }, ...options]);
    });
  }, []);
  const {
    data,
    isLoading: loading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    filters,
    activeFiltersCount,
    handleSingleFilterChange,
    resetFilters,
    refresh,
    isBackgroundLoading,
  } = useListing<
    EvaluationHistoryItem,
    Record<string, unknown>,
    PaginatedResponse<EvaluationHistoryItem>
  >({
    fetchFn: evaluationsApi.getAdminEvaluationList,
    initialFilters: {},
    initialPageSize: 10,
  });

  const [unassignId, setUnassignId] = useState<number | null>(null);
  const [isUnassigning, setIsUnassigning] = useState(false);

  const handleUnassignClick = (evaluationId: number) => {
    setUnassignId(evaluationId);
  };

  const handleUnassignSubmit = async () => {
    if (!unassignId) return;

    setIsUnassigning(true);
    try {
      await evaluationsApi.unassignLead(unassignId);
      // Removed manual toast to avoid duplication with system notification
      setUnassignId(null);
      await refresh(true);
    } catch (error) {
      toast.error("Failed to unassign lead");
      console.error(error);
    } finally {
      setIsUnassigning(false);
    }
  };

  return (
    <PageContainer className="space-y-8">
      <MainCard
        title={
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand-primary" />
            <span>Round 2 Face-to-Face Round Results</span>
          </div>
        }
        action={
          <ListingIcons
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
            onRefresh={refresh}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            isFilterOpen={isFilterOpen}
            activeFiltersCount={activeFiltersCount}
          />
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full min-h-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Project Lead</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <EmptyState
                          variant="search"
                          title="No F2F interviews found"
                          description="No candidates have been assigned for Round 2 yet."
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={item.candidate_name}
                              variant="brand"
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-[13px] uppercase tracking-tight">
                                {item.candidate_name}
                              </span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Phone size={10} /> {item.candidate_mobile}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.lead_name}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            shape="square"
                            color={
                              item.status === "completed"
                                ? "success"
                                : "warning"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.overall_grade ? (
                            <Badge
                              variant="outline"
                              shape="square"
                              color={
                                item.overall_grade.toLowerCase() === "excellent"
                                  ? "success"
                                  : item.overall_grade.toLowerCase() === "good"
                                    ? "blue"
                                    : item.overall_grade.toLowerCase() ===
                                        "average"
                                      ? "warning"
                                      : "error"
                              }
                            >
                              {item.overall_grade}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {item.result_name ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]">
                              <ShieldCheck size={14} />
                              {item.result_name}
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
                            {formatDate(item.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {item.status === "completed" ? (
                              <TableIconButton
                                iconColor="green"
                                title="Evaluation Completed"
                              >
                                <UserCheck size={16} />
                              </TableIconButton>
                            ) : (
                              <TableIconButton
                                iconColor="red"
                                title="Unassign Lead"
                                onClick={() => handleUnassignClick(item.id)}
                              >
                                <UserMinus size={16} />
                              </TableIconButton>
                            )}
                            <Link
                              href={`/admin/results/round-1/${item.candidate_id}`}
                            >
                              <TableIconButton
                                iconColor="brand"
                                title="View Full Profile"
                              >
                                <Eye size={16} />
                              </TableIconButton>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {!loading && data.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </ListingTransition>
        </div>

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="f2f-results-filters"
          filters={filters}
          onFilterChange={(key, val) => handleSingleFilterChange(key, val)}
          onReset={resetFilters}
          isLoading={loading}
          dynamicOptions={{
            project_lead_id: leadsOptions,
          }}
        />
      </MainCard>

      <Modal
        isOpen={unassignId !== null}
        onClose={() => !isUnassigning && setUnassignId(null)}
        title="Unassign Project Lead"
        className="max-w-sm"
      >
        <div className="flex flex-col items-center text-center p-2">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <UserMinus className="text-red-600 dark:text-red-400" size={32} />
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Unassign Project Lead?
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            This action will perform the following for{" "}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {data.find((item) => item.id === unassignId)?.candidate_name ||
                "this candidate"}
            </span>
            :
          </p>

          <div className="w-full text-left space-y-2 mb-5 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <AlertTriangle
                size={14}
                className="text-red-500 mt-0.5 shrink-0"
              />
              <span>
                <strong>Access Revoked:</strong> Current lead will no longer be
                able to view or edit evaluation forms.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <AlertTriangle
                size={14}
                className="text-red-500 mt-0.5 shrink-0"
              />
              <span>
                <strong>Reset Progress:</strong> Any unsaved evaluation progress
                for this round will be lost.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <AlertTriangle
                size={14}
                className="text-red-500 mt-0.5 shrink-0"
              />
              <span>
                <strong>Manual Action:</strong> You will need to manually assign
                a new lead to continue the process.
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-muted mb-4" />

          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="primary"
              color="error"
              className="w-full flex items-center justify-center gap-2 py-6 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleUnassignSubmit}
              disabled={isUnassigning}
            >
              {isUnassigning ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserMinus size={16} />
              )}
              {isUnassigning ? "Processing..." : "Confirm & Unassign Lead"}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setUnassignId(null)}
              disabled={isUnassigning}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
