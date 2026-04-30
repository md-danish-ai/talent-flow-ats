"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Loader2, X } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

export interface MultiSelectOption {
  id: string | number;
  label: string;
}

export interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  placement?: "top" | "bottom";
  className?: string;
  wrapperClassName?: string;
  error?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MultiSelectDropdown({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  placement = "bottom",
  className,
  wrapperClassName,
  error = false,
  disabled = false,
  isLoading = false,
  emptyMessage = "No options available",
}: MultiSelectDropdownProps) {
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

  const toggleOption = (optionId: string | number) => {
    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  const removeOption = (e: React.MouseEvent, optionId: string | number) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== optionId));
  };

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
                options.map((option) => {
                  const isSelected = value.includes(option.id);
                  return (
                    <Button
                      key={option.id}
                      type="button"
                      variant="ghost"
                      color="default"
                      onClick={() => toggleOption(option.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-semibold transition-all mb-0.5 last:mb-0 justify-start h-auto text-left",
                        isSelected
                          ? "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                          : "text-slate-600 dark:text-white hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 hover:text-brand-primary transition-colors",
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-brand-primary border-brand-primary"
                              : "border-border bg-transparent",
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <Typography
                          variant="body4"
                          weight="semibold"
                          as="span"
                          color="inherit"
                          className="flex-1"
                        >
                          {option.label}
                        </Typography>
                      </div>
                    </Button>
                  );
                })
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
        color="default"
        size="auto"
        fullWidth
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between rounded-md border bg-input py-2 px-4 min-h-[52px] text-left text-medium outline-none transition-all hover:bg-input/80",
          "border-border dark:border-white/20",
          className,
          isOpen && "border-brand-primary ring-1 ring-brand-primary",
          error &&
            "!border-red-500 ring-1 !ring-red-500/20 hover:!border-red-500",
          disabled &&
            "opacity-50 !cursor-not-allowed bg-muted/20 hover:!bg-muted/20",
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 py-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-sm border border-brand-primary/20 group/chip"
              >
                <span className="leading-none">{opt.label}</span>
                <X
                  className="h-3.5 w-3.5 cursor-pointer shrink-0 text-brand-primary/40 group-hover/chip:text-brand-primary transition-colors"
                  onClick={(e) => removeOption(e, opt.id)}
                />
              </div>
            ))
          ) : (
            <Typography
              variant="body4"
              weight="medium"
              as="span"
              className="text-muted-foreground/60 dark:text-white/40"
            >
              {placeholder}
            </Typography>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground/60 flex-shrink-0 transition-transform",
            isOpen && "rotate-180 text-brand-primary",
          )}
        />
      </Button>

      {mounted && typeof document !== "undefined"
        ? createPortal(menuNode, document.body)
        : null}
    </div>
  );
}
