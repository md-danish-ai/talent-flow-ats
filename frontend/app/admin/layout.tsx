import React from "react";
import { Sidebar, SidebarProvider } from "@components/ui-layout/sidebar";
import { Navbar } from "@components/ui-layout/Navbar";
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
      <div className="fixed inset-0 flex flex-col bg-background overflow-hidden transition-colors">
        {/* Navbar — full width */}
        <Navbar user={user} />

        {/* Body row: Sidebar + Main Content side by side */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 bg-layout-bg transition-colors">
            <div className="mx-auto w-full max-w-7xl min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
