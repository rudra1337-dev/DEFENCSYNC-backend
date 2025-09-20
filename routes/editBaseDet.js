import express from "express";
import Base from "../models/Base.js";
import Weapon from "../models/Weapon.js";
import Vehicle from "../models/Vehicle.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PATCH /api/base/update
 * Body must include { name: "baseName", ...fieldsToUpdate }
 */
router.patch("/update", authMiddleware, async (req, res) => {
  try {
    const { name, weapons, vehicles, ...updates } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Base name is required to update" });
    }

    // Find the base by name
    let base = await Base.findOne({ name });
    if (!base) {
      return res.status(404).json({ message: "Base not found" });
    }

    // ✅ Update only fields that are provided (ignore undefined/empty)
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== "") {
        base[key] = updates[key];
      }
    });

    // ✅ Handle new weapons
    if (Array.isArray(weapons) && weapons.length > 0) {
      for (let w of weapons) {
        if (w.name && w.photo) {
          const newWeapon = new Weapon({
            name: w.name,
            available: w.available || 0,
            photo: w.photo,
          });
          const savedWeapon = await newWeapon.save();
          base.weapons.push(savedWeapon._id);
        }
      }
    }

    // ✅ Handle new vehicles
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      for (let v of vehicles) {
        if (v.name && v.photo) {
          const newVehicle = new Vehicle({
            name: v.name,
            available: v.available || 0,
            photo: v.photo,
          });
          const savedVehicle = await newVehicle.save();
          base.vehicles.push(savedVehicle._id);
        }
      }
    }

    // Save updated base
    await base.save();

    // ✅ Populate weapons and vehicles for full data response
    base = await Base.findById(base._id)
      .populate("weapons")
      .populate("vehicles");

    res.json({
      message: "✅ Base updated successfully",
      base,
    });
  } catch (err) {
    console.error("Error updating base:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;