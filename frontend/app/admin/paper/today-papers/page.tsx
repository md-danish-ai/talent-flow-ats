import React from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { TodayUserListing } from "./components/TodayUserListing";
import { getUsersByRole } from "@lib/api/auth";
import { cookies } from "next/headers";
import { Button } from "@components/ui-elements/Button";
import Link from "next/link";
import { Settings } from "lucide-react";
import { AttemptStatusLegend } from "@components/ui-elements/StatusLegend";

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
      <AttemptStatusLegend
        title="Daily Papers"
        subtitle="Overview of papers scheduled and active for today."
        action={
          <Link href="/admin/paper/auto-assignment">
            <Button
              variant="outline"
              color="secondary"
              animate="scale"
              className="group gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm font-bold text-xs uppercase"
            >
              <Settings className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
              Auto-Assignment Rules
            </Button>
          </Link>
        }
      />
      <TodayUserListing initialData={initialData} initialLabel={initialLabel} />
    </PageContainer>
  );
}
