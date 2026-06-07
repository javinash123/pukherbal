import { Router } from "express";
import { Enquiry } from "@workspace/db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public: submit enquiry
router.post("/enquiries", async (req, res) => {
  try {
    const { name, email, company, phone, productOfInterest, message } = req.body;
    if (!name || !email || !message) { res.status(400).json({ error: "Name, email and message are required" }); return; }
    const enquiry = await Enquiry.create({ name, email, company, phone, productOfInterest, message });
    res.status(201).json({ success: true, id: enquiry.id });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list all enquiries (newest first)
router.get("/admin/enquiries", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: update status
router.put("/admin/enquiries/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) { res.status(404).json({ error: "Not found" }); return; }
    res.json(enquiry);
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
