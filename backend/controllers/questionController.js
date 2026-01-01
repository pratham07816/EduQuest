const Question = require("../models/Question");

/* ================= GET QUESTIONS ================= */
exports.getQuestions = async (req, res) => {
  const { subjectId, chapterName } = req.query;

  const questions = await Question.find({
    subjectId,
    chapterName
  });

  res.json(questions);
};

/* ================= ADD QUESTION ================= */
exports.addQuestion = async (req, res) => {
  const question = await Question.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.json(question);
};

/* ================= DELETE QUESTION ================= */
exports.deleteQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Question deleted" });
};
