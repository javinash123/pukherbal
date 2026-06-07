import { Router } from "express";
import { Category, Product } from "@workspace/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Public: list active categories
router.get("/categories", async (_req, res) => {
  try {
    const cats = await Category.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(cats);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Public: get single category by slug with its products
router.get("/categories/:slug", async (req, res) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug, active: true });
    if (!cat) { res.status(404).json({ error: "Category not found" }); return; }
    const products = await Product.find({ categoryId: cat.id, active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json({ ...cat.toJSON(), products });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all (including inactive)
router.get("/admin/categories", authMiddleware, async (_req, res) => {
  try {
    const cats = await Category.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(cats);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/categories", authMiddleware, async (req, res) => {
  try {
    const { name, description, imageUrl, active = true, sortOrder = 0 } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = slugify(name);
    const cat = await Category.create({ name, slug, description, imageUrl, active, sortOrder });
    res.status(201).json(cat);
  } catch (err: any) {
    if (err.code === 11000) { res.status(409).json({ error: "Category with this name already exists" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update
router.put("/admin/categories/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, imageUrl, active, sortOrder } = req.body;
    const updates: any = {};
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name); }
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const cat = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!cat) { res.status(404).json({ error: "Not found" }); return; }
    res.json(cat);
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
