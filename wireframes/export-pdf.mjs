#!/usr/bin/env node
/**
 * Export wireframe hub and key screens to PDF for CRECO submission.
 * Uses Puppeteer (downloads Chromium on first run).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportDir = path.join(__dirname, "export");
const pagesDir = path.join(__dirname, "pages");

fs.mkdirSync(exportDir, { recursive: true });

const keyPages = [
  "index.html",
  "pages/00-sitemap-roles.html",
  "pages/01-home-desktop.html",
  "pages/01-home-mobile.html",
  "pages/10-knowledge-hub.html",
  "pages/20-compliance-hub.html",
  "pages/30-guidance-desktop.html",
  "pages/30-guidance-mobile.html",
  "pages/40-monitoring-hub.html",
  "pages/41-monitoring-registration-mobile.html",
  "pages/50-dashboard-desktop.html",
  "pages/56-cms-dashboard.html",
  "pages/journey-01-knowledge-assessment.html",
  "pages/journey-03-monitoring-submit.html",
  "pages/journey-04-moderation.html",
];

async function main() {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.log("Puppeteer not installed. Installing for PDF export...");
    const { execSync } = await import("node:child_process");
    execSync("npm install --no-save puppeteer", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
    puppeteer = await import("puppeteer");
  }

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const pdfPath = path.join(exportDir, "CRECO-PBO-Wireframes.pdf");

  const combinedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CRECO PBO Wireframes</title>
  <style>
    @page { margin: 1.5cm; size: A4 landscape; }
    body { font-family: system-ui, sans-serif; margin: 0; }
    .cover { page-break-after: always; padding: 3rem; text-align: center; }
    .cover h1 { color: #0a864d; font-size: 2rem; }
    .section { page-break-before: always; }
    .section h2 { color: #0a864d; border-bottom: 2px solid #0a864d; padding-bottom: 0.5rem; }
    iframe { width: 100%; height: 680px; border: 1px solid #ddd; border-radius: 4px; }
    .note { font-size: 0.875rem; color: #666; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>CRECO PBO Act Platform</h1>
    <p>UI/UX Wireframes — ToR Deliverable #2</p>
    <p>CRECO Kenya · ICNL Partnership · July 2026</p>
    <p style="margin-top:2rem;font-size:0.875rem;color:#666">
      48 screens · 6 user journeys · 4 mobile variants<br>
      Full interactive version: wireframes/index.html
    </p>
  </div>
  ${keyPages
    .filter((p) => p !== "index.html")
    .map((p) => {
      const title = path.basename(p, ".html");
      return `<div class="section">
    <h2>${title}</h2>
    <p class="note">Source: wireframes/${p}</p>
    <iframe src="../${p}" title="${title}"></iframe>
  </div>`;
    })
    .join("\n")}
</body>
</html>`;

  const combinedPath = path.join(exportDir, "combined.html");
  fs.writeFileSync(combinedPath, combinedHtml);

  const page = await browser.newPage();
  const fileUrl = `file://${combinedPath}`;
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 60000 });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
  });

  await browser.close();
  console.log(`PDF exported: ${pdfPath}`);

  // Also write a simple index for export folder
  fs.writeFileSync(
    path.join(exportDir, "README.txt"),
    `CRECO PBO Wireframes PDF Export\n\nFile: CRECO-PBO-Wireframes.pdf\nGenerated: ${new Date().toISOString()}\n\nFor full interactive wireframes, open ../index.html in a browser.\n`,
  );
}

main().catch((err) => {
  console.error("PDF export failed:", err.message);
  console.error("\nFallback: open wireframes/index.html and use browser Print → Save as PDF.");
  process.exit(1);
});
