"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { PaperSetupDetail } from "../../components/PaperSetupDetail";
import { PageContainer } from "@components/ui-layout/PageContainer";

export default function DetailPaperPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;

  return (
    <PageContainer animate className="pt-0">
      {id && (
        <PaperSetupDetail
          paperId={id}
          onBack={() => router.push("/admin/paper/setup")}
        />
      )}
    </PageContainer>
  );
}
