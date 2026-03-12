"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Users } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import {
  getUsersByRole,
  UserListResponse,
  toggleUserStatus,
} from "@lib/api/auth";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
interface UserListingProps {
  initialData?: UserListResponse[];
}

export function UserListing({ initialData = [] }: UserListingProps) {
  const [users, setUsers] = useState<UserListResponse[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsersByRole("user");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData.length) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [initialData, fetchUsers]);

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
            Users
          </>
        }
        className="mb-6 flex-1 flex flex-col min-h-[600px]"
        bodyClassName="p-0 flex flex-row items-stretch flex-1"
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
                  <TableHead className="text-center">Status</TableHead>
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
                      No users found.
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
    </>
  );
}
