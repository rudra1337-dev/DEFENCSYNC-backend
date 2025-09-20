import express from "express";
import Weapon from "../models/Weapon.js";

const router = express.Router();

// 🚀 Add multiple weapons
router.post("/add", async (req, res) => {
  try {
    const weapons = req.body; // expecting an array of weapons

    if (!Array.isArray(weapons) || weapons.length === 0) {
      return res.status(400).json({ message: "Please provide an array of weapons" });
    }

    // Insert all weapons
    const savedWeapons = await Weapon.insertMany(weapons, { ordered: true });

    res.status(201).json({
      message: "Weapons added successfully",
      weapons: savedWeapons,
    });
  } catch (err) {
    console.error("❌ Error adding weapons:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;