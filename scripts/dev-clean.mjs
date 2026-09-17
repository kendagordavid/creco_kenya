#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function run(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

const selfPids = new Set([process.pid, process.ppid].filter((pid) => Number.isFinite(pid)));

for (const port of [3000, 3001]) {
  const pids = run(`lsof -ti:${port}`);
  if (!pids) continue;
  for (const pid of pids.split(/\s+/)) {
    const n = Number(pid);
    if (!n || selfPids.has(n)) continue;
    try {
      process.kill(n, "SIGTERM");
    } catch {
      // Process already exited.
    }
  }
}

const devLock = join(root, ".next", "dev", "lock");
if (existsSync(devLock)) {
  rmSync(devLock, { force: true });
}

console.log("Cleared stale Next.js dev servers on ports 3000/3001.");
