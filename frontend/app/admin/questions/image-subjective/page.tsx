import React from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";

export default function ImageSubjectivePage() {
  return (
    <PageContainer className="py-2">
      <PageHeader
        title="Image Subjective"
        description="Configure subjective questions with image references."
      />
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Typography variant="body5">
          Image-Subjective interface coming soon...
        </Typography>
      </div>
    </PageContainer>
  );
}
