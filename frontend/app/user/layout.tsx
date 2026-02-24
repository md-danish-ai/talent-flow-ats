import React from "react";
import { SidebarProvider } from "@components/ui-layout/sidebar";
import { Navbar } from "@components/ui-layout/Navbar";
import { getCurrentUser } from "@lib/auth/get-current-user";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex flex-col bg-background overflow-hidden transition-colors">
        <Navbar user={user} />

        <div className="flex flex-1 overflow-hidden">
          {/* <Sidebar /> */}

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 bg-layout-bg transition-colors rounded-tl-xl lg:rounded-tl-2xl">
            <div className="mx-auto w-full max-w-7xl min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
