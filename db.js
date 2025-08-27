import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
  syncUrl: null // 🚫 disables migration sync (fix for 400 error)
});

export async function initDB() {
  // Ensure users & transactions tables exist
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
}

export default db;
