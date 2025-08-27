import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await db.execute({
      sql: "INSERT INTO transactions (userId, type, amount) VALUES (?, 'deposit', ?)",
      args: [userId, amount]
    });
    res.json({ message: "Deposit request submitted, waiting for admin approval." });
  } catch (err) {
    res.status(500).json({ error: "Deposit failed" });
  }
});

export default router;
