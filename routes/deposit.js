import express from "express";
import { db } from "../db.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

// User creates a deposit request
router.post("/", protect, async (req, res) => {
  const { amount } = req.body;
  await db.execute("INSERT INTO transactions (userId, type, amount) VALUES (?, ?, ?)", [req.user.id, "deposit", amount]);
  res.json({ message: "Deposit request submitted, awaiting admin approval" });
});

export default router;
