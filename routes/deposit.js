import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const result = await db.execute({
      sql: "SELECT balance FROM users WHERE id = ?",
      args: [userId],
    });

    const balance = result.rows[0]?.balance || 0;
    if (balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    await db.execute({
      sql: "INSERT INTO transactions (userId, type, amount, status) VALUES (?, ?, ?, ?)",
      args: [userId, "withdraw", amount, "pending"],
    });

    res.json({ message: "✅ Withdrawal request submitted" });
  } catch (err) {
    res.status(500).json({ error: "Withdrawal failed" });
  }
});

export default router;
