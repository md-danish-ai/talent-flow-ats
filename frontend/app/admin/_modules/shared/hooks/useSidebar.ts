'use client';

import { useState, useEffect } from 'react';

export function useSidebar() {
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

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    const expandSidebar = () => {
        setIsCollapsed(false);
    };

    return {
        isMobileOpen,
        isCollapsed,
        toggleSidebar,
        closeMobileSidebar,
        expandSidebar,
    };
}
