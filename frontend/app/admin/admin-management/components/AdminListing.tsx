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
import { AddAdminModal } from "./AddAdminModal";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";

interface AdminListingProps {
  initialData?: UserListResponse[];
}

export function AdminListing({ initialData = [] }: AdminListingProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState<UserListResponse[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsersByRole("admin");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If we have initial data (from SSR), just use it initially, no need to overwrite unless refreshed
    // Actually we will fetch on mount to ensure freshness, or rely on SSR. Let's rely on fetch if no initial data.
    if (!initialData.length) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [initialData, fetchUsers]);

  return (
    <>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            Admin Management
          </>
        }
        className="mb-6 flex-1 flex flex-col min-h-[600px]"
        bodyClassName="p-0 flex flex-row items-stretch flex-1"
        action={
          <div className="flex items-center gap-3">
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
              Add Admin
            </Button>
          </div>
        }
      >
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-x-auto w-full min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">
                    Sr. No.
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(users) || users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No admins found.
                    </TableCell>
                  </TableRow>
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
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            row.is_active
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {row.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </MainCard>

      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchUsers(); // Refresh after adding
        }}
      />
    </>
  );
}
