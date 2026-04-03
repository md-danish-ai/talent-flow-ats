import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { TodayUserListing } from "./components/TodayUserListing";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";
import { cookies } from "next/headers";
import { PageHeader } from "@components/ui-elements/PageHeader";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    date?: string;
    date_from?: string;
    date_to?: string;
    label?: string;
  }>;
}

export default async function TodayPapersPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;

  const date = params.date;
  const date_from = params.date_from;
  const date_to = params.date_to;
  const initialLabel = params.label || "Today";

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData: UserListResponse[] = [];
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    // If no specific range is provided, default to today
    const fetchOptions = {
      cookies: cookieString,
      date: date_from || date_to ? undefined : date || todayDate,
      date_from: date_from,
      date_to: date_to,
    };

    initialData = await getUsersByRole("user", fetchOptions);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <PageContainer className="py-2">
      <PageHeader
        title="Daily Papers"
        description="Overview of papers scheduled and active for today."
      />
      <TodayUserListing initialData={initialData} initialLabel={initialLabel} />
    </PageContainer>
  );
}
