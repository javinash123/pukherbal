import { Router } from "express";
import { Video } from "../models/Video";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// Public: list active videos
router.get("/videos", async (_req, res) => {
  try {
    const videos = await Video.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(videos.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all videos
router.get("/admin/videos", authMiddleware, async (_req, res) => {
  try {
    const videos = await Video.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(videos.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/videos", authMiddleware, async (req, res) => {
  try {
    const { title, youtubeUrl, sortOrder, active } = req.body;
    if (!title || !youtubeUrl) { res.status(400).json({ error: "title and youtubeUrl are required" }); return; }
    const video = await Video.create({ title, youtubeUrl, sortOrder: sortOrder ?? 0, active: active ?? true });
    res.status(201).json(serialize(video));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/videos/:id", authMiddleware, async (req, res) => {
  try {
    const { title, youtubeUrl, sortOrder, active } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (youtubeUrl !== undefined) updates.youtubeUrl = youtubeUrl;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (active !== undefined) updates.active = active;
    const video = await Video.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!video) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(video));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/videos/:id", authMiddleware, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
