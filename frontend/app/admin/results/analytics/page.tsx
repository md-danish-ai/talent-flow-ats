import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function AnalyticsPage() {
  return (
    <div className="py-2">
      <PageHeader
        title="Performance Analytics"
        description="Deep dive into candidate performance metrics and trends."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-slate-400 font-medium">
          Analytics dashboard coming soon...
        </p>
      </div>
    </div>
  );
}
