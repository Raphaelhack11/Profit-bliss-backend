import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed]);

    // Send verification email
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    await sendEmail(email, "Verify your Profit Bliss account", `<a href="${verifyLink}">Click to verify</a>`);

    res.json({ message: "User created, check your email to verify" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Verify Email
router.get("/verify/:token", async (req, res) => {
  try {
    const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await db.execute("UPDATE users SET isVerified=1 WHERE email=?", [email]);
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await db.execute("SELECT * FROM users WHERE email=?", [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, balance: user.balance } });
});

export default router;
