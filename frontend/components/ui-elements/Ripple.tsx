"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const size = Math.max(container.offsetWidth, container.offsetHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  return { ripples, createRipple, removeRipple };
};

export const RippleContainer = ({
  ripples,
  onRemove,
  color = "bg-white/30",
}: {
  ripples: Ripple[];
  onRemove: (id: number) => void;
  color?: string;
}) => (
  <span className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <AnimatePresence initial={false}>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onAnimationComplete={() => onRemove(ripple.id)}
          className={`absolute rounded-full ${color}`}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </AnimatePresence>
  </span>
);
