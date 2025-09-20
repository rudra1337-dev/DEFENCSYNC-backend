import express from "express";
import Request from "../models/Request.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Get all request history (all agencies)
 * @route   GET /api/requests/all-history
 * @access  Public (no auth)
 */
router.get("/all-history", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find()
      .sort({ createdAt: -1 }) // newest first
      .lean();

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No requests found in the system" });
    }

    res.status(200).json({
      message: "All requests history",
      total: requests.length,
      requests,
    });
  } catch (err) {
    console.error("❌ Error fetching all request history:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;