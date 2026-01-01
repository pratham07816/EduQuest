const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getProgress,
  updateProgress,
} = require("../controllers/progressController");

/* ================= ROUTES ================= */

// Get logged-in user's progress
router.get("/", authMiddleware, getProgress);

// Update progress after quiz
router.post("/", authMiddleware, updateProgress);

module.exports = router;
