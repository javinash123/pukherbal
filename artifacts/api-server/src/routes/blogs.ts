import { Router } from "express";
import { Blog } from "../models/Blog";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// Public: list published blogs
router.get("/blogs", async (_req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Public: get by slug
router.get("/blogs/:slug", async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(post));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all
router.get("/admin/blogs", authMiddleware, async (_req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, category, readTime, author, published = false, featured = false, seoTitle, seoDescription, seoKeywords } = req.body;
    if (!title) { res.status(400).json({ error: "Title is required" }); return; }
    const slug = slugify(title) + "-" + Date.now();
    const post = await Blog.create({ title, slug, excerpt, content, imageUrl, category, readTime, author: author || "Pukhraj Herbals", published, featured, seoTitle, seoDescription, seoKeywords });
    res.status(201).json(serialize(post));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const updates: any = {};
    const fields = ["title", "excerpt", "content", "imageUrl", "category", "readTime", "author", "published", "featured", "seoTitle", "seoDescription", "seoKeywords"];
    for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    const post = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(post));
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
