const mongoose = require("mongoose");

const LanguageBlockSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    mr: { type: String, required: true }
  },
  { _id: false }
);

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // ✅ Short description (shown under chapter title)
  description: {
    type: LanguageBlockSchema,
    required: true
  },

  // ✅ Detailed explanation (shown in Key Concepts)
  keyConcepts: {
    type: LanguageBlockSchema,
    required: true
  },

  videoUrl: { type: String, default: "" },
  pdfUrl: { type: String, default: "" }
});

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  chapters: [ChapterSchema]
});

module.exports = mongoose.model("Subject", SubjectSchema);

