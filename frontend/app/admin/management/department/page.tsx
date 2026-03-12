import React from "react";
import { cookies } from "next/headers";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { DepartmentListing } from "./components/DepartmentListing";
import { departmentsApi } from "@/lib/api/departments";

export const dynamic = "force-dynamic";

async function getDepartmentsData() {
  try {
    const cookieStore = await cookies();
    const cookieStr = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await departmentsApi.getDepartments(
      { limit: 100 },
      { cookies: cookieStr },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching departments data:", error);
    return [];
  }
}

export default async function DepartmentManagementPage() {
  const initialData = await getDepartmentsData();

  return (
    <PageContainer animate>
      <DepartmentListing initialData={initialData} />
    </PageContainer>
  );
}
