import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

import {
  ArrowLeft,
  Bell,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { getNotifications } from "../../services/notificationApi";

/* ================= TYPES ================= */

interface NotificationsPageProps {
  onBack: () => void;
}

type NotificationItem = {
  _id: string;
  type: "quiz" | "badge" | "alert" | "progress";
  title: string;
  description: string;
  bg: string;
  color: string;
  createdAt: string;
};

/* ================= COMPONENT ================= */

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    getNotifications()
      .then((res) => {
        const data = res.data;
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => setNotifications([]));
  }, []);

  /* ================= HELPERS ================= */

  const getIcon = (type: string) => {
    switch (type) {
      case "quiz":
      case "badge":
        return Award;
      case "alert":
        return AlertCircle;
      case "progress":
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const formatTime = (date: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(date).getTime()) / 60000
    );

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl">Notifications & Messages</h1>
            <p className="text-gray-600">
              Stay updated with student activities
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ================= LEFT: RECENT ACTIVITY (0–4) ================= */}
          <Card className="h-[520px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {notifications.slice(0, 5).map((n) => {
                const Icon = getIcon(n.type);

                return (
                  <div
                    key={n._id}
                    className={`p-4 rounded-lg ${n.bg} border border-gray-200`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${n.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm mb-1">{n.title}</p>
                        <p className="text-xs text-gray-600 mb-2">
                          {n.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ================= RIGHT: EARLIER ACTIVITY (5–10) ================= */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Earlier Activity
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {notifications.slice(5, 10).map((n) => {
                const Icon = getIcon(n.type);

                return (
                  <div
                    key={n._id}
                    className={`p-4 rounded-lg ${n.bg} border border-gray-200`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${n.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm mb-1">{n.title}</p>
                        <p className="text-xs text-gray-600 mb-2">
                          {n.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
