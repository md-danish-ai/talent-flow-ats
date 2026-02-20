import React from "react";
import { Sidebar } from "@components/ui-layout/Sidebar";
import { Navbar } from "@components/ui-layout/Navbar";
import { Footer } from "@components/ui-layout/Footer";
import { Container } from "@components/ui-layout/Container";
import { SidebarProvider } from "@components/ui-layout/sidebar/SidebarProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />

          <main className="flex-1 py-4 sm:py-6 lg:py-8 overflow-y-auto">
            <Container>{children}</Container>
          </main>

          {/* <Footer /> */}
        </div>
      </div>
    </SidebarProvider>
  );
}
