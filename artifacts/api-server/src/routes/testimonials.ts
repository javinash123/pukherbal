import { Router } from "express";
import { Testimonial } from "../models/Testimonial";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// Public: list active testimonials
router.get("/testimonials", async (_req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(testimonials.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all
router.get("/admin/testimonials", authMiddleware, async (_req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(testimonials.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: create
router.post("/admin/testimonials", authMiddleware, async (req, res) => {
  try {
    const { name, designation, company, message, rating = 5, imageUrl, active = true, sortOrder = 0 } = req.body;
    if (!name || !message) { res.status(400).json({ error: "Name and message are required" }); return; }
    const testimonial = await Testimonial.create({ name, designation, company, message, rating, imageUrl, active, sortOrder });
    res.status(201).json(serialize(testimonial));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update
router.put("/admin/testimonials/:id", authMiddleware, async (req, res) => {
  try {
    const { name, designation, company, message, rating, imageUrl, active, sortOrder } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (designation !== undefined) updates.designation = designation;
    if (company !== undefined) updates.company = company;
    if (message !== undefined) updates.message = message;
    if (rating !== undefined) updates.rating = rating;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!testimonial) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(testimonial));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/testimonials/:id", authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
