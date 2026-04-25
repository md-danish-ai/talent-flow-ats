"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="action"
        color="primary"
        size="rounded-icon"
        animate="scale"
        iconAnimation="rotate-90"
        className="opacity-0"
      >
        <Sun size={20} />
      </Button>
    );
  }

  return (
    <Button
      variant="action"
      color="primary"
      size="rounded-icon"
      animate="scale"
      iconAnimation="rotate-90"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute flex items-center justify-center"
            >
              <Sun size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute flex items-center justify-center"
            >
              <Moon size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Button>
  );
}
