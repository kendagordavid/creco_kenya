#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
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

function stopPid(pid) {
  if (!pid || selfPids.has(pid)) return;
  try {
    process.kill(pid, "SIGKILL");
  } catch {
    // Process already exited.
  }
}

const lockPath = join(root, ".next", "dev", "lock");
if (existsSync(lockPath)) {
  try {
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    stopPid(Number(lock.pid));
  } catch {
    // Ignore unreadable lock files.
  }
}

for (const port of [3000, 3002]) {
  const pids = run(`lsof -ti:${port}`);
  if (!pids) continue;
  for (const pid of pids.split(/\s+/)) {
    stopPid(Number(pid));
  }
}

if (existsSync(lockPath)) {
  rmSync(lockPath, { force: true });
}

console.log("Cleared stale Next.js dev servers on ports 3000/3002.");
