import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { rm, mkdir, cp, writeFile, readdir } from "node:fs/promises";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

globalThis.require = createRequire(import.meta.url);

const apiServerDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(apiServerDir, "../..");
const deployDir = path.resolve(root, "deploy");
const frontendSrc = path.resolve(root, "artifacts/herbal-homepage");
const frontendOut = path.resolve(frontendSrc, "dist/public");

console.log("=== Pukhraj Herbals — Deployment Build ===\n");

// 1. Clean deploy dir
console.log("1. Cleaning previous deploy folder...");
await rm(deployDir, { recursive: true, force: true });
await mkdir(deployDir, { recursive: true });

// 2. Build frontend
console.log("\n2. Building frontend (React + Vite)...");
execSync("pnpm --filter @workspace/herbal-homepage run build", {
  env: {
    ...process.env,
    PORT: "3000",
    BASE_PATH: "/pukhrajherbals/",
    NODE_ENV: "production",
    VITE_API_BASE: "/pukhrajherbals/api",
    REPL_ID: "",
  },
  stdio: "inherit",
  cwd: root,
});

if (!existsSync(frontendOut)) {
  throw new Error("Frontend build failed — dist/public not found");
}

// 3. Copy frontend to deploy/public
console.log("\n3. Copying frontend to deploy/public...");
await cp(frontendOut, path.join(deployDir, "public"), { recursive: true });

const esbuildOpts = {
  platform: "node",
  bundle: true,
  format: "cjs",
  outdir: deployDir,
  outExtension: { ".js": ".cjs" },
  logLevel: "info",
  sourcemap: false,
  tsconfig: path.resolve(apiServerDir, "tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"' },
  // Include lib/db/node_modules so mongoose (installed there) is resolvable
  nodePaths: [
    path.resolve(root, "lib/db/node_modules"),
    path.resolve(root, "node_modules"),
  ],
  external: [
    "*.node", "pg-native", "sharp", "better-sqlite3", "sqlite3", "canvas",
    "bcrypt", "argon2", "fsevents", "re2", "bufferutil", "utf-8-validate",
    "dtrace-provider", "oracledb", "mysql2", "mongodb-client-encryption",
    "lightningcss", "sass-embedded",
  ],
};

// 4. Build server + seed script
console.log("\n4. Bundling backend (index.cjs) and seed script (seed.cjs)...");
await build({
  ...esbuildOpts,
  entryPoints: {
    index: path.resolve(apiServerDir, "src/deploy-server.ts"),
    seed:  path.resolve(apiServerDir, "src/scripts/seed-mongo.ts"),
  },
  // Polyfill globalThis.crypto for Node.js < 19
  // Node.js 15-18 has require('crypto').webcrypto which is the full Web Crypto API
  banner: {
    js: `(function(){if(typeof globalThis.crypto==='undefined'||typeof globalThis.crypto.getRandomValues==='undefined'){var nc=require('crypto');globalThis.crypto=nc.webcrypto||(nc.subtle?nc:{getRandomValues:function(b){return nc.randomFillSync(b)}});}})();`,
  },
});

// 5. Create package.json
console.log("\n5. Writing package.json...");
const pkg = {
  name: "pukhraj-herbals",
  version: "1.0.0",
  description: "Pukhraj Herbals — Production Server",
  main: "index.cjs",
  engines: { node: ">=18" },
  scripts: {
    start: "node index.cjs",
    seed: "node seed.cjs",
  },
};
await writeFile(path.join(deployDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

// 6. Create uploads dir placeholder
await mkdir(path.join(deployDir, "uploads"), { recursive: true });
await writeFile(path.join(deployDir, "uploads", ".gitkeep"), "");

// 7. Summary
const files = await readdir(deployDir);
console.log("\n=== ✅ Build complete! ===");
console.log(`\nOutput: deploy/`);
console.log("Contents:", files.join(", "));
console.log("\nRequired env vars on your server:");
console.log("  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname");
console.log("  SESSION_SECRET=your-secret-key");
console.log("\nOptional env vars:");
console.log("  PORT=6396       (default: 6396)");
console.log("  BASE_PATH=/pukhrajherbals  (default: /pukhrajherbals)");
console.log("\nTo start:");
console.log("  node index.cjs");
console.log("\nApp URL: http://your-server:6396/pukhrajherbals/");
