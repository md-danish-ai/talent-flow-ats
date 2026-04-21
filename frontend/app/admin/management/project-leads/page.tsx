import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { ProjectLeadListing } from "./components/ProjectLeadListing";
import { getUsersByRole, UserListResponse } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProjectLeadsPage() {
  const cookieStore = await cookies();

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData: UserListResponse[] = [];
  try {
    initialData = await getUsersByRole("project_lead", {
      cookies: cookieString,
    });
  } catch (error) {
    console.error("Failed to fetch project leads:", error);
  }

  return (
    <PageContainer animate>
      <ProjectLeadListing initialData={initialData} />
    </PageContainer>
  );
}
