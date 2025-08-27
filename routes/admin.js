import express from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Approve transaction
router.post("/approve/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Unauthorized" });

  try {
    const { id } = req.params;
    const result = await db.execute({ sql: "SELECT * FROM transactions WHERE id = ?", args: [id] });
    const tx = result.rows[0];

    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    // Update user balance
    if (tx.type === "deposit") {
      await db.execute({
        sql: "UPDATE users SET balance = balance + ? WHERE id = ?",
        args: [tx.amount, tx.userId],
      });
    } else if (tx.type === "withdraw") {
      await db.execute({
        sql: "UPDATE users SET balance = balance - ? WHERE id = ?",
        args: [tx.amount, tx.userId],
      });
    }

    // Mark transaction approved
    await db.execute({ sql: "UPDATE transactions SET status = 'approved' WHERE id = ?", args: [id] });

    res.json({ message: "Transaction approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
});

// Get all pending transactions
router.get("/pending", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Unauthorized" });

  try {
    const result = await db.execute({
      sql: "SELECT * FROM transactions WHERE status = 'pending'",
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending transactions" });
  }
});

export default router;
