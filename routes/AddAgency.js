import express from "express";
import bcrypt from "bcryptjs";
import Agency from "../models/Agency.js";

const router = express.Router();

// @route   POST /api/agency/add
// @desc    Add a new agency
// @access  Public (no auth for now)
router.post("/add", async (req, res) => {
  try {
    const { name, slogan, backgroundImg, flagImg, password, bases } = req.body;

    // Validate required fields
    if (!name || !backgroundImg || !flagImg || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Check if agency already exists
    const existing = await Agency.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Agency with this name already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new agency
    const newAgency = new Agency({
      name,
      slogan,
      backgroundImg,
      flagImg,
      password: hashedPassword,
      bases: bases || [], // array of base IDs
    });

    // Save to DB
    let savedAgency = await newAgency.save();

    // ✅ Populate bases + weapons + vehicles
    savedAgency = await savedAgency.populate({
      path: "bases",
      populate: [
        { path: "weapons", model: "Weapon" },
        { path: "vehicles", model: "Vehicle" }
      ]
    });

    res.status(201).json({
      message: "Agency added successfully ✅",
      agency: savedAgency,
    });
  } catch (err) {
    console.error("❌ Error in /api/agency/add:", err);

    // If it's a Mongoose validation or cast error, give details
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation Error", details: err.errors });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format", details: err.message });
    }

    // Otherwise, generic server error
    res.status(500).json({ error: "Server Error", message: err.message });
  }
});

export default router;