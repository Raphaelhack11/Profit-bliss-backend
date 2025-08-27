// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db.js"; // ✅ Correct import (same folder)

import authRoutes from "./routes/auth.js";
import withdrawRoutes from "./routes/withdraw.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize database
await initDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/history", historyRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Profit Bliss Backend is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
