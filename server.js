import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors"; // ✅ import CORS

import connectDB from "./config/db.js";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import AddWeapons from "./routes/AddWeapons.js";
import AddVehicles from "./routes/AddVehicles.js";
import AddBase from "./routes/AddBase.js";
import AddAgency from "./routes/AddAgency.js";
import requestRoutes from "./routes/requestRoutes.js";
import requestHistory from "./routes/requestHistory.js";
import allRequestHistory from "./routes/allRequestHistory.js";
import initBase from "./routes/initBase.js";
import editBaseDet from "./routes/editBaseDet.js";
import profile from "./routes/profile.js";

// Load env
dotenv.config();

// DB connect
connectDB();

// Express app
const app = express();

// Security + Middleware
app.use(helmet());
app.use(express.json());
app.use(cors()); // ✅ allow requests from any origin (adjust in production)

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/weapons", AddWeapons);
app.use("/api/vehicles", AddVehicles);
app.use("/api/base", AddBase);
app.use("/api/base", initBase);
app.use("/api/base", editBaseDet);
app.use("/api/agency", AddAgency);
app.use("/api/requests", requestRoutes);
app.use("/api/requests", requestHistory);
app.use("/api/requests", allRequestHistory);
app.use("/api/auth", profile);

// Root test
app.get("/", (req, res) => res.send("🚀 Defence Backend API running..."));

// PORT fix
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});
