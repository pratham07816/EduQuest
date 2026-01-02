import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ================= AUTH TOKEN INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // Do NOT manually set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= TOKEN HELPER ================= */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/* ================= AUTH ================= */
export const login = (data: { email: string; password: string }) =>
  api.post("/api/auth/login", data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => api.post("/api/auth/register", data);

export const getProfile = () =>
  api.get("/api/auth/profile");

export const updateProfile = (data: {
  name?: string;
  email?: string;
  class?: string;
  language?: string;
  offlineMode?: boolean;
  avatar?: string;
}) => api.put("/api/auth/profile", data);

/* ================= SUBJECTS ================= */
export const getSubjects = () =>
  api.get("/api/subjects");

/* ================= QUIZZES ================= */
export const getQuizById = (quizId: string) =>
  api.get(`/api/quizzes/${quizId}`);

export const submitQuiz = (quizId: string, data: any) =>
  api.post(`/api/quizzes/${quizId}/submit`, data);

/* ================= LEADERBOARD ================= */
export const getLeaderboard = () =>
  api.get("/api/leaderboard");

/* ================= PROGRESS ================= */
export const getProgress = () =>
  api.get("/api/progress");

/* ================= TEACHER / STUDENT MANAGEMENT ================= */
export const getStudents = async () => {
  const res = await api.get("/api/teacher/students");
  return res.data;
};

export const getStudentById = async (id: string) => {
  const res = await api.get(`/api/teacher/students/${id}`);
  return res.data;
};

export const resetStudentProgress = (studentId: string) =>
  api.put(`/api/teacher/students/${studentId}/reset`);

export const sendMessageToStudent = (studentId: string, message: string) =>
  api.post(`/api/teacher/students/${studentId}/message`, { message });

/* ================= ANALYTICS ================= */
export const getClassAnalytics = () =>
  api.get("/api/teacher/analytics");

/* ================= NOTIFICATIONS ================= */
export const getNotifications = () =>
  api.get("/api/notifications");

/* ================= ANNOUNCEMENTS ================= */
export const getAnnouncements = () =>
  api.get("/api/announcements");

export default api;
