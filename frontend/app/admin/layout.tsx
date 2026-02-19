import React from 'react';
import { Sidebar } from './_modules/shared/Sidebar';
import { Navbar } from './_modules/shared/Navbar';
import { Footer } from './_modules/shared/Footer';
import { Container } from '@/components/shared/Container';
import { SidebarProvider } from './_modules/shared/components/SidebarProvider';

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
                        <Container>
                            {children}
                        </Container>
                    </main>

                    <Footer />
                </div>
            </div>
        </SidebarProvider>
    );
}
