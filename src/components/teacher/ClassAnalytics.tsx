import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
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
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getClassAnalytics } from "../../services/teacherApi";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ================= MAIN COMPONENT ================= */

interface ClassAnalyticsProps {
  onBack: () => void;
}

export function ClassAnalytics({ onBack }: ClassAnalyticsProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getClassAnalytics().then((res) => setData(res.data));
  }, []);

  if (!data) return null;

  /* ================= SAFE ARRAYS ================= */

  const subjectPerformance = Array.isArray(data.subjectPerformance)
    ? data.subjectPerformance
    : [];

  const weeklyProgress = Array.isArray(data.weeklyProgress)
    ? data.weeklyProgress
    : [];

  const performanceDistribution = Array.isArray(data.performanceDistribution)
    ? data.performanceDistribution
    : [];

  const dailyEngagement = Array.isArray(data.dailyEngagement)
    ? data.dailyEngagement
    : [];

  /* ================= BASE VALUES ================= */

  const totalStudents = data.totalStudents || 0;

  /* ================= KPI CALCULATIONS ================= */

  const below60 =
    performanceDistribution.find((p: any) =>
      p.range.includes("0") && p.range.includes("60")
    )?.count || 0;

  const bestSubject =
    subjectPerformance.length > 0
      ? subjectPerformance.reduce((a: any, b: any) =>
          a.avgXP > b.avgXP ? a : b
        ).subject
      : "—";

  const highestDay =
    dailyEngagement.length > 0
      ? dailyEngagement.reduce((a: any, b: any) =>
          a.activeStudents > b.activeStudents ? a : b
        ).day
      : "—";

  const studentsAbove60 =
    performanceDistribution.reduce((sum: number, p: any) => {
      const start = Number(p.range.split(/[–-]/)[0]);
      return start >= 60 ? sum + p.count : sum;
    }, 0);

  const above60Percent =
    totalStudents > 0
      ? Math.round((studentsAbove60 / totalStudents) * 100)
      : 0;

  const avgXPGrowth =
    weeklyProgress.length >= 2 && weeklyProgress.at(-2)?.xp > 0
      ? Math.round(
          ((weeklyProgress.at(-1).xp -
            weeklyProgress.at(-2).xp) /
            weeklyProgress.at(-2).xp) *
            100
        )
      : 0;

  const quizzesThisWeek = weeklyProgress.at(-1)?.quizzes || 0;

  const quizCompletionRate =
    totalStudents > 0
      ? Math.min(
          100,
          Math.round((quizzesThisWeek / totalStudents) * 10)
        )
      : 0;

  const todayActive = totalStudents;

  /* ================= EXCEL DOWNLOAD ================= */

  const downloadExcelReport = () => {
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet([
        { Metric: "Total Students", Value: totalStudents },
        { Metric: "Students Above 60%", Value: `${above60Percent}%` },
        { Metric: "Avg XP Growth", Value: `${avgXPGrowth}%` },
        { Metric: "Quiz Completion Rate", Value: `${quizCompletionRate}%` },
        { Metric: "Active Students", Value: todayActive },
      ]),
      "KPIs"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(subjectPerformance),
      "Subject Performance"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(weeklyProgress),
      "Weekly Progress"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(performanceDistribution),
      "Performance Distribution"
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(dailyEngagement),
      "Daily Engagement"
    );

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Class_Analytics_Report.xlsx"
    );
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Class Analytics</h1>
              <p className="text-sm text-gray-500">
                Detailed performance insights and trends
              </p>
            </div>
          </div>

          <Button className="cursor-pointer" onClick={downloadExcelReport}>
            Download Excel Report
          </Button>
        </div>

        {/* KPI ROW */}
        <div className="grid md:grid-cols-4 gap-8">
          <Card>
            <CardContent className="flex items-center justify-between mt-4">
              <div>
                <p className="text-base font-semibold text-gray-600">
                  Students Above 60%
                </p>
                <p className="text-2xl font-semibold">{above60Percent}%</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
              <TrendingUp className="text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between mt-4">
              <div>
                <p className="text-base font-semibold text-gray-600">
                  Avg XP Growth
                </p>
                <p className="text-2xl font-semibold">+{avgXPGrowth}%</p>
                <p className="text-xs text-green-600">Week over week</p>
              </div>
              <Award className="text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between mt-4">
              <div>
                <p className="text-base font-semibold text-gray-600">
                  Quiz Completion Percent
                </p>
                <p className="text-2xl font-semibold">{quizCompletionRate}%</p>
                <p className="text-xs text-green-600">
                  {quizzesThisWeek} quizzes this week
                </p>
              </div>
              <BookOpen className="text-purple-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between mt-4">
              <div>
                <p className="text-base font-semibold text-gray-600">
                  Active Students
                </p>
                <p className="text-2xl font-semibold">
                  {todayActive}/{totalStudents}
                </p>
                <p className="text-xs text-green-600">Daily average</p>
              </div>
              <Users className="text-orange-600" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-1xl">Average XP per Subject</CardTitle>
              <CardDescription>
                  Student performance across subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformance}>
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
              <CardTitle className="text-1xl">Weekly Progress Trend</CardTitle>
              <CardDescription>
                  XP and quiz activity over recent weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area dataKey="xp" stroke="#8b5cf6" fill="#8b5cf6" />
                  <Area dataKey="quizzes" stroke="#ec4899" fill="#ec4899" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-1xl">Performance Distribution</CardTitle>
              <CardDescription>
                  Student distribution across performance ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    dataKey="count"
                    outerRadius={100}
                    label={({ range, count }) => `${range}: ${count}`}
                  >
                    {performanceDistribution.map((e: any, i: number) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-1xl">Daily Engagement Pattern</CardTitle>
              <CardDescription>
                  Daily trend of active students and quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="activeStudents" stroke="#3b82f6" />
                  <Line dataKey="quizCompleted" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* KEY INSIGHTS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-1xl">Key Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs mr-2">
                Positive
              </span>
              {bestSubject} shows strongest performance with highest average XP.
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs mr-2">
                Insight
              </span>
              Weekly XP growth shows consistent improvement in engagement.
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs mr-2">
                Action
              </span>
              {below60} students below 60% — recommend personalized support.
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs mr-2">
                Trend
              </span>
              {highestDay} shows highest engagement — schedule key quizzes.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
