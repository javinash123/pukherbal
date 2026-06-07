import { Router } from "express";
import { Product } from "@workspace/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let suffix = 0;
  while (true) {
    const query: any = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Product.findOne(query);
    if (!existing) return slug;
    suffix++;
    slug = `${base}-${suffix}`;
  }
}

// Public: list active products (optional ?categoryId=)
router.get("/products", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter: any = { active: true };
    if (categoryId) filter.categoryId = String(categoryId);
    const prods = await Product.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.json(prods);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Public: get single product by slug
router.get("/products/:slug", async (req, res) => {
  try {
    const prod = await Product.findOne({ slug: req.params.slug, active: true });
    if (!prod) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(prod);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all products
router.get("/admin/products", authMiddleware, async (_req, res) => {
  try {
    const prods = await Product.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(prods);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/products", authMiddleware, async (req, res) => {
  try {
    const { name, categoryId, specification, casNumber, imageUrl, description, active = true, featured = false, sortOrder = 0 } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = await uniqueSlug(slugify(name));
    const prod = await Product.create({ name, slug, categoryId: categoryId || null, specification, casNumber, imageUrl, description, active, featured, sortOrder });
    res.status(201).json(prod);
  } catch (err: any) {
    if (err.code === 11000) { res.status(409).json({ error: "A product with this name already exists" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update (slug is NOT changed to preserve URLs)
router.put("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const { name, categoryId, specification, casNumber, imageUrl, description, active, featured, sortOrder } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (categoryId !== undefined) updates.categoryId = categoryId || null;
    if (specification !== undefined) updates.specification = specification;
    if (casNumber !== undefined) updates.casNumber = casNumber;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;
    if (active !== undefined) updates.active = active;
    if (featured !== undefined) updates.featured = featured;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const prod = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!prod) { res.status(404).json({ error: "Not found" }); return; }
    res.json(prod);
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
