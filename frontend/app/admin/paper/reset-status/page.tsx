import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { ResetUserListing } from "./components/ResetUserListing";
import { getUsersByRole } from "@lib/api/auth";
import { cookies } from "next/headers";
import { AttemptStatusLegend } from "@components/ui-elements/StatusLegend";

export const dynamic = "force-dynamic";

export default async function ResetStatusPage() {
  const cookieStore = await cookies();

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData = null;
  try {
    initialData = await getUsersByRole("user", {
      cookies: cookieString,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <PageContainer className="py-2">
      <AttemptStatusLegend
        title="Reset User Status"
        subtitle="Manage daily interview progress and application details for all candidates."
      />
      <ResetUserListing initialData={initialData || undefined} />
    </PageContainer>
  );
}
