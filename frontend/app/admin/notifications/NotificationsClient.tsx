"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Mail, MailOpen, RefreshCcw } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Pagination } from "@components/ui-elements/Pagination";
import {
  getAllNotifications,
  markNotificationsRead,
  markNotificationsUnread,
} from "@lib/api";
import { type NotificationItem, type NotificationResponse } from "@types";
import { NotificationSummary } from "./components/NotificationSummary";
import { NotificationRow } from "./components/NotificationRow";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { useListing } from "@hooks/useListing";
import { cn } from "@lib/utils";
import { Tooltip } from "@components/ui-elements/Tooltip";


type NotificationListingFilters = {
  status: "all" | "unread" | "read";
};

export function NotificationsClient() {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [counts, setCounts] = useState({ read: 0, unread: 0, total: 0 });

  const {
    data: notifications,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  } = useListing<
    NotificationItem,
    NotificationListingFilters,
    NotificationResponse
  >({
    fetchFn: (params) => getAllNotifications(params),
    initialFilters: {
      status: "all",
    },
    filterMapping: (f) => ({
      is_read: f.status === "all" ? undefined : f.status === "read",
    }),
    onSuccess: (res: NotificationResponse) => {
      setCounts({
        read: res.read_count || 0,
        unread: res.unread_count || 0,
        total: res.pagination?.total_records || 0,
      });
    },
    toastMessage: "Notifications refreshed successfully",
  });

  const toggleRow = useCallback((id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  useEffect(() => {
    const handleUpdate = () => void refresh();
    window.addEventListener("notificationsUpdated", handleUpdate);
    return () =>
      window.removeEventListener("notificationsUpdated", handleUpdate);
  }, [refresh]);

  const handleBulkAction = async (ids: number[], action: "read" | "unread") => {
    try {
      if (action === "read") {
        await markNotificationsRead(ids);
      } else {
        await markNotificationsUnread(ids);
      }
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      window.dispatchEvent(new CustomEvent("notificationsUpdated"));
    } catch (error) {
      console.error(`Failed to mark as ${action}:`, error);
    }
  };

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const toggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedIds(notifications.map((n) => n.id));
      } else {
        setSelectedIds([]);
      }
    },
    [notifications],
  );

  const startItemIndex = (currentPage - 1) * pageSize;

  return (
    <div className="flex flex-col gap-6">
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Bell size={18} />
            </div>
            Recent Notifications
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <Tooltip content="Refresh Notifications" side="bottom">
              <Button
                variant="action"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-180"
                onClick={refresh}
                disabled={isLoading}
              >
                <div className={cn(isLoading && "animate-spin")}>
                  <RefreshCcw size={18} />
                </div>
              </Button>
            </Tooltip>
            <div className="h-6 w-px bg-border/50 mx-1" />
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  color="primary"
                  size="md"
                  animate="scale"
                  onClick={() => handleBulkAction(selectedIds, "read")}
                  className="flex items-center gap-2 border-none"
                >
                  <MailOpen size={16} />
                  Marks Read ({selectedIds.length})
                </Button>
                <Button
                  variant="outline"
                  color="primary"
                  size="md"
                  animate="scale"
                  onClick={() => handleBulkAction(selectedIds, "unread")}
                  className="flex items-center gap-2 border-brand-primary text-brand-primary"
                >
                  <Mail size={16} />
                  Marks Unread ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>
        }
        className="mb-6"
        bodyClassName="p-0 flex flex-col items-stretch"
      >
        <div className="flex flex-col min-w-0 relative">
          <NotificationSummary
            counts={counts}
            statusFilter={filters.status}
            onFilterChange={(val) => handleSingleFilterChange("status", val)}
          />

          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center px-6">
                    {!isLoading && (
                      <div className="flex justify-center items-center">
                        <Checkbox
                          checked={
                            notifications.length > 0 &&
                            notifications.every((item) =>
                              selectedIds.includes(item.id),
                            )
                          }
                          onChange={toggleAll}
                        />
                      </div>
                    )}
                  </TableHead>
                  <TableHead className="w-[80px] text-center">
                    Sr. No.
                  </TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>New User</TableHead>
                  <TableHead>Matched User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-[120px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <SimpleTableSkeleton columnCount={9} rowCount={pageSize} />
                ) : notifications.length === 0 ? (
                  <EmptyState
                    colSpan={9}
                    title="All caught up!"
                    description="You have no new notifications right now."
                  />
                ) : (
                  notifications.map((notif, idx) => (
                    <NotificationRow
                      key={notif.id}
                      notification={notif}
                      index={startItemIndex + idx + 1}
                      isSelected={selectedIds.includes(notif.id)}
                      isExpanded={!!expandedRows[notif.id]}
                      onSelect={toggleSelection}
                      onExpand={toggleRow}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && notifications.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              className="mt-auto shrink-0 border-t"
            />
          )}
        </div>
      </MainCard>
    </div>
  );
}
