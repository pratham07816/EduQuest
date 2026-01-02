import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ================= AUTH TOKEN ================= */
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

/* ================= NOTIFICATIONS ================= */

export const getNotifications = () =>
  API.get("/api/notifications");

export const getNotificationStats = () =>
  API.get("/api/notifications/stats");

export const markNotificationsRead = () =>
  API.put("/api/notifications/read");

/* ================= ANNOUNCEMENTS ================= */

export const sendAnnouncement = (data: {
  subject: string;
  message: string;
}) =>
  API.post("/api/announcements", data);

export default API;
