"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@components/ui-elements/Button";
import { getCanonicalImageUrl } from "@lib/utils/image";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  src,
  title,
}) => {
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    React.startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      React.startTransition(() => {
        setScale(1); // Reset scale on open
      });
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md cursor-zoom-out"
            onClick={onClose}
          />

          {/* Controls Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[10001] flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-brand-primary" />
              <span className="text-white font-semibold tracking-wide uppercase text-sm">
                {title || "Image Preview"}
              </span>
            </div>
            <div className="flex items-center gap-2 pointer-events-auto">
              <Button
                variant="ghost"
                color="default"
                size="icon-sm"
                onClick={() => setScale((s) => Math.min(s + 0.5, 3))}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ZoomIn size={20} />
              </Button>
              <Button
                variant="ghost"
                color="default"
                size="icon-sm"
                onClick={() => setScale((s) => Math.max(s - 0.5, 0.5))}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ZoomOut size={20} />
              </Button>
              <Button
                variant="ghost"
                color="default"
                size="icon-sm"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/20 ml-2"
              >
                <X size={24} />
              </Button>
            </div>
          </motion.div>

          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{
              opacity: 1,
              scale: scale,
              rotateX: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
            className="relative z-[10000] w-full h-full flex items-center justify-center p-4 sm:p-8 pointer-events-none"
          >
            <div className="relative w-full h-full max-w-7xl max-h-[85vh] pointer-events-auto">
              <Image
                src={getCanonicalImageUrl(src)}
                alt={title || "Preview"}
                fill
                unoptimized
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300"
                priority
              />
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white/50 text-[10px] uppercase tracking-[0.2em] font-medium"
          >
            Click outside or press ESC to close
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(lightboxContent, document.body);
};
