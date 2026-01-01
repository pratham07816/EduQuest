import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "../ui/badge";
import { getStudentFullReport } from "../../services/teacherApi";
import * as XLSX from "xlsx";


interface Props {
  studentId: string;
  onBack: () => void;
}

export function StudentFullReport({ studentId, onBack }: Props) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getStudentFullReport(studentId).then((res) => {
      setData(res.data);
    });
  }, [studentId]);

  if (!data) return null;

  /* ================= DOWNLOAD FULL REPORT ================= */
    const downloadFullReportExcel = () => {
    const workbook = XLSX.utils.book_new();

    /* PROFILE SHEET */
    const profileSheet = XLSX.utils.json_to_sheet([
        {
        Name: profile.name,
        Email: profile.email,
        Class: profile.class,
        XP: progress.xp,
        Level: progress.level,
        "Quizzes Completed": progress.quizzesCompleted,
        "Average Score": `${progress.averageScore}%`,
        },
    ]);
    XLSX.utils.book_append_sheet(workbook, profileSheet, "Profile");

    /* BADGES SHEET */
    const badgesSheet = XLSX.utils.json_to_sheet(
        badges.map((b: any) => ({ Badge: b.id }))
    );
    XLSX.utils.book_append_sheet(workbook, badgesSheet, "Badges");

    /* XP HISTORY SHEET */
    const xpSheet = XLSX.utils.json_to_sheet(
        xpHistory.map((x: any) => ({
        Date: new Date(x.createdAt).toLocaleDateString(),
        XP: x.xp,
        }))
    );
    XLSX.utils.book_append_sheet(workbook, xpSheet, "XP History");

    /* ACTIVITY SHEET */
    const activitySheet = XLSX.utils.json_to_sheet([
        {
        Joined: new Date(activity.joinedAt).toDateString(),
        "Last Updated": new Date(activity.lastUpdated).toDateString(),
        "Offline Mode": activity.offlineMode ? "Yes" : "No",
        },
    ]);
    XLSX.utils.book_append_sheet(workbook, activitySheet, "Activity");

    XLSX.writeFile(
        workbook,
        `${profile.name.replace(" ", "_")}_full_report.xlsx`
    );
};


  const { profile, progress, badges, xpHistory, activity } = data;

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-semibold">
                Student Full Report
                </h1>
            </div>

            <Button onClick={downloadFullReportExcel}>
                Download Excel
            </Button>
        </div>


        {/* PROFILE */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <img
              src={profile.avatar}
              className="mt-4 w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400">
                Class: {profile.class}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <Stat title="XP" value={progress.xp} />
            <Stat title="Level" value={`Level ${progress.level}`} />
            <Stat title="Quizzes" value={progress.quizzesCompleted} />
            <Stat title="Avg Score" value={`${progress.averageScore}%`} />
        </div>


        {/* BADGES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Badges Earned</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {badges.length === 0 && (
              <p className="text-sm text-gray-500">
                No badges earned yet
              </p>
            )}
            {badges.map((b: any) => (
              <Badge key={b.id} variant="secondary">
                {b.id}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* XP HISTORY */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">XP History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {xpHistory.map((x: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {new Date(x.createdAt).toLocaleDateString()}
                </span>
                <span>{x.xp} XP</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ACTIVITY */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Activity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-1">
            <p>
              Joined:{" "}
              {new Date(activity.joinedAt).toDateString()}
            </p>
            <p>
              Last Updated:{" "}
              {new Date(activity.lastUpdated).toDateString()}
            </p>
            <p>Offline Mode: {activity.offlineMode ? "Yes" : "No"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <Card className="h-36">
      <CardContent className="flex flex-col items-center justify-center h-full text-center">
        <p className="mt-4 mb-2 text-2xl uppercase tracking-wide font-bold text-gray-800">
            {title}
        </p>

        <p className="text-1xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}



