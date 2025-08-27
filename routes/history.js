import express from "express";
import { db } from "../db.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const result = await db.execute("SELECT * FROM transactions WHERE userId=? ORDER BY createdAt DESC", [req.user.id]);
  res.json(result.rows);
});

export default router;
