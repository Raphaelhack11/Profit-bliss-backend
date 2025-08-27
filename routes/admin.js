import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Approve transaction
router.post("/approve", async (req, res) => {
  const { id, status } = req.body;
  const txResult = await db.execute("SELECT * FROM transactions WHERE id=?", [id]);
  const tx = txResult.rows[0];

  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  if (status === "approved" && tx.type === "deposit") {
    await db.execute("UPDATE users SET balance = balance + ? WHERE id=?", [tx.amount, tx.userId]);
  }

  if (status === "approved" && tx.type === "withdraw") {
    await db.execute("UPDATE users SET balance = balance - ? WHERE id=?", [tx.amount, tx.userId]);
  }

  await db.execute("UPDATE transactions SET status=? WHERE id=?", [status, id]);

  res.json({ message: `Transaction ${status}` });
});

export default router;
