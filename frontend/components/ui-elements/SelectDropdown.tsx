import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";

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
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  // Determine standard versus top/bottom styling
  const placementStyles =
    placement === "top"
      ? "bottom-full mb-2 origin-bottom"
      : "top-full mt-2 origin-top";

  return (
    <div className={cn("relative w-full", wrapperClassName)} ref={dropdownRef}>
      <Button
        type="button"
        variant="ghost"
        color="default"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border bg-white py-3.5 px-4 text-left text-medium outline-none transition-all hover:bg-white",
          isOpen
            ? "border-brand-primary ring-1 ring-brand-primary"
            : error
              ? "border-red-300"
              : "border-slate-200",
          className,
        )}
      >
        <span
          className={cn(
            "font-medium truncate mr-2",
            selectedOption ? "text-slate-800" : "text-slate-400",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-slate-400 flex-shrink-0 transition-transform",
            isOpen && "rotate-180 text-brand-primary",
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: placement === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === "top" ? 4 : -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute left-0 right-0 z-50 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl",
              placementStyles,
            )}
          >
            <div className="max-h-[240px] overflow-y-auto">
              {options.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant="ghost"
                  color="default"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold transition-all mb-0.5 last:mb-0 justify-between",
                    value === option.id
                      ? "bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {option.label}
                  {value === option.id && <Check className="h-4 w-4" />}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
