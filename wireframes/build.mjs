#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  groupScreensByModule,
  journeys,
  renderJourney,
  screens,
} from "./data/screens.mjs";
import { renderHub, renderPage } from "./lib/render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, "pages");

fs.mkdirSync(pagesDir, { recursive: true });

for (let i = 0; i < screens.length; i++) {
  const screen = screens[i];
  const prev = screens[i - 1] ?? null;
  const next = screens[i + 1] ?? null;
  const mobile = screen.viewport === "mobile";
  const bodyHtml = screen.render({ mobile });
  const html = renderPage(screen, bodyHtml, prev, next);
  fs.writeFileSync(path.join(pagesDir, screen.file), html, "utf8");
  console.log(`Generated pages/${screen.file}`);
}

for (const journey of journeys) {
  const bodyHtml = renderJourney(journey);
  const pseudoScreen = {
    id: journey.id,
    file: journey.file,
    title: journey.title,
    module: "User journeys",
  };
  const html = renderPage(pseudoScreen, bodyHtml, null, null);
  fs.writeFileSync(path.join(pagesDir, journey.file), html, "utf8");
  console.log(`Generated pages/${journey.file}`);
}

const hubHtml = renderHub(groupScreensByModule(screens));
fs.writeFileSync(path.join(__dirname, "index.html"), hubHtml, "utf8");
console.log("Generated index.html");

const manifest = {
  generatedAt: new Date().toISOString(),
  screenCount: screens.length,
  journeyCount: journeys.length,
  mobileScreens: screens.filter((s) => s.viewport === "mobile").map((s) => s.file),
  screens: screens.map((s) => ({
    id: s.id,
    file: `pages/${s.file}`,
    title: s.title,
    module: s.module,
    viewport: s.viewport ?? "desktop",
    role: s.role ?? "public",
  })),
  journeys: journeys.map((j) => ({
    id: j.id,
    file: `pages/${j.file}`,
    title: j.title,
    steps: j.steps.length,
  })),
};

fs.writeFileSync(
  path.join(__dirname, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8",
);
console.log("Generated manifest.json");
console.log(`Done — ${screens.length} screens, ${journeys.length} journeys.`);
