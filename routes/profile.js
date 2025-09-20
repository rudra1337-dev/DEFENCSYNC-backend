import express from "express";
import Agency from "../models/Agency.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // ✅ your JWT middleware

const router = express.Router();

// 👤 PROFILE route
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // `authMiddleware` adds decoded token → req.user
    const { name } = req.user;

    // Find agency by name from token
    const agency = await Agency.findOne({ name })
      .select("-password") // exclude password
      .populate({
        path: "bases",
        populate: [
          { path: "weapons", model: "Weapon" },
          { path: "vehicles", model: "Vehicle" }
        ]
      });

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.json({
      message: "Profile fetched successfully ✅",
      profile: agency
    });
  } catch (err) {
    console.error("❌ Profile fetch error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;