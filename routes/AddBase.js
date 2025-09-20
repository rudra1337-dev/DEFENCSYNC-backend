// routes/baseRoutes.js
import express from "express";
import Base from "../models/Base.js";

const router = express.Router();

/**
 * @desc    Add one or multiple bases
 * @route   POST /api/bases/add
 * @access  Public
 */
router.post("/add", async (req, res) => {
  try {
    const data = req.body;

    // Check if data is empty
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(400).json({ message: "No base data provided" });
    }

    let basesToInsert = [];

    if (Array.isArray(data)) {
      // Multiple bases
      basesToInsert = data.map((base) => ({
        name: base.name,
        agency: base.agency,
        location: base.location,
        photo: base.photo,
        availSoldiers: base.availSoldiers || 0,
        availMedkits: base.availMedkits || 0,
        weapons: base.weapons || [],
        vehicles: base.vehicles || [],
      }));
    } else {
      // Single base
      basesToInsert.push({
        name: data.name,
        agency: data.agency,
        location: data.location,
        photo: data.photo,
        availSoldiers: data.availSoldiers || 0,
        availMedkits: data.availMedkits || 0,
        weapons: data.weapons || [],
        vehicles: data.vehicles || [],
      });
    }

    // Insert into DB
    const createdBases = await Base.insertMany(basesToInsert, { ordered: true });

    // Populate weapons & vehicles
    const populatedBases = await Base.find({
      _id: { $in: createdBases.map((b) => b._id) },
    })
      .populate("weapons")
      .populate("vehicles");

    res.status(201).json({
      message: "Base(s) added successfully",
      count: populatedBases.length,
      bases: populatedBases,
    });
  } catch (error) {
    console.error(error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }

    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;