/**
 * Jaipur Stonecraft — Hostinger & Production Node.js Server Entry Point
 *
 * Designed for Hostinger Business Node.js Application Manager, PM2, and cloud environments.
 * Honors PORT, HOSTNAME, and NODE_ENV environment variables seamlessly.
 */

import { createServer } from "http";
import { parse } from "url";
import fs from "fs";
import path from "path";
import next from "next";

// Load environment configuration from .env if present and apply to process.env
try {
  const envCandidate = path.join(process.cwd(), ".env");
  if (fs.existsSync(envCandidate)) {
    const lines = fs.readFileSync(envCandidate, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...rest] = trimmed.split("=");
        const v = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
        if (k && v !== undefined) {
          process.env[k.trim()] = v;
        }
      }
    }
  }
} catch (e) {
  // Non-fatal if .env is missing
}

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

/**
 * Ensure required persistent upload directory tree exists on startup
 */
function ensureUploadDirectories() {
  const folders = [
    "public/uploads/products/raw",
    "public/uploads/products/display",
    "public/uploads/products/card",
    "public/uploads/products/thumb",
    "public/uploads/categories/raw",
    "public/uploads/categories/display",
    "public/uploads/categories/card",
    "public/uploads/categories/thumb",
  ];
  for (const f of folders) {
    const dir = path.join(process.cwd(), f);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  ensureUploadDirectories();
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling request:", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error("Server fatal startup error:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Jaipur Stonecraft production server running on http://${hostname}:${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
    });
});
