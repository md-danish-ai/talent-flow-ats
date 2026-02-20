import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function TypingTestPage() {
  return (
    <div className="py-2">
      <PageHeader
        title="Typing Test"
        description="Setup and monitor typing test parameters and evaluations."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-slate-400 font-medium">
          Typing test interface coming soon...
        </p>
      </div>
    </div>
  );
}
