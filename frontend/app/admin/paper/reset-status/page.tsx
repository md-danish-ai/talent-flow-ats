import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { ResetUserListing } from "./components/ResetUserListing";
import { getUsersByRole } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    date?: string;
    date_from?: string;
    date_to?: string;
    label?: string;
  }>;
}

export default async function ResetStatusPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;

  const date_from = params.date_from;
  const date_to = params.date_to;
  const initialLabel = params.label || "Today";

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData = null;
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    const fetchOptions = {
      cookies: cookieString,
      date_from: date_from || (!date_to ? todayDate : undefined),
      date_to: date_to || (!date_from ? todayDate : undefined),
      page: 1,
      limit: 10,
    };

    initialData = await getUsersByRole("user", fetchOptions);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <PageContainer className="py-2">
      <ResetUserListing
        initialData={initialData || undefined}
        initialLabel={initialLabel}
      />
    </PageContainer>
  );
}
