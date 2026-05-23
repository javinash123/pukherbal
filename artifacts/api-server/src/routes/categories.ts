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

// Public: get single category by slug with its products
router.get("/categories/:slug", async (req, res) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug, active: true });
    if (!cat) { res.status(404).json({ error: "Category not found" }); return; }
    // Import Product inline to avoid circular deps
    const { Product } = await import("../models/Product");
    const products = await Product.find({ categoryId: cat._id, active: true }).sort({ sortOrder: 1, createdAt: 1 });
    const serializeProd = (doc: any) => {
      const obj = doc.toObject ? doc.toObject() : doc;
      return { ...obj, id: obj._id.toString(), categoryId: obj.categoryId?.toString() || null, _id: undefined };
    };
    res.json({ ...serialize(cat), products: products.map(serializeProd) });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

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
    const { name, description, imageUrl, active = true, sortOrder = 0, seoTitle, seoDescription, seoKeywords } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = slugify(name) + "-" + Date.now();
    const cat = await Category.create({ name, slug, description, imageUrl, active, sortOrder, seoTitle, seoDescription, seoKeywords });
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
    if (req.body.seoTitle !== undefined) updates.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription !== undefined) updates.seoDescription = req.body.seoDescription;
    if (req.body.seoKeywords !== undefined) updates.seoKeywords = req.body.seoKeywords;
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
