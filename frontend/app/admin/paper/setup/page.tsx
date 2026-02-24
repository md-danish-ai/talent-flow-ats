import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";

export default function PaperSetupPage() {
  return (
    <PageContainer className="py-2">
      <PageHeader
        title="Paper Setup"
        description="Configure and customize your examination papers."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Typography variant="body5">
          Paper setup interface coming soon...
        </Typography>
      </div>
    </PageContainer>
  );
}
