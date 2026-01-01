import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // MUST exist
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ================= NOTIFICATIONS ================= */

export const getNotifications = () =>
  API.get("/notifications");

export const getNotificationStats = () =>
  API.get("/notifications/stats");

export const markNotificationsRead = () =>
  API.put("/notifications/read");

/* ================= ANNOUNCEMENTS ================= */

export const sendAnnouncement = (data: {
  subject: string;
  message: string;
}) =>
  API.post("/announcements", data);
