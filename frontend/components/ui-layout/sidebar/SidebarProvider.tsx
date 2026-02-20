"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
  expandSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile sidebar on window resize if larger than 900px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 900) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);
  const expandSidebar = () => setIsCollapsed(false);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        isCollapsed,
        toggleSidebar,
        closeMobileSidebar,
        expandSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

// Alias for backward compatibility
export const useSidebar = useSidebarContext;
