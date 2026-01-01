const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  xpReward: { type: Number, default: 10 },
});

const quizSchema = new mongoose.Schema(
  {
    quizId: { type: String, required: true, unique: true },
    subjectId: { type: String },
    chapterName: { type: String },
    timePerQuestion: { type: Number, default: 30 },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
