import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function SubjectivePage() {
  return (
    <div className="py-2">
      <PageHeader
        title="Subjective Questions"
        description="Manage open-ended and subjective question types."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-slate-400 font-medium">
          Subjective question interface coming soon...
        </p>
      </div>
    </div>
  );
}
