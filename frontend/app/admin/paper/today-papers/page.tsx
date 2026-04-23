import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { TodayUserListing } from "./components/TodayUserListing";
import { getUsersByRole } from "@lib/api/auth";
import { cookies } from "next/headers";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { Button } from "@components/ui-elements/Button";
import Link from "next/link";
import { Settings } from "lucide-react";

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

  const date_from = params.date_from;
  const date_to = params.date_to;
  const initialLabel = params.label || "Today";

  // Forward the cookies string so the API client can pass auth header
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  let initialData = undefined;
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    // If no specific range is provided, default to today for both from and to
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
      <PageHeader
        title="Daily Papers"
        description="Overview of papers scheduled and active for today."
        action={
          <Link href="/admin/paper/auto-assignment">
            <Button
              variant="outline"
              color="secondary"
              animate="scale"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Auto-Assignment Rules
            </Button>
          </Link>
        }
      />
      <TodayUserListing initialData={initialData} initialLabel={initialLabel} />
    </PageContainer>
  );
}
