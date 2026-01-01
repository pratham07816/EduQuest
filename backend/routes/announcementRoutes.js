const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.post("/", async (req, res) => {
  const { subject, message } = req.body;

  await Notification.create({
    type: "announcement",
    title: subject,
    description: message,
    bg: "bg-purple-50",
    color: "text-purple-600",
    forRole: "student",
  });

  res.json({ success: true });
});

module.exports = router;
