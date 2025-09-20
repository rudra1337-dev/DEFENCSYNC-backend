import express from "express";
import Base from "../models/Base.js";
import Agency from "../models/Agency.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // JWT middleware

const router = express.Router();

/**
 * @desc    Initialize a new base and add it to the logged-in agency
 * @route   POST /api/base/init
 * @access  Private (JWT required)
 */
router.post("/init", authMiddleware, async (req, res) => {
  try {
    const { name, location, photo, availSoldiers, availMedkits } = req.body;

    // Validate required fields
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    // Use logged-in agency from JWT
    const agencyName = req.user.name;

    // Validate agency exists
    const foundAgency = await Agency.findOne({ name: agencyName });
    if (!foundAgency) {
      return res.status(404).json({ message: "Logged-in agency not found" });
    }

    // Create new base
    const newBase = await Base.create({
      name,
      location,
      photo,
      agency: agencyName,
      availSoldiers: availSoldiers || 0,
      availMedkits: availMedkits || 0,
    });

    // Push base ID to agency
    foundAgency.bases.push(newBase._id);
    await foundAgency.save();

    res.status(201).json({
      message: "Base created successfully and added to agency",
      base: newBase,
    });
  } catch (err) {
    console.error("❌ Error creating base:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;