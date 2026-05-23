import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm, cp, mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

// No pino plugin needed for production — pino-pretty is dev-only and gets
// tree-shaken out when NODE_ENV is hardcoded to "production" via define.

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(apiDir, "../..");
const frontendDir = path.resolve(repoRoot, "artifacts/herbal-homepage");
const distDir = path.resolve(apiDir, "dist-deploy");

// 1. Clean
await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
console.log("✓ Cleaned dist-deploy/");

// 2. Build backend deploy.ts → dist-deploy/index.cjs
console.log("Building backend…");
await esbuild({
  entryPoints: [path.resolve(apiDir, "src/deploy.ts")],
  platform: "node",
  target: "node18",
  bundle: true,
  format: "cjs",
  outfile: path.join(distDir, "index.cjs"),
  logLevel: "info",
  external: ["*.node", "bcrypt", "argon2", "sharp", "canvas", "better-sqlite3",
    "sqlite3", "fsevents", "re2", "bufferutil", "utf-8-validate", "cpu-features",
    "dtrace-provider", "isolated-vm", "lightningcss", "pg-native", "oracledb",
    "mongodb-client-encryption"],
  minify: false,
  sourcemap: false,
  legalComments: "none",
  // Hardcode NODE_ENV so esbuild tree-shakes away the pino-pretty dev transport
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
console.log("✓ Backend built → dist-deploy/index.cjs");

// 3. Build frontend with /pukhrajherbals base
console.log("Building frontend…");
execSync("pnpm --filter @workspace/herbal-homepage run build", {
  cwd: repoRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: "3000",
    BASE_PATH: "/pukhrajherbals/",
  },
});
console.log("✓ Frontend built");

// 4. Copy frontend output → dist-deploy/public
const frontendPublic = path.resolve(frontendDir, "dist/public");
await cp(frontendPublic, path.join(distDir, "public"), { recursive: true });
console.log("✓ Frontend copied → dist-deploy/public/");

// 5. Write minimal package.json (for node to resolve the entry point)
await writeFile(path.join(distDir, "package.json"), JSON.stringify({
  name: "pukhraj-herbal",
  version: "1.0.0",
  description: "Pukhraj Herbal website server",
  main: "index.cjs",
  scripts: { start: "node index.cjs" },
  engines: { node: ">=18" }
}, null, 2));
console.log("✓ package.json written");

console.log(`
╔════════════════════════════════════════════════════════╗
║    BUILD COMPLETE  →  artifacts/api-server/dist-deploy  ║
╠════════════════════════════════════════════════════════╣
║  dist-deploy/                                          ║
║    index.cjs        ← Node.js server (entry point)    ║
║    public/          ← React frontend (built assets)    ║
║    package.json     ← package descriptor               ║
║                                                        ║
║  Run:  MONGODB_URI=... node index.cjs                  ║
║  URL:  http://localhost:6396/pukhrajherbals/            ║
╚════════════════════════════════════════════════════════╝
`);
