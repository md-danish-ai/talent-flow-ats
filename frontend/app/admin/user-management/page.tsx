import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { UserListing } from "@components/features/users/UserListing";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const cookieStore = await cookies();

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData: UserListResponse[] = [];
  try {
    initialData = await getUsersByRole("user", { cookies: cookieString });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <PageContainer animate>
      <UserListing initialData={initialData} />
    </PageContainer>
  );
}
