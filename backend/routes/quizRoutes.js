const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

/* ======================================================
   GET QUIZ BY QUIZ ID (Teacher / Student)
   GET /api/quizzes/:quizId
====================================================== */
router.get("/:quizId", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADD QUESTION TO QUIZ (Teacher)
   POST /api/quizzes/:quizId/questions
====================================================== */
router.post("/:quizId/questions", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, options, correctAnswer, xpReward } = req.body;

    // ✅ VALIDATION
    if (
      !text ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      options.some((o) => !o || o.trim() === "") ||
      correctAnswer < 0 ||
      correctAnswer > 3
    ) {
      return res.status(400).json({
        message: "Invalid question data",
      });
    }

    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions.push({
      text: text.trim(),
      options: options.map((o) => o.trim()),
      correctAnswer,
      xpReward: xpReward || 50,
    });

    quiz.markModified("questions");
    await quiz.save();

    res.json({
      message: "Question added successfully",
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("Add question error:", error);
    res.status(500).json({ message: "Failed to add question" });
  }
});


/* ======================================================
   DELETE QUESTION FROM QUIZ (Teacher)
   DELETE /api/quizzes/:quizId/questions/:index
====================================================== */
router.delete("/:quizId/questions/:index", async (req, res) => {
  try {
    const { quizId, index } = req.params;

    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionIndex = Number(index);

    if (
      Number.isNaN(questionIndex) ||
      questionIndex < 0 ||
      questionIndex >= quiz.questions.length
    ) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    // Remove question by index
    quiz.questions.splice(questionIndex, 1);

    // IMPORTANT: Tell mongoose embedded array changed
    quiz.markModified("questions");
    await quiz.save();

    res.json({
      message: "Question deleted successfully",
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ message: "Failed to delete question" });
  }
});

/* ======================================================
   SUBMIT QUIZ & UPDATE USER PROGRESS (Student)
   POST /api/quizzes/submit
====================================================== */
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { quizId, score, xpGained } = req.body;

    /* ---------- FIND QUIZ ---------- */
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const subject = quiz.subject;
    const allowedSubjects = [
      "Mathematics",
      "Science",
      "English",
      "Environment",
    ];

    if (!allowedSubjects.includes(subject)) {
      return res.status(400).json({ message: "Invalid quiz subject" });
    }

    /* ---------- FIND USER ---------- */
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ---------- ENSURE SUBJECT STRUCTURE ---------- */
    if (!user.progress.subjects) {
      user.progress.subjects = {};
    }

    if (!user.progress.subjects[subject]) {
      user.progress.subjects[subject] = { xp: 0, score: 0 };
    }

    /* ---------- OVERALL PROGRESS ---------- */
    user.progress.xp += xpGained;
    user.progress.quizzesCompleted += 1;
    user.progress.totalScore += score;
    user.progress.level = Math.floor(user.progress.xp / 500) + 1;

    /* ---------- SUBJECT-WISE PROGRESS ---------- */
    user.progress.subjects[subject].xp += xpGained;
    user.progress.subjects[subject].score += score;

    /* ---------- XP HISTORY ---------- */
    user.xpHistory.push({ xp: xpGained });

    /* ---------- NOTIFICATION ---------- */
    await Notification.create({
      type: "quiz",
      title: `${req.user.name} completed "${quiz.chapter}"`,
      description: `Score: ${score}%`,
      bg: "bg-green-50",
      color: "text-green-600",
    });

    await user.save();

    res.json({
      message: "Quiz submitted successfully",
      progress: user.progress,
      subjectUpdated: subject,
      xpGained,
      score,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
});

module.exports = router;
