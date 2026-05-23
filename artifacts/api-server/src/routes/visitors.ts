import { Router, type Request } from "express";
import { Visitor } from "../models/Visitor";
import { authMiddleware } from "../middleware/auth";

const router = Router();

function getIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|tablet/i.test(ua)) return "Mobile";
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  return "Desktop";
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "Other";
}

// Public: record a visit
router.post("/visitors/track", async (req, res) => {
  try {
    const { page, referrer, sessionId } = req.body;
    if (!page) { res.status(400).json({ error: "page is required" }); return; }
    const ip = getIp(req);
    const userAgent = req.headers["user-agent"] || "";
    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);

    // Attempt geo lookup from ip-api.com (free, no key needed, up to 1000/min)
    let country = "", city = "", region = "";
    if (ip && ip !== "::1" && ip !== "127.0.0.1" && !ip.startsWith("::ffff:127")) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName,status`, { signal: AbortSignal.timeout(2000) });
        const geo = await geoRes.json() as any;
        if (geo.status === "success") { country = geo.country || ""; city = geo.city || ""; region = geo.regionName || ""; }
      } catch { /* geo lookup failed, skip */ }
    }

    await Visitor.create({ ip, page, referrer: referrer || "", userAgent, country, city, region, device, browser, sessionId: sessionId || "" });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: list visitors with filtering
router.get("/admin/visitors", authMiddleware, async (req, res) => {
  try {
    const { page: pageFilter, country, device, browser, search, startDate, endDate, page: _p, limit: _l } = req.query as Record<string, string>;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (pageFilter) filter.page = { $regex: pageFilter, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };
    if (device) filter.device = device;
    if (browser) filter.browser = browser;
    if (search) filter.$or = [
      { page: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { ip: { $regex: search, $options: "i" } },
    ];
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
    }

    const [visitors, total] = await Promise.all([
      Visitor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Visitor.countDocuments(filter),
    ]);

    // Aggregate stats
    const [topPages, topCountries, deviceStats] = await Promise.all([
      Visitor.aggregate([{ $group: { _id: "$page", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Visitor.aggregate([{ $match: { country: { $ne: "" } } }, { $group: { _id: "$country", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Visitor.aggregate([{ $group: { _id: "$device", count: { $sum: 1 } } }]),
    ]);

    res.json({
      visitors: visitors.map(v => ({ ...v.toObject(), id: v._id.toString(), _id: undefined })),
      total,
      page,
      pages: Math.ceil(total / limit),
      stats: { topPages, topCountries, deviceStats },
    });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// Admin: delete old visitors
router.delete("/admin/visitors", authMiddleware, async (req, res) => {
  try {
    const { days } = req.query;
    const daysNum = parseInt(days as string) || 30;
    const cutoff = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);
    const result = await Visitor.deleteMany({ createdAt: { $lt: cutoff } });
    res.json({ success: true, deleted: result.deletedCount });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
