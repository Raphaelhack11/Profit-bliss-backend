import express from "express";
import { db } from "../db.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { amount } = req.body;
  await db.execute("INSERT INTO transactions (userId, type, amount) VALUES (?, ?, ?)", [req.user.id, "withdraw", amount]);
  res.json({ message: "Withdraw request submitted, awaiting admin approval" });
});

export default router;
