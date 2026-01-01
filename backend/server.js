const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE (MUST BE FIRST) ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

/* ================= CRON JOBS ================= */
const performanceCheck = require("./utils/performanceCheck");
const classAverage = require("./utils/classAverage");

setInterval(classAverage, 7 * 24 * 60 * 60 * 1000); // weekly
setInterval(performanceCheck, 24 * 60 * 60 * 1000); // daily

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));


app.use("/videos", express.static("videos"));

/* ================= DB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("EduQuest Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
