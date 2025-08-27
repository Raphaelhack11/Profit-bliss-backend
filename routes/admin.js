import express from "express";
import db from "../db.js";

const router = express.Router();

// Approve withdrawal
router.post("/approve/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: "UPDATE transactions SET status = 'completed' WHERE id = ?",
      args: [id],
    });
    res.json({ message: "✅ Withdrawal approved" });
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});

// Reject withdrawal
router.post("/reject/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: "UPDATE transactions SET status = 'rejected' WHERE id = ?",
      args: [id],
    });
    res.json({ message: "❌ Withdrawal rejected" });
  } catch (err) {
    res.status(500).json({ error: "Rejection failed" });
  }
});

export default router;
