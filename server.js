import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

import authRoutes from "./routes/auth.js";
import withdrawRoutes from "./routes/withdraw.js";
import depositRoutes from "./routes/deposit.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route for browser testing
app.get("/", (req, res) => {
  res.json({ message: "🚀 Profit Bliss API is running!" });
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/withdraw", withdrawRoutes);
app.use("/deposit", depositRoutes);
app.use("/history", historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
