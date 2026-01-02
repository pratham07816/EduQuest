import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Teacher } from "../../types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getTeacherDashboard } from "../../services/teacherApi";

interface TeacherDashboardProps {
  teacher: Teacher;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

/* ---------------- SMALL STAT CARD ---------------- */
function StatCard({
  title,
  value,
  icon,
  delta,
  sub,
  bg,
}: any) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-3xl">{value}</p>
            {delta !== undefined && (
              <p className="text-xs text-green-600">
                +{delta}% from last week
              </p>
            )}
            {sub && <p className="text-xs text-gray-600">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ✅ CUSTOM PIE LABEL (CENTERED)
const renderCenteredLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight={500}
    >
      {value}
    </text>
  );
};

/* ---------------- DASHBOARD ---------------- */
export function TeacherDashboard({
  teacher,
  onNavigate,
  onLogout,
}: TeacherDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getTeacherDashboard().then((res) => setStats(res.data));
  }, []);

  /* -------- SAFE FALLBACKS -------- */
  const totalStudents = stats?.totalStudents ?? 0;
  const avgScore = stats?.averageScore ?? 0;
  const engagementRate = stats?.engagementRate ?? 0;

  const studentGrowth = stats?.studentGrowth ?? 0;
  const scoreGrowth = stats?.scoreGrowth ?? 0;
  const engagementGrowth = stats?.engagementGrowth ?? 0;

  const subjectXP = stats?.subjectXP ?? [];
  const engagementTrend = stats?.engagementTrend ?? [];
  const badgeDistribution = stats?.badgeDistribution ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= TOP HEADER ================= */}
      <div className="flex items-center gap-3 bg-white p-4 border-b sticky top-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>

        <h2 className="text-lg font-semibold">EduQuest</h2>
      </div>

      {/* ================= DROPDOWN SIDEBAR ================= */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute left-0 top-0 w-64 h-full bg-white p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate("students");
                  setMenuOpen(false);
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Students
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate("assignments");
                  setMenuOpen(false);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Assignments
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate("analytics");
                  setMenuOpen(false);
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate("notifications");
                  setMenuOpen(false);
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate("settings");
                  setMenuOpen(false);
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl">Welcome, {teacher.name}</h1>
            <p className="text-gray-600">
              {teacher.school} - {teacher.specialization}
            </p>
          </div>

          {/* ================= TOP STATS ================= */}
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value={totalStudents}
              delta={studentGrowth}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-100"
            />

            <StatCard
              title="Average Score"
              value={`${avgScore}%`}
              delta={scoreGrowth}
              icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              bg="bg-green-100"
            />

            <StatCard
              title="Most Active Subject"
              value={subjectXP[0]?.subject ?? "—"}
              sub={`${subjectXP[0]?.avgXP ?? 0} avg XP`}
              icon={<BookOpen className="w-6 h-6 text-purple-600" />}
              bg="bg-purple-100"
            />

            <StatCard
              title="Engagement Rate"
              value={`${engagementRate}%`}
              delta={engagementGrowth}
              icon={<Award className="w-6 h-6 text-orange-600" />}
              bg="bg-orange-100"
            />
          </div>

          {/* ================= CHARTS ================= */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average XP per Subject</CardTitle>
                <CardDescription>
                  Student performance across subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectXP}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgXP" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Over Time</CardTitle>
                <CardDescription>Active students per week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
