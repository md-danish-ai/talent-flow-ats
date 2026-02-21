import React from "react";
import { X } from "lucide-react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { motion, AnimatePresence } from "framer-motion";

export interface InlineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const InlineDrawer: React.FC<InlineDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1], // Consistently matching the smooth easing
          }}
          className={cn(
            "bg-card border-l border-border flex flex-col hidden sm:flex shrink-0 overflow-hidden h-full transition-colors",
            className,
          )}
        >
          <div className="flex flex-row items-center justify-between px-4 border-b border-border h-[61px] w-[320px] shrink-0">
            <Typography
              variant="body1"
              weight="semibold"
              color="text-foreground"
            >
              {title}
            </Typography>
            <Button
              variant="ghost"
              color="default"
              size="icon-sm"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto w-[320px] flex flex-col bg-card">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
