import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.execute({
      sql: "SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC",
      args: [userId]
    });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
