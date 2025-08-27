import express from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Deposit Request (pending until admin approves)
router.post("/deposit", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  try {
    await db.execute({
      sql: "INSERT INTO transactions (userId, type, amount, status) VALUES (?, ?, ?, 'pending')",
      args: [req.user.id, "deposit", amount],
    });
    res.json({ message: "Deposit request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deposit failed" });
  }
});

// Withdraw Request (pending until admin approves)
router.post("/withdraw", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  try {
    await db.execute({
      sql: "INSERT INTO transactions (userId, type, amount, status) VALUES (?, ?, ?, 'pending')",
      args: [req.user.id, "withdraw", amount],
    });
    res.json({ message: "Withdrawal request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Withdrawal failed" });
  }
});

// Get user transactions
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC",
      args: [req.user.id],
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

export default router;
