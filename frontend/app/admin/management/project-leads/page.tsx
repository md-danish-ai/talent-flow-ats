import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { ProjectLeadListing } from "./components/ProjectLeadListing";
import { getUsersByRole } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProjectLeadsPage() {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData = null;
  try {
    initialData = await getUsersByRole("project_lead", {
      cookies: cookieString,
      page: 1,
      limit: 10,
    });
  } catch (error) {
    console.error("Failed to fetch project leads:", error);
  }

  return (
    <PageContainer animate>
      <ProjectLeadListing initialData={initialData || undefined} />
    </PageContainer>
  );
}
