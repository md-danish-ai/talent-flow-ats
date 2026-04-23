/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@components": path.resolve(__dirname, "./components"),
      "@hooks": path.resolve(__dirname, "./hooks"),
      "@types": path.resolve(__dirname, "./types"),
      "@utils": path.resolve(__dirname, "./utils"),
    },
  },
});
