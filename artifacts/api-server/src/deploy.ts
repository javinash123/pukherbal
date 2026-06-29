import express, { type Express, type Request, type Response } from "express";
import path from "node:path";
import fs from "node:fs";
import cors from "cors";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

function loadEnvFile(filepath: string) {
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const appDir = path.dirname(typeof __filename !== "undefined" ? __filename : "");
loadEnvFile(path.join(appDir, ".env"));

if (!process.env["NODE_ENV"]) process.env["NODE_ENV"] = "production";

const PORT = Number(process.env["PORT"]) || 6396;
const BASE_PATH = process.env["BASE_PATH"] ?? "";
const publicDir = path.join(appDir, "public");
const uploadsDir = path.join(appDir, "uploads");

const app: Express = express();

app.use(cors({
  origin: [
    "https://pukhrajherbals.com",
    "https://www.pukhrajherbals.com",
    /localhost/,
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use(`${BASE_PATH}/api/uploads`, express.static(uploadsDir));

pool.query("SELECT 1")
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch((err) => {
    logger.error({ err }, "Failed to connect to PostgreSQL");
    process.exit(1);
  });

// API routes
app.use(`${BASE_PATH}/api`, router);

// Static frontend assets (serves index.html for directory requests by default)
app.use(
  BASE_PATH || "/",
  express.static(publicDir, {
    index: "index.html",
    maxAge: "7d",
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// SPA fallback - send index.html for any deep client-side route
app.get(`${BASE_PATH || ""}/*splat`, (_req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Root redirect to BASE_PATH for convenience (only when BASE_PATH is non-empty)
if (BASE_PATH) {
  app.get("/", (_req: Request, res: Response) => {
    res.redirect(BASE_PATH + "/");
  });
}

app.listen(PORT, () => {
  logger.info({ port: PORT, basePath: BASE_PATH }, `Server listening on http://localhost:${PORT}${BASE_PATH}/`);
});
