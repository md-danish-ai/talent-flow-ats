"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export type ActionItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
};

export type ActionMenuProps = {
  button: React.ReactNode; // renderer for the trigger button
  items: ActionItem[];
  menuClassName?: string;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  // optional selector to constrain the dropdown inside a parent boundary (CSS selector)
  boundarySelector?: string;
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  button,
  items,
  menuClassName = "",
  buttonClassName = "",
  buttonAriaLabel = "Open menu",
  boundarySelector,
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [side, setSide] = useState<"left" | "right">("right");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // schedule initial position on the next frame
    let rafId = 0;
    let measureRaf = 0;

    rafId = window.requestAnimationFrame(() => {
      // find a parent boundary element to keep menu inside the card/container
      let boundary: Element | null = null;
      if (boundarySelector) {
        boundary = triggerRef.current?.closest(boundarySelector) || null;
      }
      // heuristics: prefer nearest ancestor with 'card' or 'main' in the class name or role=region
      if (!boundary) {
        let el = triggerRef.current?.parentElement || null;
        while (el && el !== document.body) {
          const cls = (el.className || "") as string;
          if (/card|main|container|panel|section/i.test(cls) || el.getAttribute("role") === "region") {
            boundary = el;
            break;
          }
          el = el.parentElement;
        }
      }
      if (!boundary) boundary = document.body;

      const boundaryRect = (boundary as Element).getBoundingClientRect();

      // use viewport coords (clientRect) so fixed positioning is straightforward
      const initialLeft = rect.left + rect.width / 2; // center reference
      setPos({ top: rect.bottom + 4, left: initialLeft });

      // after menu mounts, measure its size and adjust placement to avoid clipping
      measureRaf = window.requestAnimationFrame(() => {
        const menuEl = menuRef.current;
        if (!menuEl) return;
        const menuH = menuEl.offsetHeight;
        const menuW = menuEl.offsetWidth;

        // compute available area as intersection of boundary and viewport
        const areaTop = Math.max(0, boundaryRect.top);
        const areaLeft = Math.max(0, boundaryRect.left);
        const areaRight = Math.min(window.innerWidth, boundaryRect.right);
        const areaBottom = Math.min(window.innerHeight, boundaryRect.bottom);

        const spaceRight = areaRight - rect.right;
        const spaceLeft = rect.left - areaLeft;
        const spaceBelow = areaBottom - rect.bottom;
        const spaceAbove = rect.top - areaTop;

        const margin = 8;

        // decide horizontal side
        let finalSide: "left" | "right" = "right";
        if (spaceRight >= menuW + margin) finalSide = "right";
        else if (spaceLeft >= menuW + margin) finalSide = "left";
        else {
          // pick whichever side has more space
          finalSide = spaceRight >= spaceLeft ? "right" : "left";
        }

        // decide vertical placement
        let finalPlacement: "bottom" | "top" = "bottom";
        if (spaceBelow >= menuH + margin) finalPlacement = "bottom";
        else if (spaceAbove >= menuH + margin) finalPlacement = "top";
        else {
          // pick side with more space
          finalPlacement = spaceBelow >= spaceAbove ? "bottom" : "top";
        }

        // compute left coordinate depending on side and clamp to area
        let finalLeft = rect.left + rect.width / 2 - (finalSide === "right" ? 0 : 0);
        if (finalSide === "right") {
          // left edge should be near rect.right
          finalLeft = rect.right + 4;
          finalLeft = Math.min(Math.max(finalLeft, areaLeft + margin), areaRight - menuW - margin);
        } else {
          // right edge should align near rect.left
          let rightEdge = rect.left - 4;
          rightEdge = Math.min(Math.max(rightEdge, areaLeft + menuW + margin), areaRight - margin);
          finalLeft = rightEdge; // we'll translateX(-100%) to make this the right edge
        }

        // compute top coordinate depending on placement and clamp
        let finalTop = finalPlacement === "bottom" ? rect.bottom + 4 : rect.top - menuH - 4;
        finalTop = Math.min(Math.max(finalTop, areaTop + margin), areaBottom - menuH - margin);

        setSide(finalSide);
        setPlacement(finalPlacement);
        setPos({ top: finalTop, left: finalLeft });
      });
    });

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && triggerRef.current && !triggerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(measureRaf);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [open, items.length, boundarySelector]);

  const menuNode = (
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.98, y: placement === "bottom" ? -4 : 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: placement === "bottom" ? -4 : 4 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            // Use fixed positioning to avoid ancestor transform / overflow clipping
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: side === "left" ? "translateX(-100%)" : undefined,
            zIndex: 99999,
            pointerEvents: "auto",
            width: "auto",
            maxWidth: 280,
          }}
          className={`bg-card border border-border rounded-xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)] py-1 overflow-hidden ${menuClassName}`}
        >
          <div className="space-y-0.5 px-0.5">
            {items.map((it) => (
              <button
                key={it.key}
                onClick={(e) => {
                  if (it.disabled) return;
                  it.onClick(e);
                  setOpen(false);
                }}
                disabled={it.disabled}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded-xl text-sm font-bold text-muted-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-left ${it.className ?? ""}`}
              >
                <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center transition-colors text-muted-foreground shrink-0">
                  {it.icon}
                </div>
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        aria-label={buttonAriaLabel}
        type="button"
        className={buttonClassName}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((s) => !s);
        }}
      >
        {button}
      </button>
      {typeof document !== "undefined" ? createPortal(menuNode, document.body) : menuNode}
    </div>
  );
};

export default ActionMenu;
