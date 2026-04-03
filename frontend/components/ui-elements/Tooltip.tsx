"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({
  content,
  children,
  className,
  side = "bottom",
  delay = 0.2,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      let top = 0;
      let left = 0;

      if (side === "top") {
        top = rect.top + scrollTop - 8;
        left = rect.left + scrollLeft + rect.width / 2;
      } else if (side === "bottom") {
        top = rect.bottom + scrollTop + 8;
        left = rect.left + scrollLeft + rect.width / 2;
      } else if (side === "left") {
        top = rect.top + scrollTop + rect.height / 2;
        left = rect.left + scrollLeft - 8;
      } else if (side === "right") {
        top = rect.top + scrollTop + rect.height / 2;
        left = rect.left + scrollLeft + rect.width + 8;
      }

      setCoords({ top, left });
    }
  };

  const handleMouseEnter = () => {
    if (!mounted) setMounted(true);
    updateCoords();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const sideOriginMap = {
    top: { x: "-50%", y: "-100%", originX: 0.5, originY: 1 },
    bottom: { x: "-50%", y: 0, originX: 0.5, originY: 0 },
    left: { x: "-100%", y: "-50%", originX: 1, originY: 0.5 },
    right: { x: 0, y: "-50%", originX: 0, originY: 0.5 },
  };

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-slate-900/90",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-slate-900/90",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-slate-900/90",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-slate-900/90",
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  zIndex: 99999,
                  ...sideOriginMap[side],
                }}
                className={cn(
                  "min-w-[max-content] max-w-[220px] rounded-xl px-3 py-2 text-[10px] font-bold text-white shadow-2xl border border-white/10 backdrop-blur-md bg-slate-900/90 pointer-events-none ring-1 ring-white/5 whitespace-normal text-center",
                  className,
                )}
              >
                {content}
                <div
                  className={cn(
                    "absolute h-0 w-0 border-4 border-transparent",
                    arrowClasses[side],
                  )}
                />
                {/* Subtle Inner Glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
