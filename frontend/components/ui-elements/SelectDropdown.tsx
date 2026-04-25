"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

export interface SelectOption {
  id: string | number;
  label: string;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  placement?: "top" | "bottom";
  className?: string;
  wrapperClassName?: string;
  error?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  placement = "bottom",
  className,
  wrapperClassName,
  error = false,
  disabled = false,
  isLoading = false,
  emptyMessage = "No options available",
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // We initialize mounting lazily to avoid cascading renders on initial page load.
  // This satisfies the "Calling setState synchronously within an effect" warning.

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const toggleDropdown = () => {
    if (disabled) return;
    if (!mounted) setMounted(true);
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  // Update coords on resize/scroll if open
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  const selectedOption = options.find(
    (opt) => String(opt.id) === String(value),
  );

  const menuNode = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top:
              placement === "top"
                ? coords.top - 8
                : coords.top + coords.height + 8,
            left: coords.left,
            width: Math.max(coords.width, 280),
            zIndex: 10000,
            transform: placement === "top" ? "translateY(-100%)" : "none",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: placement === "top" ? 4 : -4,
              scale: 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "top" ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "overflow-hidden rounded-md border border-border bg-card p-1.5 shadow-2xl transition-colors",
            )}
            ref={dropdownRef}
          >
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-4 px-4 gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                  <Typography
                    variant="body4"
                    className="italic text-muted-foreground font-medium"
                  >
                    Fetching options...
                  </Typography>
                </div>
              ) : options.length === 0 ? (
                <div className="py-3 px-4 text-center">
                  <Typography
                    variant="body4"
                    className="italic text-muted-foreground font-medium"
                  >
                    {emptyMessage}
                  </Typography>
                </div>
              ) : (
                options.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant="ghost"
                    creativeHover={false}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-semibold transition-all mb-0.5 last:mb-0 justify-start h-auto text-left",
                      String(value) === String(option.id)
                        ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                        : "text-slate-600 dark:text-white hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 hover:text-brand-primary transition-colors",
                    )}
                  >
                    <Typography
                      variant="body4"
                      weight="semibold"
                      as="span"
                      color="inherit"
                      className="flex-1 text-left leading-tight pr-4"
                    >
                      {option.label}
                    </Typography>
                    {String(value) === String(option.id) && (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="auto"
        fullWidth
        creativeHover={false}
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between rounded-md border bg-input py-3.5 px-4 text-left text-medium outline-none transition-all hover:bg-input/80",
          "border-border dark:border-white/20",
          className,
          isOpen && "border-brand-primary ring-1 ring-brand-primary",
          error &&
            "!border-red-500 ring-1 !ring-red-500/20 hover:!border-red-500",
          disabled &&
            "opacity-50 !cursor-not-allowed bg-muted/20 hover:!bg-muted/20",
        )}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <Typography
            variant="body4"
            weight="medium"
            as="span"
            className={cn(
              "truncate transition-colors",
              selectedOption
                ? "text-foreground"
                : "text-muted-foreground/60 dark:text-white/40",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Typography>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground/60 flex-shrink-0 transition-transform",
              isOpen && "rotate-180 text-brand-primary",
            )}
          />
        </div>
      </Button>

      {mounted && typeof document !== "undefined"
        ? createPortal(menuNode, document.body)
        : null}
    </div>
  );
}
