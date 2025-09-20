import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// 🚀 Add multiple vehicles
router.post("/add", async (req, res) => {
  try {
    const vehicles = req.body; // expecting an array of vehicles

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({ message: "Please provide an array of vehicles" });
    }

    // Insert all vehicles
    const savedVehicles = await Vehicle.insertMany(vehicles, { ordered: true });

    res.status(201).json({
      message: "Vehicles added successfully",
      vehicles: savedVehicles,
    });
  } catch (err) {
    console.error("❌ Error adding vehicles:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;