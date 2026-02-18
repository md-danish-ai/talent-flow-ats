'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './_modules/shared/Sidebar';
import { Navbar } from './_modules/shared/Navbar';
import { Footer } from './_modules/shared/Footer';
import { Container } from '@/components/shared/Container';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile sidebar on window resize if larger than 900px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 900) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (window.innerWidth < 900) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar with mobile open state and desktop collapse state */}
            <Sidebar
                isOpen={isMobileOpen}
                isCollapsed={isCollapsed}
                onClose={() => setIsMobileOpen(false)}
                onToggle={toggleSidebar}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={toggleSidebar} />

                <main className="flex-1 py-4 sm:py-6 lg:py-8 overflow-y-auto">
                    <Container>
                        {children}
                    </Container>
                </main>

                <Footer />
            </div>
        </div>
    );
}
