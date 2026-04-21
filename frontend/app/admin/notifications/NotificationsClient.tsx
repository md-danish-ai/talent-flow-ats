"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Mail, MailOpen } from "lucide-react";
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
  type NotificationItem,
} from "@lib/api";
import { NotificationSummary } from "./components/NotificationSummary";
import { NotificationRow } from "./components/NotificationRow";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";

const getDateStr = (dateStr: string) => {
  const tzDate = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  return new Date(tzDate);
};

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [counts, setCounts] = useState({ read: 0, unread: 0, total: 0 });

  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleRow = useCallback((id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const onFilterChange = useCallback((filter: "all" | "unread" | "read") => {
    setStatusFilter(filter);
    setCurrentPage(1);
  }, []);

  const fetchNotifications = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const res = await getAllNotifications({
          page,
          limit: pageSize,
          is_read: statusFilter === "all" ? undefined : statusFilter === "read",
        });
        setNotifications(res.data);
        setTotalPages(res.pagination.total_pages);
        setCounts({
          read: res.read_count,
          unread: res.unread_count,
          total: res.pagination.total_records,
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, statusFilter],
  );

  const firstMountRef = React.useRef(true);
  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      fetchNotifications(currentPage);
    }

    const handleUpdate = () => fetchNotifications(currentPage);
    window.addEventListener("notificationsUpdated", handleUpdate);
    return () =>
      window.removeEventListener("notificationsUpdated", handleUpdate);
  }, [currentPage, fetchNotifications]);

  const handleBulkAction = async (ids: number[], action: "read" | "unread") => {
    try {
      if (action === "read") {
        await markNotificationsRead(ids);
      } else {
        await markNotificationsUnread(ids);
      }
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      // Dispatching this event will trigger the handleUpdate in useEffect above
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Bell size={20} />
            </div>
            Recent Notifications
          </div>
        }
        action={
          selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                color="primary"
                size="md"
                animate="scale"
                onClick={() => handleBulkAction(selectedIds, "read")}
                className="flex items-center gap-2"
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
                className="flex items-center gap-2"
              >
                <Mail size={16} />
                Marks Unread ({selectedIds.length})
              </Button>
            </div>
          )
        }
        className="mb-6"
        bodyClassName="p-0 flex flex-col items-stretch"
      >
        <div className="flex flex-col min-w-0 relative">
          <NotificationSummary
            counts={counts}
            statusFilter={statusFilter}
            onFilterChange={onFilterChange}
          />

          <div className="overflow-x-auto w-full">
            {loading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center px-6"></TableHead>
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
                  <SimpleTableSkeleton columnCount={9} rowCount={pageSize} />
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center px-6">
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
                  {notifications.length === 0 ? (
                    <EmptyState
                      colSpan={9}
                      title="All caught up!"
                      description="You have no new notifications right now. We'll alert you when something important happens."
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
                        getDateStr={getDateStr}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && notifications.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={counts.total}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              className="mt-auto shrink-0"
            />
          )}
        </div>
      </MainCard>
    </div>
  );
}
