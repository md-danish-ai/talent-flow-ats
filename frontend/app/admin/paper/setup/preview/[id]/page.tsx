"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PaperPreviewClient } from "../PaperPreviewClient";

export default function PaperPreviewPage() {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;

  if (!id) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground font-semibold">Invalid Paper ID</p>
      </div>
    );
  }

  return <PaperPreviewClient paperId={id} />;
}
