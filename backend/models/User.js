const mongoose = require("mongoose");

/* ================= BADGE SCHEMA ================= */
const BadgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date },
});

/* ================= SUBJECT PROGRESS SCHEMA ================= */
const SubjectProgressSchema = new mongoose.Schema(
  {
    xp: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

/* ================= PROGRESS SCHEMA ================= */
const ProgressSchema = new mongoose.Schema({
  // 🔹 Overall progress
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  quizzesCompleted: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },

  // 🔹 Subject-wise progress (REQUIRED for analytics)
  subjects: {
    Mathematics: { type: SubjectProgressSchema, default: () => ({}) },
    Science: { type: SubjectProgressSchema, default: () => ({}) },
    English: { type: SubjectProgressSchema, default: () => ({}) },
    Environment: { type: SubjectProgressSchema, default: () => ({}) },
  },
});

/* ================= USER SCHEMA ================= */
const UserSchema = new mongoose.Schema(
  {
    /* ===== AUTH INFO ===== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },

    /* ===== PROFILE SETTINGS ===== */
    avatar: {
      type: String,
    },

    class: {
      type: String,
    },

    language: {
      type: String,
      default: "en",
    },

    offlineMode: {
      type: Boolean,
      default: false,
    },

    /* ===== TEACHER SETTINGS ===== */
    school: {
      type: String,
      default: "",
    },

    specialization: {
      type: String,
      default: "",
    },

    /* ===== TEACHER SETTINGS ===== */
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      autoSync: {
        type: Boolean,
        default: true,
      },
    },



    favoriteSubjects: {
      type: [String],
      default: [],
    },

    /* ===== GAMIFICATION DATA ===== */
    progress: {
      type: ProgressSchema,
      default: () => ({}),
    },

    badges: {
      type: [BadgeSchema],
      default: [],
    },

    xpHistory: [
      {
        xp: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
