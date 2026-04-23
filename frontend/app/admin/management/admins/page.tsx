import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { AdminListing } from "./components/AdminListing";
import { getUsersByRole } from "@lib/api/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData = null;
  try {
    initialData = await getUsersByRole("admin", {
      cookies: cookieString,
      page: 1,
      limit: 10,
    });
  } catch (error) {
    console.error("Failed to fetch admins:", error);
  }

  return (
    <PageContainer animate>
      <AdminListing initialData={initialData || undefined} />
    </PageContainer>
  );
}
