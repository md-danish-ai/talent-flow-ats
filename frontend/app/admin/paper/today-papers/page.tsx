import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { TodayUserListing } from "./components/TodayUserListing";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function TodayPapersPage() {
  const cookieStore = await cookies();

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData: UserListResponse[] = [];
  try {
    const todayDate = new Date().toISOString().split("T")[0];
    initialData = await getUsersByRole("user", {
      cookies: cookieString,
      date: todayDate,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <PageContainer className="py-2">
      <PageHeader
        title="Daily Papers"
        description="Overview of papers scheduled and active for today."
      />
      <TodayUserListing initialData={initialData} />
    </PageContainer>
  );
}
