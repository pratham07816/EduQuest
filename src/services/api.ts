import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

    /**
     * IMPORTANT:
     * Do NOT manually set Content-Type for FormData
     */
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
  api.post("/auth/login", data);

export const register = (data: any) =>
  api.post("/auth/register", data);

export const getProfile = () =>
  api.get("/auth/profile");

export const updateProfile = (data: any) =>
  api.put("/auth/profile", data);

/* ================= SUBJECTS ================= */
export const getSubjects = () =>
  api.get("/subjects");

/* ================= TEACHER / STUDENT MANAGEMENT ================= */

// ✅ Get all students (Teacher only)
export const getStudents = async () => {
  const res = await api.get("/teacher/students");
  return res.data;
};

// ✅ Get single student (future use)
export const getStudentById = async (id: string) => {
  const res = await api.get(`/teacher/students/${id}`);
  return res.data;
};

// ✅ Reset student progress (admin / teacher)
export const resetStudentProgress = (studentId: string) =>
  api.put(`/teacher/students/${studentId}/reset`);

// ✅ Send message to student (future)
export const sendMessageToStudent = (studentId: string, message: string) =>
  api.post(`/teacher/students/${studentId}/message`, { message });

/* ================= ANALYTICS (FUTURE-READY) ================= */
export const getClassAnalytics = () =>
  api.get("/teacher/analytics");

/* ================= EXPORT ================= */
export default api;
