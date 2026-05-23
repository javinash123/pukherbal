import { Router } from "express";
import { HeroSlide } from "../models/HeroSlide";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// Public: list active hero slides
router.get("/hero-slides", async (_req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(slides.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all hero slides
router.get("/admin/hero-slides", authMiddleware, async (_req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(slides.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/hero-slides", authMiddleware, async (req, res) => {
  try {
    const { imageUrl, title, subtitle, ctaText, ctaLink, sortOrder, active } = req.body;
    if (!imageUrl || !title) { res.status(400).json({ error: "imageUrl and title are required" }); return; }
    const slide = await HeroSlide.create({ imageUrl, title, subtitle, ctaText, ctaLink, sortOrder: sortOrder ?? 0, active: active ?? true });
    res.status(201).json(serialize(slide));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/hero-slides/:id", authMiddleware, async (req, res) => {
  try {
    const { imageUrl, title, subtitle, ctaText, ctaLink, sortOrder, active } = req.body;
    const updates: any = {};
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (ctaText !== undefined) updates.ctaText = ctaText;
    if (ctaLink !== undefined) updates.ctaLink = ctaLink;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (active !== undefined) updates.active = active;
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!slide) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(slide));
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
