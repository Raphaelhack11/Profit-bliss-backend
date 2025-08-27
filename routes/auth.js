import express from "express";
import db from "../db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await hashPassword(password);
    await db.execute({
      sql: "INSERT INTO users (email, password) VALUES (?, ?)",
      args: [email, hashed]
    });

    await sendEmail(email, "Welcome to Profit Bliss", "Your account has been created!");
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email]
  });
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await comparePassword(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token, user });
});

export default router;
