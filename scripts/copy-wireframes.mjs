#!/usr/bin/env node
/** Copy wireframes into public/ for static hosting on Vercel at /wireframes/ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "wireframes");
const dest = path.join(root, "public", "wireframes");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "data" || entry.name === "lib" || entry.name.endsWith(".mjs")) {
      continue;
    }
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(src)) {
  console.warn("wireframes/ not found — skipping copy");
  process.exit(0);
}

fs.rmSync(dest, { recursive: true, force: true });
copyDir(src, dest);
console.log("Copied wireframes → public/wireframes/");
