import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import the AI routes
import aiRoutes from "./src/routes/aiRoutes.js";

import mpRoutes from "./src/routes/mpRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Load .env variables
dotenv.config();

const app = express();

// ---------------- Middleware ----------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 50,
  })
);

// ---------------- MongoDB Connection ----------------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected (Atlas)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Routes ----------------
app.use("/api", mpRoutes);
app.use("/api", userRoutes);

// ---------------- AI Routes ----------------
app.use("/api/ai", aiRoutes); // Add the AI route here

// ---------------- Test Route ----------------
app.get("/api/test", (req, res) => res.json({ message: "✅ API working fine" }));

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
