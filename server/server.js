import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import listRoutes from "./routes/listRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/family", familyRoutes);

// Health check route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Backend is healthy and running!" });
});

// --- Database Connection and Server Start ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log("✅ MongoDB connected successfully.");
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));