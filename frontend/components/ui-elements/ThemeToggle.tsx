"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="action" size="rounded-icon" className="opacity-0">
        <Sun size={18} />
      </Button>
    );
  }

  return (
    <Button
      variant="action"
      size="rounded-icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon size={18} className="transition-all" />
      ) : (
        <Sun size={18} className="transition-all" />
      )}
    </Button>
  );
}
