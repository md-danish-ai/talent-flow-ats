"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedCollapsibleProps {
  isOpen: boolean;
  children: React.ReactNode;
}

/** Smooth height-animated collapsible wrapper using framer-motion */
export const AnimatedCollapsible: React.FC<AnimatedCollapsibleProps> = ({
  isOpen,
  children,
}) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="overflow-hidden"
      >
        <div className="pl-6 space-y-1 pt-1 pb-2">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);
