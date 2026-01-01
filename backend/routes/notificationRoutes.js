const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

/* ================= GET NOTIFICATIONS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ forRole: "teacher" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch notifications" });
  }
});

/* ================= MARK AS READ ================= */
router.put("/read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { forRole: "teacher", isRead: false },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to mark as read" });
  }
});

/* ================= STATS ================= */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const unread = await Notification.countDocuments({
      forRole: "teacher",
      isRead: false,
    });

    // 🔧 FIX: Proper Date object
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const QuizAttempt = require("../models/QuizAttempt");

    const quizzesToday = await QuizAttempt.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const pendingReviews = await QuizAttempt.countDocuments({
      reviewed: false,
    });

    res.json({
      unread,
      quizzesToday,
      pendingReviews,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch stats" });
  }
});

module.exports = router;
