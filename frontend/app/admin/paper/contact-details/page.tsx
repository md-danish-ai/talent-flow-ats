import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function ContactDetailsPage() {
  return (
    <div className="py-2">
      <PageHeader
        title="Company Contact"
        description="Manage company contact details for paper branding."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <p className="text-slate-400 font-medium">
          Contact management interface coming soon...
        </p>
      </div>
    </div>
  );
}
