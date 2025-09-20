import express from "express";
import Request from "../models/Request.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Get request history of logged-in agency
 * @route   GET /api/requests/history
 * @access  Protected (JWT required)
 */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const agencyName = req.user?.name; // comes from JWT (id, name)

    if (!agencyName) {
      return res.status(400).json({ message: "Agency name missing in token" });
    }

    // ✅ Find all requests made by this agency
    const requests = await Request.find({ agencyNameFrom: agencyName })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: `No requests found for ${agencyName}` });
    }

    res.status(200).json({
      message: `Request history for ${agencyName}`,
      total: requests.length,
      requests,
    });
  } catch (err) {
    console.error("❌ Error fetching request history:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;