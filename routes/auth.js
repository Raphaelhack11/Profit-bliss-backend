// routes/auth.js
import express from "express";
import db from "../db.js";   // ✅ notice no curly braces now

const router = express.Router();

// Example: user signup
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    stmt.run(email, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User already exists or DB error" });
  }
});

// Example: user login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    const user = stmt.get(email, password);

    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
