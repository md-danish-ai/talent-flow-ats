"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Loader2, X } from "lucide-react";
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
  isClearable?: boolean;
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
  isClearable = true,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actualPlacement, setActualPlacement] = useState<"top" | "bottom">(
    placement,
  );
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        String(opt.id).toLowerCase().includes(term),
    );
  }, [options, searchTerm]);

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
        setSearchTerm("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const updateCoords = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (
        placement === "bottom" &&
        spaceBelow < 320 &&
        spaceAbove > spaceBelow
      ) {
        setActualPlacement("top");
      } else if (
        placement === "top" &&
        spaceAbove < 320 &&
        spaceBelow > spaceAbove
      ) {
        setActualPlacement("bottom");
      } else {
        setActualPlacement(placement);
      }

      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [placement]);

  const toggleDropdown = () => {
    if (disabled) return;
    if (!mounted) setMounted(true);
    if (!isOpen) {
      updateCoords();
      setIsOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setIsOpen(false);
      setSearchTerm("");
      triggerRef.current?.focus();
    }
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
  }, [isOpen, updateCoords]);

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
              actualPlacement === "top"
                ? coords.top - 8
                : coords.top + coords.height + 8,
            left: coords.left,
            width: "max-content",
            minWidth: coords.width,
            maxWidth: 320,
            zIndex: 10000,
            transform: actualPlacement === "top" ? "translateY(-100%)" : "none",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: actualPlacement === "top" ? 4 : -4,
              scale: 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: actualPlacement === "top" ? 4 : -4,
              scale: 0.98,
            }}
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
              ) : filteredOptions.length === 0 ? (
                <div className="py-3 px-4 text-center">
                  <Typography
                    variant="body4"
                    className="italic text-muted-foreground font-medium"
                  >
                    {searchTerm ? "No matching options" : emptyMessage}
                  </Typography>
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <React.Fragment key={option.id}>
                    {index > 0 && (
                      <div className="mx-2 my-0.5 border-t border-slate-100 dark:border-white/5" />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        onChange(option.id);
                        setIsOpen(false);
                        setSearchTerm("");
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
                  </React.Fragment>
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
      <div
        ref={triggerRef}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            if (!isOpen) {
              e.preventDefault();
              toggleDropdown();
            }
          } else if (e.key === "Escape") {
            if (isOpen) {
              e.preventDefault();
              setIsOpen(false);
              setSearchTerm("");
              triggerRef.current?.focus();
            }
          }
        }}
        className={cn(
          "group flex items-center justify-between rounded-md border bg-input py-3.5 px-4 text-left text-medium outline-none transition-all cursor-pointer min-h-[46px]",
          "border-border dark:border-white/20",
          "focus-visible:border-brand-primary focus-visible:ring-1 focus-visible:ring-brand-primary",
          "focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary",
          className,
          isOpen && "border-brand-primary ring-1 ring-brand-primary",
          error &&
          "!border-red-500 ring-1 !ring-red-500/20 hover:!border-red-500",
          disabled &&
          "opacity-50 !cursor-not-allowed bg-muted/20 hover:!bg-muted/20",
        )}
      >
        <div className="flex items-center justify-between w-full gap-2 min-w-0">
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                updateCoords();
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setIsOpen(false);
                  setSearchTerm("");
                  triggerRef.current?.focus();
                }
              }}
              placeholder={selectedOption ? selectedOption.label : placeholder}
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none p-0 border-0 focus:ring-0"
              autoFocus
            />
          ) : (
            <Typography
              variant="body4"
              weight="medium"
              as="span"
              className={cn(
                "truncate transition-colors w-full select-none",
                selectedOption
                  ? "text-foreground"
                  : "text-muted-foreground/60 dark:text-white/40",
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Typography>
          )}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isClearable && selectedOption && !disabled && (
              <button
                type="button"
                tabIndex={0}
                title="Clear selection"
                aria-label="Clear selection"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setSearchTerm("");
                  triggerRef.current?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onChange("");
                    setSearchTerm("");
                    triggerRef.current?.focus();
                  }
                }}
                className="p-1 rounded-full text-muted-foreground/60 hover:bg-brand-primary/10 hover:text-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              tabIndex={0}
              title="Toggle dropdown"
              aria-label="Toggle dropdown"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  toggleDropdown();
                }
              }}
              className={cn(
                "p-1 rounded-full text-muted-foreground/60 hover:bg-brand-primary/10 hover:text-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none transition-all cursor-pointer",
                isOpen && "bg-brand-primary/10 text-brand-primary",
              )}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180 text-brand-primary",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {mounted && typeof document !== "undefined"
        ? createPortal(menuNode, document.body)
        : null}
    </div>
  );
}
