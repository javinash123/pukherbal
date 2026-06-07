import { Router } from "express";
import { HeroSlide } from "@workspace/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public: active slides
router.get("/hero-slides", async (_req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(slides);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: all slides
router.get("/admin/hero-slides", authMiddleware, async (_req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(slides);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/hero-slides", authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, imageUrl, active = true, sortOrder = 0 } = req.body;
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const slide = await HeroSlide.create({ title, subtitle, ctaText, ctaLink, imageUrl, active, sortOrder });
    res.status(201).json(slide);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/hero-slides/:id", authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, imageUrl, active, sortOrder } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (ctaText !== undefined) updates.ctaText = ctaText;
    if (ctaLink !== undefined) updates.ctaLink = ctaLink;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!slide) { res.status(404).json({ error: "Not found" }); return; }
    res.json(slide);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/hero-slides/:id", authMiddleware, async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
