import express from "express";
import cors from "cors";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import withdrawRoutes from "./routes/withdraw.js";
import historyRoutes from "./routes/history.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/withdraw", withdrawRoutes);
app.use("/history", historyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        balance REAL DEFAULT 0,
        isAdmin BOOLEAN DEFAULT 0
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        type TEXT,
        amount REAL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tables ensured");
  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
});
