import express from "express";
import Request from "../models/Request.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/requests/submit
 * @desc    Submit a new resource request
 * @access  Protected (JWT required)
 */
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { to, from, reason, timestamp, weapons, vehicles } = req.body;

    // ✅ Validate required fields
    if (!to?.base || !to?.agency) {
      return res.status(400).json({ error: "Destination base & agency are required" });
    }
    if (!from?.base || !from?.agency || !from?.location) {
      return res.status(400).json({ error: "Source base, agency & location are required" });
    }
    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ error: "Reason must be at least 5 characters" });
    }

    // ✅ Ensure at least one of weapons/vehicles has a value > 0
    const validWeapons = {};
    if (weapons && typeof weapons === "object") {
      for (const [k, v] of Object.entries(weapons)) {
        if (Number.isInteger(v) && v > 0) validWeapons[k] = v;
      }
    }

    const validVehicles = {};
    if (vehicles && typeof vehicles === "object") {
      for (const [k, v] of Object.entries(vehicles)) {
        if (Number.isInteger(v) && v > 0) validVehicles[k] = v;
      }
    }

    if (Object.keys(validWeapons).length === 0 && Object.keys(validVehicles).length === 0) {
      return res.status(400).json({ error: "At least one weapon or vehicle is required" });
    }

    // ✅ Create new request document
    const newRequest = new Request({
      baseNameTo: to.base.trim(),
      agencyNameTo: to.agency.trim(),
      baseNameFrom: from.base.trim(),
      agencyNameFrom: from.agency.trim(),
      locationFrom: from.location.trim(),
      reason: reason.trim(),
      requiredWeapons: validWeapons,
      requiredVehicles: validVehicles,
      createdAt: timestamp ? new Date(timestamp) : Date.now(),
    });

    // Save to DB
    const saved = await newRequest.save();

    res.status(201).json({
      message: "✅ Request submitted successfully",
      request: saved,
    });
  } catch (err) {
    console.error("❌ Request submit error:", err.message);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

export default router;