---
name: MongoDB→PostgreSQL migration
description: API server was migrated from Mongoose/MongoDB to pg/PostgreSQL. Key decisions and gotchas for future reference.
---

## Key facts

- **Build entry**: `artifacts/api-server/src/deploy.ts` (NOT `src/index.ts`). esbuild bundles this into `dist/index.cjs`.
- **Database**: Only PostgreSQL is available (`DATABASE_URL`). No MongoDB.
- **Compatibility layer**: `lib/db/src/models.ts` exports Mongoose-API-compatible model objects (`find`, `findOne`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`, `findOneAndUpdate`) backed by raw `pg` Pool. Routes don't need changes.
- **`pg` package**: Installed in `lib/db` (not root). esbuild bundles it at build time.
- **`pool` export**: `lib/db/src/models.ts` exports `pool` directly; `lib/db/src/index.ts` re-exports it. `deploy.ts` imports `pool` from `@workspace/db` for startup connection check.
- **ID handling**: All table IDs are `SERIAL` (integer), exposed as strings via `rowToDoc()`. Routes work unchanged.
- **`category_id` in products**: Stored as TEXT (not INTEGER) to avoid type coercion issues when filtering by string IDs.
- **Unique violations**: pg error code `'23505'` is re-thrown as `code: 11000` to match Mongoose behavior in route catch blocks.
- **`toJSON()`**: `rowToDoc()` adds a `toJSON()` method so `res.json(doc)` and `{ ...cat.toJSON(), products }` both work correctly.
- **Admin seed**: `admin@pukhrajherbals.com` / `admin123` seeded into `users` table.

**Why:** Replit only provides PostgreSQL via `DATABASE_URL`; MONGODB_URI is not set and cannot be set on the free tier without an external Atlas connection.

**How to apply:** If adding new tables, add CREATE TABLE to the DB directly and add a new `makeModel<any>('table_name')` export in `lib/db/src/models.ts`.
