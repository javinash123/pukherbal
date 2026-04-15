import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public: get all settings as key→value map
router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(settingsTable);
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    res.json(map);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: upsert a setting
router.put("/admin/settings/:key", authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) { res.status(400).json({ error: "value is required" }); return; }
    const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
    if (existing.length) {
      const [s] = await db.update(settingsTable).set({ value, updatedAt: new Date() }).where(eq(settingsTable.key, key)).returning();
      res.json(s);
    } else {
      const [s] = await db.insert(settingsTable).values({ key, value }).returning();
      res.json(s);
    }
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
