import { Router } from "express";
import { Blog } from "@workspace/db";
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
    const existing = await Blog.findOne(query);
    if (!existing) return slug;
    suffix++;
    slug = `${base}-${suffix}`;
  }
}

// Public: list published blogs (newest first)
router.get("/blogs", async (_req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Public: get by slug
router.get("/blogs/:slug", async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(post);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all blogs (newest first)
router.get("/admin/blogs", authMiddleware, async (_req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, category, readTime, author, published = false, featured = false } = req.body;
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const slug = await uniqueSlug(slugify(title));
    const post = await Blog.create({ title, slug, excerpt, content, imageUrl, category, readTime, author: author || "Pukhraj Herbals", published, featured });
    res.status(201).json(post);
  } catch (err: any) {
    if (err.code === 11000) { res.status(409).json({ error: "A post with this title already exists" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update (slug is NOT changed to preserve URLs)
router.put("/admin/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const updates: any = {};
    const fields = ["title", "excerpt", "content", "imageUrl", "category", "readTime", "author", "published", "featured"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    const post = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(post);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/blogs/:id", authMiddleware, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
