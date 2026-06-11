/**
 * Build ONLY the frontend for hosting at https://pukhrajherbals.com/
 * The backend continues to run at port 6396 under /pukhrajherbals/api.
 * nginx on the server will proxy /pukhrajherbals/api/* → localhost:6396.
 *
 * Usage:  node build-frontend.mjs
 * Output: frontend-deploy/ (static files to serve at domain root)
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { rm, mkdir, cp, readdir } from "node:fs/promises";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const apiServerDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(apiServerDir, "../..");
const deployDir = path.resolve(root, "frontend-deploy");
const frontendSrc = path.resolve(root, "artifacts/herbal-homepage");
const frontendOut = path.resolve(frontendSrc, "dist/public");

console.log("=== Pukhraj Herbals — Frontend Build (pukhrajherbals.com) ===\n");

// 1. Clean
console.log("1. Cleaning previous frontend-deploy folder...");
await rm(deployDir, { recursive: true, force: true });
await mkdir(deployDir, { recursive: true });

// 2. Build frontend
//    BASE_PATH=/ → site lives at https://pukhrajherbals.com/  (root)
//    VITE_API_BASE=/pukhrajherbals/api → nginx proxies this to the backend
console.log("\n2. Building frontend (React + Vite)...");
execSync("pnpm --filter @workspace/herbal-homepage run build", {
  env: {
    ...process.env,
    PORT: "3000",
    BASE_PATH: "/",
    NODE_ENV: "production",
    VITE_API_BASE: "https://api.pukhrajherbals.com/pukhrajherbals/api",
    REPL_ID: "",
  },
  stdio: "inherit",
  cwd: root,
});

if (!existsSync(frontendOut)) {
  throw new Error("Frontend build failed — dist/public not found");
}

// 3. Copy output
console.log("\n3. Copying build output to frontend-deploy/...");
await cp(frontendOut, deployDir, { recursive: true });

const files = await readdir(deployDir);
console.log("\n=== ✅ Frontend build complete! ===");
console.log(`\nOutput: frontend-deploy/`);
console.log("Contents:", files.join(", "));
console.log(`
Deployment:
  Upload the contents of frontend-deploy/ to your web root
  (e.g. /var/www/pukhrajherbals/public/).

nginx config is in: nginx-pukhrajherbals.conf
`);
