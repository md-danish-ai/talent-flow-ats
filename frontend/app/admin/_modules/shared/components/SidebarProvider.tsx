'use client';

import React, { createContext, useContext } from 'react';
import { useSidebar } from '../hooks/useSidebar';

interface SidebarContextType {
    isMobileOpen: boolean;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    closeMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const sidebar = useSidebar();

    return (
        <SidebarContext.Provider value={sidebar}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebarContext must be used within a SidebarProvider');
    }
    return context;
}
