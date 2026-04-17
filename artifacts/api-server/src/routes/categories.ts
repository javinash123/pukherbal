import { Router } from "express";
import { Category } from "../models/Category";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// Public: list active categories
router.get("/categories", async (_req, res) => {
  try {
    const cats = await Category.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(cats.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all
router.get("/admin/categories", authMiddleware, async (_req, res) => {
  try {
    const cats = await Category.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(cats.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/categories", authMiddleware, async (req, res) => {
  try {
    const { name, description, imageUrl, active = true, sortOrder = 0 } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = slugify(name) + "-" + Date.now();
    const cat = await Category.create({ name, slug, description, imageUrl, active, sortOrder });
    res.status(201).json(serialize(cat));
  } catch (err: any) {
    if (err.code === 11000) { res.status(409).json({ error: "Category already exists" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update
router.put("/admin/categories/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, imageUrl, active, sortOrder } = req.body;
    const updates: any = {};
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name) + "-" + Date.now(); }
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const cat = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!cat) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(cat));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/categories/:id", authMiddleware, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
