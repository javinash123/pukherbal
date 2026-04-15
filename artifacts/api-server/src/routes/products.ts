import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, asc, and } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Public: list active products (optional ?categoryId=)
router.get("/products", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const conditions = [eq(productsTable.active, true)];
    if (categoryId) conditions.push(eq(productsTable.categoryId, Number(categoryId)));
    const prods = await db.select().from(productsTable).where(and(...conditions)).orderBy(asc(productsTable.sortOrder), asc(productsTable.createdAt));
    res.json(prods);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all products
router.get("/admin/products", authMiddleware, async (_req, res) => {
  try {
    const prods = await db.select().from(productsTable).orderBy(asc(productsTable.sortOrder), asc(productsTable.createdAt));
    res.json(prods);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/products", authMiddleware, async (req, res) => {
  try {
    const { name, categoryId, specification, casNumber, imageUrl, description, active = true, featured = false, sortOrder = 0 } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = slugify(name) + "-" + Date.now();
    const [prod] = await db.insert(productsTable).values({ name, slug, categoryId: categoryId || null, specification, casNumber, imageUrl, description, active, featured, sortOrder }).returning();
    res.status(201).json(prod);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, categoryId, specification, casNumber, imageUrl, description, active, featured, sortOrder } = req.body;
    const updates: any = { updatedAt: new Date() };
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name) + "-" + id; }
    if (categoryId !== undefined) updates.categoryId = categoryId || null;
    if (specification !== undefined) updates.specification = specification;
    if (casNumber !== undefined) updates.casNumber = casNumber;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;
    if (active !== undefined) updates.active = active;
    if (featured !== undefined) updates.featured = featured;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const [prod] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    if (!prod) { res.status(404).json({ error: "Not found" }); return; }
    res.json(prod);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/products/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
