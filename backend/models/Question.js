const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    // 🔑 Chapter is identified by name (since chapters are embedded)
    chapterName: {
      type: String,
      required: true
    },

    text: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: { type: String, required: true }
    },

    options: [
      {
        en: String,
        hi: String,
        mr: String
      }
    ],

    correctAnswer: {
      type: Number,
      required: true
    },

    xpReward: {
      type: Number,
      default: 10
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
