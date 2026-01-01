const User = require("../models/User");
const Notification = require("../models/Notification");

async function performanceCheck() {
  const students = await User.find({ role: "student" });

  if (!students.length) return;

  let lowest = students[0];
  for (const s of students) {
    if ((s.progress?.totalScore || 0) < (lowest.progress?.totalScore || 0)) {
      lowest = s;
    }
  }

  if ((lowest.progress?.totalScore || 0) < 75) {
    await Notification.create({
      type: "alert",
      title: `${lowest.name} needs attention`,
      description: "Performance dropped below 75%",
      bg: "bg-red-50",
      color: "text-red-600",
    });
  }
}

module.exports = performanceCheck;
