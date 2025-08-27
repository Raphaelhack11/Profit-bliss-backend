import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await db.execute({
      sql: "INSERT INTO transactions (userId, type, amount, status) VALUES (?, 'withdraw', ?, 'pending')",
      args: [userId, amount]
    });
    res.json({ message: "Withdrawal request submitted, waiting for admin approval." });
  } catch (err) {
    res.status(500).json({ error: "Withdraw failed" });
  }
});

export default router;
