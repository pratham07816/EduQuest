import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/* ================= TEACHER DASHBOARD ================= */
export const getTeacherDashboard = () =>
  API.get("/teacher/dashboard");

/* ================= CLASS ANALYTICS ================= */
export const getClassAnalytics = () =>
  API.get("/teacher/analytics");

/* ================= STUDENT FULL REPORT ================= */
export const getStudentFullReport = (studentId: string) =>
  API.get(`/teacher/students/${studentId}/report`);
