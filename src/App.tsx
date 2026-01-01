import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { LoginPage } from "./components/student/LoginPage";
import { TeacherLoginPage } from "./components/teacher/TeacherLogin";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { StudentManagement } from "./components/teacher/StudentManagement";
import { AssignmentPage } from "./components/teacher/AssignmentPage";
import { ClassAnalytics } from "./components/teacher/ClassAnalytics";
import { NotificationsPage } from "./components/teacher/NotificationsPage";
import { TeacherSettings } from "./components/teacher/TeacherSettings";

import { StudentDashboard } from "./components/student/Dashboard";
import { SubjectPage } from "./components/student/SubjectPage";
import { QuizPage } from "./components/student/QuizPage";
import { LeaderboardPage } from "./components/student/LeaderboardPage";
import { BadgesPage } from "./components/student/BadgesPage";
import { ProfilePage } from "./components/student/ProfilePage";
import { VideoPage } from "./components/student/VideoPage";

import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  /* ================= STUDENT NAVIGATION ================= */
  const [studentPage, setStudentPage] = useState("login");
  const [pageData, setPageData] = useState<any | null>(null);

  /* ================= TEACHER NAVIGATION ================= */
  const [teacherPage, setTeacherPage] = useState("dashboard");

  useEffect(() => {
    if (user?.role === "student") {
      setStudentPage("dashboard");
    }
  }, [user]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    setStudentPage("login");
    setTeacherPage("dashboard");
    setPageData(null);
  };

  /* ================= STUDENT NAVIGATION ================= */
  const handleStudentNavigate = (page: string, data?: any) => {
    setStudentPage(page);
    setPageData(data || null);
  };

  /* ================= TEACHER LOGIN ================= */
  if (!user && location.pathname === "/teacher-login") {
    return (
      <>
        <TeacherLoginPage />
        <Toaster />
      </>
    );
  }

  /* ================= STUDENT UI ================= */
  if (user?.role === "student") {
    switch (studentPage) {
      case "dashboard":
        return (
          <>
            <StudentDashboard
              student={user}
              badgesCount={user?.badges?.length ?? 0}
              streak={user?.progress?.quizzesCompleted ?? 0}
              performance={
                user?.progress?.quizzesCompleted > 0
                  ? Math.round(
                      user.progress.totalScore /
                        user.progress.quizzesCompleted
                    )
                  : 0
              }
              attendance={
                user?.progress?.quizzesCompleted > 0 ? 100 : 0
              }
              onNavigate={handleStudentNavigate}
            />
            <Toaster />
          </>
        );

      case "subject":
        if (!pageData) return null;
        return (
          <>
            <SubjectPage
              subject={pageData}
              onNavigate={handleStudentNavigate}
              onBack={() => handleStudentNavigate("dashboard")}
            />
            <Toaster />
          </>
        );

      case "quiz":
        if (!pageData) return null;
        return (
          <>
            <QuizPage
              quizData={pageData}
              onBack={() => handleStudentNavigate("dashboard")}
            />
            <Toaster />
          </>
        );

      case "leaderboard":
        return (
          <>
            <LeaderboardPage
              onBack={() => handleStudentNavigate("dashboard")}
            />
            <Toaster />
          </>
        );

      case "badges":
        return (
          <>
            <BadgesPage
              badges={user?.badges ?? []}
              onBack={() => handleStudentNavigate("dashboard")}
            />
            <Toaster />
          </>
        );

      case "profile":
        return (
          <>
            <ProfilePage
              student={user}
              onBack={() => handleStudentNavigate("dashboard")}
              onLogout={handleLogout}
            />
            <Toaster />
          </>
        );

      case "video":
        if (!pageData) return null;
        return (
          <>
            <VideoPage
              data={pageData}
              onBack={() =>
                handleStudentNavigate("subject", pageData.subject)
              }
            />
            <Toaster />
          </>
        );
    }
  }

  /* ================= TEACHER UI ================= */
  if (user?.role === "teacher") {
    switch (teacherPage) {
      case "dashboard":
        return (
          <>
            <TeacherDashboard
              teacher={user}
              onNavigate={setTeacherPage}
              onLogout={handleLogout}
            />
            <Toaster />
          </>
        );

      case "students":
        return (
          <>
            <StudentManagement
              onBack={() => setTeacherPage("dashboard")}
            />
            <Toaster />
          </>
        );

      case "assignments":
        return (
          <>
            <AssignmentPage
              onBack={() => setTeacherPage("dashboard")}
            />
            <Toaster />
          </>
        );

      case "analytics":
        return (
          <>
            <ClassAnalytics
              onBack={() => setTeacherPage("dashboard")}
            />
            <Toaster />
          </>
        );

      case "notifications":
        return (
          <>
            <NotificationsPage
              onBack={() => setTeacherPage("dashboard")}
            />
            <Toaster />
          </>
        );

      case "settings":
        return (
          <>
            <TeacherSettings
              teacher={user}
              onBack={() => setTeacherPage("dashboard")}
            />
            <Toaster />
          </>
        );
    }
  }

  /* ================= DEFAULT ================= */
  return (
    <>
      <LoginPage />
      <Toaster />
    </>
  );
}
