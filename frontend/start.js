/**
 * PM2 Starter for Windows
 * This file is used by PM2 to start the Next.js server.
 * It bypasses npm.cmd issues on Windows by directly calling Next.js via Node.
 */
const { spawn } = require("child_process");
const path = require("path");

const nextBin = path.join(
  __dirname,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const child = spawn(process.execPath, [nextBin, "start"], {
  stdio: "inherit",
  shell: false,
  env: { ...process.env, NODE_ENV: "production" },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
