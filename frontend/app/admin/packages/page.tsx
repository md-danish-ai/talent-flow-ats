import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { DocSidebar } from "./components/DocSidebar";
import { DocFooter } from "./components/DocFooter";

import dynamic from "next/dynamic";

const ButtonDocs = dynamic(() =>
  import("./components/sections/ButtonDocs").then((m) => m.ButtonDocs),
);
const InputDocs = dynamic(() =>
  import("./components/sections/InputDocs").then((m) => m.InputDocs),
);
const SelectDocs = dynamic(() =>
  import("./components/sections/SelectDocs").then((m) => m.SelectDocs),
);
const TableDocs = dynamic(() =>
  import("./components/sections/TableDocs").then((m) => m.TableDocs),
);
const StatDocs = dynamic(() =>
  import("./components/sections/StatDocs").then((m) => m.StatDocs),
);
const ModalDocs = dynamic(() =>
  import("./components/sections/ModalDocs").then((m) => m.ModalDocs),
);
const AlertDocs = dynamic(() =>
  import("./components/sections/AlertDocs").then((m) => m.AlertDocs),
);
const TypographyDocs = dynamic(() =>
  import("./components/sections/TypographyDocs").then((m) => m.TypographyDocs),
);
const BadgeDocs = dynamic(() =>
  import("./components/sections/BadgeDocs").then((m) => m.BadgeDocs),
);

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const activeItem = (resolvedSearchParams.item as string) || "button";

  // Environment Guard
  if (
    process.env.NEXT_PUBLIC_APP_ENV !== "dev" &&
    process.env.NODE_ENV !== "development"
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in duration-700">
        <Typography
          variant="h2"
          weight="black"
          className="text-foreground tracking-tighter"
        >
          404 - Restricted Access
        </Typography>
        <Typography
          variant="body1"
          className="mt-2 text-muted-foreground font-medium"
        >
          This documentation module is restricted to development environments.
        </Typography>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeItem) {
      case "button":
        return <ButtonDocs />;
      case "input":
        return <InputDocs />;
      case "select":
        return <SelectDocs />;
      case "table":
        return <TableDocs />;
      case "stat-card":
        return <StatDocs />;
      case "modal":
        return <ModalDocs />;
      case "alert":
        return <AlertDocs />;
      case "badge":
        return <BadgeDocs />;
      case "typography":
        return <TypographyDocs />;
      default:
        return <ButtonDocs />;
    }
  };

  return (
    <div className="flex gap-8 h-full min-h-[calc(100vh-180px)] selection:bg-brand-primary/20">
      <DocSidebar activeItem={activeItem} />

      <section className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar rounded-3xl group/main">
        <div className="bg-card/30 backdrop-blur-xl border border-border rounded-3xl py-5 px-10 shadow-2xl shadow-slate-950/20 min-h-full relative overflow-hidden transition-all duration-500 hover:border-brand-primary/10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none group-hover/main:bg-brand-primary/10 transition-colors duration-1000" />

          <div className="max-w-4xl mx-auto relative z-10">
            {renderContent()}
            <DocFooter />
          </div>
        </div>
      </section>
    </div>
  );
}
