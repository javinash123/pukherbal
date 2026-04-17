import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { authMiddleware, signToken } from "../middleware/auth";

const router = Router();

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const user = await User.findOne({ email: email.toLowerCase(), active: true });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const payload = (req as any).user;
    const user = await User.findById(payload.id).select("_id name email role");
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
