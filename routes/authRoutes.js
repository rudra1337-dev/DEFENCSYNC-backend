import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Agency from "../models/Agency.js";

const router = express.Router();

// 🔑 LOGIN route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // 1. Check if agency exists
    let agency = await Agency.findOne({ name });
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: agency._id, name: agency.name },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "15d" }
    );

    // ✅ Populate agency → bases → weapons & vehicles
    agency = await agency.populate({
      path: "bases",
      populate: [
        { path: "weapons", model: "Weapon" },
        { path: "vehicles", model: "Vehicle" }
      ]
    });

    // 4. Get all users (agencies) with populated bases, weapons & vehicles
    const allAgencies = await Agency.find()
      .select("-password") // exclude password
      .populate({
        path: "bases",
        populate: [
          { path: "weapons", model: "Weapon" },
          { path: "vehicles", model: "Vehicle" }
        ]
      });

    // 5. Send response
    res.json({
      message: "Login successful ✅",
      token,
      agency,       // logged-in agency with full data
      users: allAgencies // all agencies with full data
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;