// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import listRoutes from "./routes/listRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import familyRoutes from "./routes/familyRoutes.js";

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // --- Routes ---
// app.use("/api/auth", authRoutes);
// app.use("/api/lists", listRoutes);
// app.use("/api/family", familyRoutes);

// // Health check route
// app.get("/api/test", (req, res) => {
//   res.status(200).json({ message: "Backend is healthy and running!" });
// });

// // --- Database Connection and Server Start ---
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//       console.log("✅ MongoDB connected successfully.");
//     });
//   })
//   .catch((err) => console.error("❌ MongoDB connection error:", err.message));







console.log("Starting server.js file..."); // New line for debugging

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import listRoutes from "./routes/listRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";

console.log("Imports are complete."); // New line for debugging

// Load environment variables
dotenv.config();
console.log("dotenv configured."); // New line for debugging

// --- START: Pre-flight check for MONGO_URI ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("!!! ERROR: MONGO_URI not found.                        !!!");
    console.error("!!! Please check your .env file in the 'backend' folder. !!!");
    console.error("!!! The server cannot start without the database URI.    !!!");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    process.exit(1); // Stop the server if the URI is missing
}
console.log("MONGO_URI found."); // New line for debugging
// --- END: Pre-flight check ---


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/family", familyRoutes);

// --- Database Connection and Server Start ---
console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(MONGO_URI) // Use the checked variable
  .then(() => {
    console.log("✅ MongoDB connected successfully."); // Success message
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("!!! ❌ MongoDB connection error:", err.message); // Error message
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    process.exit(1); // Exit the process with an error code
  });
