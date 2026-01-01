import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  Trophy,
  Gamepad2,
  BookOpen,
  TrendingUp,
  Flame,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Student } from "../../types";
import { getSubjects } from "../../services/api";

interface DashboardProps {
  student: Student;
  badgesCount: number;
  streak: number;
  performance: number;
  attendance: number;
  onNavigate: (page: string, data?: any) => void;
  isOffline?: boolean;
}

export function StudentDashboard({
  student,
  badgesCount,
  streak,
  performance,
  attendance,
  onNavigate,
  isOffline = false,
}: DashboardProps) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ UPDATED: XP & Level from backend progress
  const xp = student.progress?.xp ?? 0;
  const level = student.progress?.level ?? 1;

  // XP progress bar (500 XP per level)
  const xpProgress = ((xp % 500) / 500) * 100;

  /* ================= FETCH SUBJECTS ================= */
  useEffect(() => {
    getSubjects()
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Failed to load subjects", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl">
              Hello {student.name?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-gray-600">Ready to learn something new?</p>
          </div>

          <div className="flex items-center gap-2">
            {isOffline ? (
              <Badge variant="destructive" className="gap-1">
                <WifiOff className="w-3 h-3" />
                Offline
              </Badge>
            ) : (
              <Badge className="gap-1 bg-green-500">
                <Wifi className="w-3 h-3" />
                Online
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("profile")}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                {student.name?.charAt(0) || "S"}
              </div>
            </Button>
          </div>
        </div>

        {/* ================= XP PROGRESS ================= */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Level {level}</span>
              </div>
              <span className="text-sm text-gray-600">{xp} XP</span>
            </div>

            <Progress value={xpProgress} className="h-3" />

            <p className="text-xs text-gray-500 mt-1">
              {500 - (xp % 500)} XP to Level {level + 1}
            </p>
          </CardContent>
        </Card>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl">{streak}</p>
              <p className="text-xs text-gray-600">Quiz Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl">{badgesCount}</p>
              <p className="text-xs text-gray-600">Badges</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl">{performance}%</p>
              <p className="text-xs text-gray-600">Performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl">{attendance}%</p>
              <p className="text-xs text-gray-600">Attendance</p>
            </CardContent>
          </Card>
        </div>

        {/* ================= SUBJECTS ================= */}
        <div>
          <h2 className="text-xl mb-4">Subjects</h2>

          {loading && <p className="text-gray-500">Loading subjects...</p>}

          {!loading && subjects.length === 0 && (
            <p className="text-gray-500">No subjects available</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <Card
                key={subject._id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate("subject", subject)}
              >
                <CardContent className="pt-6 text-center">
                  <div
                    className={`${subject.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}
                  >
                    <span className="text-3xl">{subject.icon}</span>
                  </div>
                  <p>{subject.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            size="lg"
            className="h-auto py-6"
            disabled={!subjects.length}
            onClick={() =>
              subjects.length && onNavigate("quiz", { subjects })
            }
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            Play Quiz
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-auto py-6"
            onClick={() => onNavigate("leaderboard")}
          >
            <Trophy className="w-5 h-5 mr-2" />
            View Leaderboard
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-auto py-6"
            onClick={() => onNavigate("badges")}
          >
            <Trophy className="w-5 h-5 mr-2" />
            My Badges
          </Button>
        </div>
      </div>
    </div>
  );
}
