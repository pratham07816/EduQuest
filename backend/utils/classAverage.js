const User = require("../models/User");
const Notification = require("../models/Notification");

async function classAverage() {
  const students = await User.find({ role: "student" });
  if (!students.length) return;

  await Notification.create({
    type: "progress",
    title: "Class average improved",
    description: "Overall performance increased this week",
    bg: "bg-blue-50",
    color: "text-blue-600",
  });
}

module.exports = classAverage;
