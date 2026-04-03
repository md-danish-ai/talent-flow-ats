import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { ResetUserListing } from "@/app/admin/paper/reset-status/components/ResetUserListing";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ResetStatusPage() {
  const cookieStore = await cookies();

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData: UserListResponse[] = [];
  try {
    initialData = await getUsersByRole("user", {
      cookies: cookieString,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <PageContainer className="py-2">
      <PageHeader
        title="Reset User Status"
        description="List of all registered candidates. Manage their daily interview progress and application details."
      />
      <ResetUserListing initialData={initialData} />
    </PageContainer>
  );
}
