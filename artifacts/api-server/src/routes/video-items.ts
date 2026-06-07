import { Router } from "express";
import { VideoItem } from "@workspace/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public: active video items
router.get("/video-items", async (_req, res) => {
  try {
    const items = await VideoItem.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(items);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: all items
router.get("/admin/video-items", authMiddleware, async (_req, res) => {
  try {
    const items = await VideoItem.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(items);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/video-items", authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, videoUrl, thumbnailUrl, active = true, sortOrder = 0, productId, productSlug } = req.body;
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const item = await VideoItem.create({ title, subtitle, videoUrl, thumbnailUrl, active, sortOrder, productId, productSlug });
    res.status(201).json(item);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/video-items/:id", authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, videoUrl, thumbnailUrl, active, sortOrder, productId, productSlug } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (videoUrl !== undefined) updates.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) updates.thumbnailUrl = thumbnailUrl;
    if (active !== undefined) updates.active = active;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (productId !== undefined) updates.productId = productId;
    if (productSlug !== undefined) updates.productSlug = productSlug;
    const item = await VideoItem.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(item);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/video-items/:id", authMiddleware, async (req, res) => {
  try {
    await VideoItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
