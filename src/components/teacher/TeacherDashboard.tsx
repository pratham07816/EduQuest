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

  useEffect(() => {
    getTeacherDashboard().then((res) => {
      console.log("Badge Distribution:", res.data.badgeDistribution);
      setStats(res.data);
    });
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
      {/* ================= SIDEBAR ================= */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-lg">EduQuest Teacher</h2>
          <p className="text-xs text-gray-500">Dashboard</p>
        </div>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("students")}
          >
            <Users className="w-4 h-4 mr-2" />
            Students
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("assignments")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Assignments
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("analytics")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("notifications")}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="md:ml-64 p-4 md:p-8">
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
            {/* XP PER SUBJECT */}
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

            {/* ENGAGEMENT TREND */}
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

          {/* ================= BADGES + KPIs ================= */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Badge Distribution</CardTitle>
                <CardDescription>
                  Achievements across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badgeDistribution.length > 0 &&
                badgeDistribution.some((b: any) => b.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={badgeDistribution}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine
                        label={renderCenteredLabel}
                      >
                        {badgeDistribution.map((b: any, i: number) => (
                          <Cell key={i} fill={b.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `${value} badges`,
                          `${name}`,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-400 mt-24">
                    No badges earned yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>
                  Important metrics at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg flex justify-between">
                  <div>
                    <p className="text-sm">Students Above 60%</p>
                    <p className="text-2xl">{stats?.studentsAbove60 ?? 0}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg flex justify-between">
                  <div>
                    <p className="text-sm">Avg XP Growth</p>
                    <p className="text-2xl">+{stats?.avgXPGrowth ?? 0}%</p>
                  </div>
                  <Award className="w-8 h-8 text-blue-600" />
                </div>

                <div className="p-4 bg-purple-50 rounded-lg flex justify-between">
                  <div>
                    <p className="text-sm">Quiz Completion Rate</p>
                    <p className="text-2xl">
                      {stats?.quizCompletionRate ?? 0}%
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button onClick={() => onNavigate("students")}>
                <Users className="w-4 h-4 mr-2" />
                View All Students
              </Button>
              <Button variant="outline" onClick={() => onNavigate("assignments")}>
                <FileText className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
              <Button variant="outline" onClick={() => onNavigate("analytics")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
