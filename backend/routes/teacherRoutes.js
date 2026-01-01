const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getClassAnalytics,
  getStudents,
  getStudentFullReport,
  getTeacherSettings,
  updateTeacherSettings,
} = require("../controllers/teacherController");

router.get("/dashboard", getDashboardStats);
router.get("/analytics", getClassAnalytics);
router.get("/students", getStudents);
router.get("/students/:id/report", getStudentFullReport);

const authMiddleware = require("../middleware/authMiddleware");

router.get("/settings", authMiddleware, getTeacherSettings);
router.put("/settings", authMiddleware, updateTeacherSettings);



module.exports = router;
