import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Public: list active categories
router.get("/categories", async (_req, res) => {
  try {
    const cats = await db.select().from(categoriesTable).where(eq(categoriesTable.active, true)).orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.createdAt));
    res.json(cats);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all (including inactive)
router.get("/admin/categories", authMiddleware, async (_req, res) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.createdAt));
    res.json(cats);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/categories", authMiddleware, async (req, res) => {
  try {
    const { name, description, imageUrl, active = true, sortOrder = 0 } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const slug = slugify(name);
    const [cat] = await db.insert(categoriesTable).values({ name, slug, description, imageUrl, active, sortOrder }).returning();
    res.status(201).json(cat);
  } catch (err: any) {
    if (err.code === "23505") { res.status(409).json({ error: "Category with this name already exists" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update
router.put("/admin/categories/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, imageUrl, active, sortOrder } = req.body;
    const updates: any = { updatedAt: new Date() };
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name); }
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const [cat] = await db.update(categoriesTable).set(updates).where(eq(categoriesTable.id, id)).returning();
    if (!cat) { res.status(404).json({ error: "Not found" }); return; }
    res.json(cat);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/categories/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
