const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);

/* ================= PROFILE UPDATE ================= */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      class: studentClass,
      language,
      offlineMode,
      avatar,
    } = req.body;

    const updateData = {
      name,
      email,
      class: studentClass,
      language,
      offlineMode,
    };

    if (avatar) {
      updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Profile update failed" });
  }
});

module.exports = router;
