import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ✅ Initialize tables if not exist
(async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT, -- 'deposit' | 'withdrawal'
        amount REAL,
        status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ DB init error:", err);
  }
})();

export default db;
