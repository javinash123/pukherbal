import { Router } from "express";
import { Product } from "../models/Product";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), categoryId: obj.categoryId?.toString() || null, _id: undefined };
}

// Public: get single product by slug
router.get("/products/:slug", async (req, res) => {
  try {
    const prod = await Product.findOne({ slug: req.params.slug, active: true });
    if (!prod) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(serialize(prod));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Public: list active products (optional ?categoryId=)
router.get("/products", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter: any = { active: true };
    if (categoryId) filter.categoryId = categoryId;
    const prods = await Product.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.json(prods.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all products
router.get("/admin/products", authMiddleware, async (_req, res) => {
  try {
    const prods = await Product.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(prods.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/products", authMiddleware, async (req, res) => {
  try {
    const { name, categoryId, specification, casNumber, imageUrl, description, active = true, featured = false, sortOrder = 0, seoTitle, seoDescription, seoKeywords } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = slugify(name) + "-" + Date.now();
    const prod = await Product.create({ name, slug, categoryId: categoryId || null, specification, casNumber, imageUrl, description, active, featured, sortOrder, seoTitle, seoDescription, seoKeywords });
    res.status(201).json(serialize(prod));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const { name, categoryId, specification, casNumber, imageUrl, description, active, featured, sortOrder } = req.body;
    const updates: any = {};
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name) + "-" + Date.now(); }
    if (categoryId !== undefined) updates.categoryId = categoryId || null;
    if (specification !== undefined) updates.specification = specification;
    if (casNumber !== undefined) updates.casNumber = casNumber;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;
    if (active !== undefined) updates.active = active;
    if (featured !== undefined) updates.featured = featured;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (req.body.seoTitle !== undefined) updates.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription !== undefined) updates.seoDescription = req.body.seoDescription;
    if (req.body.seoKeywords !== undefined) updates.seoKeywords = req.body.seoKeywords;
    const prod = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!prod) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(prod));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
