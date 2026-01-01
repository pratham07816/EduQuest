const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors()); // allow all origins (safe for now)
app.use(express.json({ limit: "5mb" }));

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("EduQuest Backend Running");
});

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ❌ NO app.listen() */
/* ✅ EXPORT app for Vercel */
module.exports = app;


