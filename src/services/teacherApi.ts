import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ================= AUTH TOKEN INTERCEPTOR ================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= TEACHER DASHBOARD ================= */
export const getTeacherDashboard = () =>
  API.get("/api/teacher/dashboard");

/* ================= CLASS ANALYTICS ================= */
export const getClassAnalytics = () =>
  API.get("/api/teacher/analytics");

/* ================= STUDENT FULL REPORT ================= */
export const getStudentFullReport = (studentId: string) =>
  API.get(`/api/teacher/students/${studentId}/report`);

export default API;
