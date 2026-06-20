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

// 3. Copy frontend to deploy/public and add .htaccess for Apache SPA routing
console.log("\n3. Copying frontend to deploy/public...");
await cp(frontendOut, path.join(deployDir, "public"), { recursive: true });

// .htaccess so Apache shared hosting serves index.html for all SPA routes
const htaccess = `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
`;
await writeFile(path.join(deployDir, "public", ".htaccess"), htaccess);

// sitemap.xml for pukhrajherbals.com
const BASE_URL = "https://pukhrajherbals.com";
const TODAY = new Date().toISOString().split("T")[0];
const sitemapRoutes = [
  { loc: "/",               priority: "1.0", changefreq: "weekly"  },
  { loc: "/about",          priority: "0.9", changefreq: "monthly" },
  { loc: "/products",       priority: "0.9", changefreq: "weekly"  },
  { loc: "/categories",     priority: "0.8", changefreq: "weekly"  },
  { loc: "/manufacturing",  priority: "0.8", changefreq: "monthly" },
  { loc: "/certifications", priority: "0.7", changefreq: "monthly" },
  { loc: "/sustainability",  priority: "0.7", changefreq: "monthly" },
  { loc: "/blog",           priority: "0.8", changefreq: "weekly"  },
  { loc: "/contact",        priority: "0.7", changefreq: "monthly" },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(deployDir, "public", "sitemap.xml"), sitemap);
console.log("   ✓ sitemap.xml generated for pukhrajherbals.com");

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

// 7. Package into two separate archives
const outDir = path.resolve(root, "deploy_output");
await mkdir(outDir, { recursive: true });

const frontendArchive = path.join(outDir, "frontend-shared-hosting.tar.gz");
const backendArchive  = path.join(outDir, "backend-vps.tar.gz");

// Frontend: everything in deploy/public (upload to public_html root)
execSync(`tar -czf "${frontendArchive}" -C "${path.join(deployDir, "public")}" .`);

// Backend: index.cjs, seed.cjs, package.json, uploads/
execSync(`tar -czf "${backendArchive}" -C "${deployDir}" index.cjs seed.cjs package.json uploads`);

console.log("\n=== ✅ Build complete! ===");
console.log("\n📦 Two archives created in deploy_output/:");
console.log(`   frontend-shared-hosting.tar.gz  → upload to public_html on shared hosting`);
console.log(`   backend-vps.tar.gz              → upload & run on VPS (port 6396)`);
console.log("\nVPS startup:");
console.log("  PORT=6396 BASE_PATH=/pukhrajherbals MONGODB_URI='...' SESSION_SECRET='...' node index.cjs");
