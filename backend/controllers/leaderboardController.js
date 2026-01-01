const User = require("../models/User"); // adjust path if needed

exports.getLeaderboard = async (req, res) => {
  try {
    const { scope = "global", period = "weekly" } = req.query;

    // 🔐 TEMP: replace with req.user.id once auth middleware is added
    const CURRENT_USER_ID = req.user?.id;
    // -----------------------------
    // 1️⃣ DATE RANGE (Weekly / Monthly)
    // -----------------------------
    let startDate = new Date();
    if (period === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // -----------------------------
    // 2️⃣ MATCH FILTER (Global / Class)
    // -----------------------------
    // -----------------------------
// 2️⃣ MATCH FILTER (Global / Class)
// -----------------------------
    let matchStage = {
      role: "student",
      "progress.xp": { $gt: 0 },
    };

    if (scope === "class") {
      matchStage.classId = "CSE-A";
    }


    // -----------------------------
    // 3️⃣ AGGREGATION PIPELINE
    // -----------------------------
    const leaderboard = await User.aggregate([
      { $match: matchStage },

      {
        $project: {
          name: 1,
          classId: 1,

          // ✅ ALWAYS returns a number
          xp: { $ifNull: ["$progress.xp", 0] },

          level: { $ifNull: ["$progress.level", 1] },
          badges: { $size: { $ifNull: ["$badges", []] } },
        },
      },

      { $sort: { xp: -1 } },

      {
        $setWindowFields: {
          sortBy: { xp: -1 },
          output: {
            rank: { $rank: {} },
          },
        },
      },
    ]);

    // -----------------------------
    // 4️⃣ CURRENT USER DATA
    // -----------------------------
    const currentUser = CURRENT_USER_ID
      ? leaderboard.find((u) => u._id.toString() === CURRENT_USER_ID)
      : null;


    res.status(200).json({
      currentUser: {
        id: currentUser?._id,
        xp: currentUser?.xp || 0,
        rank: currentUser?.rank || 0,
      },
      leaderboard: leaderboard.map((u) => ({
        studentId: u._id,
        name: u.name,
        xp: u.xp ?? 0,
        level: u.level ?? 1,
        badges: u.badges ?? 0,
        rank: u.rank,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Leaderboard failed" });
  }
};
