"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@components/ui-elements/Typography";
import { DocSidebar } from "./components/DocSidebar";
import { DocFooter } from "./components/DocFooter";

// Documentation Sections
import { ButtonDocs } from "./components/sections/ButtonDocs";
import { InputDocs } from "./components/sections/InputDocs";
import { SelectDocs } from "./components/sections/SelectDocs";
import { TableDocs } from "./components/sections/TableDocs";
import { StatDocs } from "./components/sections/StatDocs";
import { ModalDocs } from "./components/sections/ModalDocs";
import { AlertDocs } from "./components/sections/AlertDocs";
import { TypographyDocs } from "./components/sections/TypographyDocs";
import { BadgeDocs } from "./components/sections/BadgeDocs";

export default function PackagesPage() {
  const [activeItem, setActiveItem] = useState("button");
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-scroll to top when changing component
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeItem]);

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
        return <SelectDocs value={selectedValue} onChange={setSelectedValue} />;
      case "table":
        return <TableDocs />;
      case "stat-card":
        return <StatDocs />;
      case "modal":
        return (
          <ModalDocs
            isOpen={isModalOpen}
            onOpen={() => setIsModalOpen(true)}
            onClose={() => setIsModalOpen(false)}
          />
        );
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
      {/* Documentation Navigation (Left Panel) */}
      <DocSidebar activeItem={activeItem} onSelect={setActiveItem} />

      {/* Documentation Content (Right Panel) */}
      <section className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar rounded-3xl group/main">
        <div className="bg-card/30 backdrop-blur-xl border border-border rounded-3xl py-5 px-10 shadow-2xl shadow-slate-950/20 min-h-full relative overflow-hidden transition-all duration-500 hover:border-brand-primary/10">
          {/* Subtle Background Decoration */}
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
