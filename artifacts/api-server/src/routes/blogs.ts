import { Router } from "express";
import { db, blogsTable } from "@workspace/db";
import { eq, asc, and } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Public: list published blogs
router.get("/blogs", async (_req, res) => {
  try {
    const posts = await db.select().from(blogsTable).where(eq(blogsTable.published, true)).orderBy(asc(blogsTable.createdAt));
    res.json(posts.reverse());
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Public: get by slug
router.get("/blogs/:slug", async (req, res) => {
  try {
    const [post] = await db.select().from(blogsTable).where(and(eq(blogsTable.slug, req.params.slug), eq(blogsTable.published, true))).limit(1);
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(post);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all blogs
router.get("/admin/blogs", authMiddleware, async (_req, res) => {
  try {
    const posts = await db.select().from(blogsTable).orderBy(asc(blogsTable.createdAt));
    res.json(posts.reverse());
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, category, readTime, author, published = false, featured = false } = req.body;
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const slug = slugify(title) + "-" + Date.now();
    const [post] = await db.insert(blogsTable).values({ title, slug, excerpt, content, imageUrl, category, readTime, author: author || "Pukhraj Herbals", published, featured }).returning();
    res.status(201).json(post);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates: any = { updatedAt: new Date() };
    const fields = ["title", "excerpt", "content", "imageUrl", "category", "readTime", "author", "published", "featured"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    const [post] = await db.update(blogsTable).set(updates).where(eq(blogsTable.id, id)).returning();
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(post);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(blogsTable).where(eq(blogsTable.id, id));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
