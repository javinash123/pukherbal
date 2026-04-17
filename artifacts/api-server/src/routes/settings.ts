import { Router } from "express";
import { Setting } from "../models/Setting";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public: get all settings as key→value map
router.get("/settings", async (_req, res) => {
  try {
    const rows = await Setting.find();
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
    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    res.json({ key: setting.key, value: setting.value });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
