import { Router } from "express";
import { Enquiry } from "../models/Enquiry";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// Public: submit enquiry
router.post("/enquiries", async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email and message are required" });
      return;
    }
    const enquiry = await Enquiry.create({ name, email, phone, company, subject, message });
    res.status(201).json({ success: true, id: enquiry._id.toString() });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all enquiries
router.get("/admin/enquiries", authMiddleware, async (_req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries.map(serialize));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: mark as read
router.put("/admin/enquiries/:id/read", authMiddleware, async (req, res) => {
  try {
    const enq = await Enquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!enq) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serialize(enq));
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete
router.delete("/admin/enquiries/:id", authMiddleware, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
