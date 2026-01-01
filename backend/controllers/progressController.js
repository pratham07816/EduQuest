const User = require("../models/User");
const Notification = require("../models/Notification");

/* =====================================================
   GET LOGGED-IN USER PROGRESS
===================================================== */
exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("progress badges");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      progress: user.progress,
      badges: user.badges,
    });
  } catch (error) {
    console.error("Get Progress Error:", error);
    res.status(500).json({ msg: "Failed to fetch progress" });
  }
};

/* =====================================================
   UPDATE USER PROGRESS AFTER QUIZ
===================================================== */
exports.updateProgress = async (req, res) => {
  try {
    const {
      xpGained = 0,
      score = 0,
      unlockedBadges = [],
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    /* 🔥 XP & LEVEL */
    user.progress.xp += xpGained;
    user.xpHistory.push({ xp: xpGained });
    user.progress.level = Math.floor(user.progress.xp / 500) + 1;

    /* 📊 STATS */
    user.progress.quizzesCompleted += 1;
    user.progress.totalScore += score;

    /* 🏅 BADGES + NOTIFICATIONS */
    for (const badgeId of unlockedBadges) {
      if (!user.badges.find((b) => b.id === badgeId)) {
        user.badges.push({
          id: badgeId,
          unlocked: true,
          unlockedAt: new Date(),
        });

        // 🔔 Create notification (SAFE — no top-level await)
        await Notification.create({
          type: "badge",
          title: `${user.name} unlocked a badge`,
          description: `Earned "${badgeId}" badge`,
          bg: "bg-yellow-50",
          color: "text-yellow-600",
        });
      }
    }

    await user.save();

    res.json({
      progress: user.progress,
      badges: user.badges,
    });
  } catch (error) {
    console.error("Update Progress Error:", error);
    res.status(500).json({ msg: "Failed to update progress" });
  }
};
