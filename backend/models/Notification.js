const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["quiz", "badge", "alert", "progress", "announcement"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    bg: {
      type: String,
      required: true, // bg-green-50, bg-red-50...
    },

    color: {
      type: String,
      required: true, // text-green-600...
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    forRole: {
      type: String,
      enum: ["teacher", "student"],
      default: "teacher",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
