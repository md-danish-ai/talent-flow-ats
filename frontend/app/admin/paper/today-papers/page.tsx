import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function TodayPapersPage() {
  return (
    <div className="py-2">
      <PageHeader
        title="Daily Papers"
        description="Overview of papers scheduled and active for today."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-slate-400 font-medium">
          Daily papers monitor coming soon...
        </p>
      </div>
    </div>
  );
}
