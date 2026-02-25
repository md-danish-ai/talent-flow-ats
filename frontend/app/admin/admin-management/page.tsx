import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { AdminListing } from "@components/features/admin/AdminListing";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const cookieStore = await cookies();

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData: UserListResponse[] = [];
  try {
    initialData = await getUsersByRole("admin", { cookies: cookieString });
  } catch (error) {
    console.error("Failed to fetch admins:", error);
  }

  return (
    <PageContainer animate>
      <AdminListing initialData={initialData} />
    </PageContainer>
  );
}
