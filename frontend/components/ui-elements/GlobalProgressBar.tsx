"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useIsApiLoading } from "@hooks/useApiLoading";

export function GlobalProgressBar() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isCustomApiLoading = useIsApiLoading();
  
  const isLoading = isFetching > 0 || isMutating > 0 || isCustomApiLoading;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="global-progress-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: [1, 1, 0],
            transition: { duration: 0.6, times: [0, 0.8, 1] }
          }}
          className="fixed top-0 left-0 w-screen z-[999999] h-[5px] pointer-events-none"
        >
          {/* Main Background Track (Subtle) */}
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />

          {/* The Progress Bar */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ 
              width: ["0%", "30%", "65%", "85%", "94%"],
            }}
            exit={{ 
              width: "100%",
              transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
            }}
            transition={{ 
              duration: 20, 
              times: [0, 0.05, 0.4, 0.8, 1],
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="absolute left-0 top-0 h-full bg-[#e85526] shadow-[0_4px_12px_rgba(232,85,38,0.4)]"
          >
            {/* Shimmering Overlay */}
            <motion.div
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />

            {/* Glowing Leading Edge (The "Head") */}
            <div className="absolute right-0 top-0 h-full w-[100px] bg-gradient-to-r from-transparent to-white/40 blur-sm" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#e85526] rounded-full blur-xl opacity-60" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
