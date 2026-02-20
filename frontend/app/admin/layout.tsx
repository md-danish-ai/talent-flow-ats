import React from "react";
import { Sidebar } from "@components/ui-layout/Sidebar";
import { Navbar } from "@components/ui-layout/Navbar";
import { Container } from "@components/ui-layout/Container";
import { SidebarProvider } from "@components/ui-layout/sidebar/SidebarProvider";
import { getCurrentUser } from "@lib/auth/get-current-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Runs on the server at request time — no client JS, no extra render
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      {/* Full-height column: Navbar on top, then sidebar+content row below */}
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        {/* Navbar — full width */}
        <Navbar user={user} />

        {/* Body row: Sidebar + Main Content side by side */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main
            className="flex-1 py-4 sm:py-6 lg:py-8 overflow-y-auto min-w-0"
            style={{ backgroundColor: "var(--layout-bg)" }}
          >
            <Container>{children}</Container>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
