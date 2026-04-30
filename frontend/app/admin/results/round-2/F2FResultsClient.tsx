"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
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
import { Eye, Users, Calendar, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { evaluationsApi } from "@lib/api/evaluations";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Skeleton } from "@components/ui-elements/Skeleton";

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

  return (
    <PageContainer className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="font-black tracking-tight">
          Face-to-Face Round Results
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          View all candidates currently in or completed the Round 2 interview
          process.
        </Typography>
      </div>

      <MainCard
        title={
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand-primary" />
            <span>Interview Evaluations</span>
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
                            className="uppercase tracking-widest text-[9px] font-black"
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
                              className="font-bold uppercase"
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
                          <Link href={`/admin/results/round-1/${item.candidate_id}`}>
                            <TableIconButton
                              iconColor="brand"
                              title="View Full Profile"
                            >
                              <Eye size={16} />
                            </TableIconButton>
                          </Link>
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
    </PageContainer>
  );
}
