"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Plus, Users } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { AddProjectLeadModal } from "@/app/admin/management/project-leads/components/AddProjectLeadModal";
import {
  getUsersByRole,
  UserListResponse,
  toggleUserStatus,
} from "@lib/api/auth";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";

interface ProjectLeadListingProps {
  initialData?: UserListResponse[];
}

export function ProjectLeadListing({
  initialData = [],
}: ProjectLeadListingProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState<UserListResponse[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsersByRole("project_lead");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch project leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setUsers(initialData);
      setLoading(false);
    }
  }, [initialData]);

  const handleToggleStatus = async (user: UserListResponse) => {
    setTogglingId(user.id);
    try {
      await toggleUserStatus(user.id);
      fetchUsers();
    } catch (error) {
      console.error("Toggle failed:", error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            Project Leads
          </>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {users.length} LEADS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              iconAnimation="rotate-90"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<Plus size={18} />}
              className="font-bold"
            >
              Add Project Lead
            </Button>
          </div>
        }
      >
        <div className="flex-1 w-full flex flex-col min-w-0 overflow-hidden relative">
          <div className="flex-1 overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
                    Sr. No.
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Name
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Mobile
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Email
                  </TableHead>
                  <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <SimpleTableSkeleton
                    columnCount={5}
                    columnWidths={[
                      "w-[80px] text-center",
                      "",
                      "",
                      "",
                      "text-center",
                    ]}
                    rowCount={10}
                  />
                ) : !Array.isArray(users) || users.length === 0 ? (
                  <EmptyState
                    colSpan={5}
                    title="No project leads found"
                    description="There are currently no project lead accounts registered in the system."
                  />
                ) : (
                  users.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell>{row.username || "-"}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Switch
                            checked={row.is_active}
                            onChange={() => handleToggleStatus(row)}
                            size="sm"
                            disabled={togglingId === row.id}
                          />
                          <Badge
                            variant="outline"
                            shape="square"
                            color={row.is_active ? "success" : "error"}
                          >
                            {row.is_active ? "Activate" : "Deactivate"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </MainCard>

      <AddProjectLeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchUsers(); // Refresh after adding
        }}
      />
    </>
  );
}
