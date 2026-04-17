import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnOutsideClick = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    React.startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (closeOnOutsideClick) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={handleBackdropClick}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={`relative z-[1000] w-full max-w-4xl bg-card rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden pointer-events-auto ${className}`}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-card">
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
            )}
            <div className="p-6 overflow-y-auto bg-card text-foreground">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};
