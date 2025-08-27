import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all pending transactions
router.get("/transactions", async (req, res) => {
  const result = await db.execute({
    sql: "SELECT * FROM transactions WHERE status = 'pending'",
    args: []
  });
  res.json(result.rows);
});

// Approve transaction
router.post("/approve", async (req, res) => {
  const { transactionId, approve } = req.body;
  const result = await db.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId]
  });
  const tx = result.rows[0];
  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  if (approve) {
    if (tx.type === "deposit") {
      await db.execute({
        sql: "UPDATE users SET balance = balance + ? WHERE id = ?",
        args: [tx.amount, tx.userId]
      });
    } else if (tx.type === "withdraw") {
      await db.execute({
        sql: "UPDATE users SET balance = balance - ? WHERE id = ?",
        args: [tx.amount, tx.userId]
      });
    }
    await db.execute({ sql: "UPDATE transactions SET status='approved' WHERE id=?", args: [transactionId] });
  } else {
    await db.execute({ sql: "UPDATE transactions SET status='rejected' WHERE id=?", args: [transactionId] });
  }

  res.json({ message: "Transaction updated" });
});

export default router;
