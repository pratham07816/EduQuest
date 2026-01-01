import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ArrowLeft,
  Search,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import * as XLSX from "xlsx";


import { getStudents } from "../../services/api";
import { StudentFullReport } from "./StudentFullReport";

/* ================= TYPES ================= */
export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  xp: number;
  level: number;
  badges: any[];
  attendance: number;
  performance: number;
  favoriteSubjects: string[];
}

interface StudentManagementProps {
  onBack: () => void;
}

/* ================= COMPONENT ================= */
export function StudentManagement({ onBack }: StudentManagementProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"xp" | "performance" | "name">("xp");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await getStudents();

        const normalized: Student[] = data.map((s: any) => ({
          id: s._id,
          name: s.name,
          email: s.email,
          class: s.class || "—",
          xp: s.xp,
          level: s.level,
          badges: s.badges || [],
          attendance: s.attendance,
          performance: s.performance,
          favoriteSubjects: s.favoriteSubjects || [],
        }));

        setStudents(normalized);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  /* ================= HELPERS ================= */
  const getPerformanceColor = (value: number) => {
    if (value >= 85) return "text-green-600";
    if (value >= 70) return "text-blue-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (value: number) => {
    if (value >= 85) return <Badge className="bg-green-500">Excellent</Badge>;
    if (value >= 70) return <Badge className="bg-blue-500">Good</Badge>;
    if (value >= 60) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    const excelData = filteredStudents.map((s) => ({
      Name: s.name,
      Email: s.email,
      Class: s.class,
      XP: s.xp,
      Level: s.level,
      Badges: s.badges.length,
      Attendance: `${s.attendance}%`,
      Performance: `${s.performance}%`,
      "Favorite Subjects": s.favoriteSubjects.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_report.xlsx");
  };


  /* ================= FILTER & SORT ================= */
  const filteredStudents = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "performance") return b.performance - a.performance;
      return a.name.localeCompare(b.name);
    });

  /* ================= FULL REPORT VIEW ================= */
  if (showFullReport && selectedStudent) {
    return (
      <StudentFullReport
        studentId={selectedStudent.id}
        onBack={() => setShowFullReport(false)}
      />
    );
  }

  /* ================= STUDENT DETAILS VIEW ================= */
  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedStudent(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl">Student Details</h1>
              <p className="text-gray-600">{selectedStudent.name}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                  {selectedStudent.name.charAt(0)}
                </div>
                <p>{selectedStudent.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedStudent.class}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl text-gray-600 mb-1">XP & Level</p>
                <p className="text-2xl mb-1">
                  {selectedStudent.xp} XP
                </p>
                <p className="text-1xl">
                  Level {selectedStudent.level}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl text-gray-600 mb-1">Performance</p>
                <p
                  className={`text-2xl mb-1 ${getPerformanceColor(
                    selectedStudent.performance
                  )}`}
                >
                  {selectedStudent.performance}%
                </p>
                {getPerformanceBadge(selectedStudent.performance)}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-1xl">Academic Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Attendance</span>
                  <span>{selectedStudent.attendance}%</span>
                </div>
                <Progress value={selectedStudent.attendance} />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Performance</span>
                  <span>{selectedStudent.performance}%</span>
                </div>
                <Progress value={selectedStudent.performance} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowFullReport(true)}
            >
              View Full Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN TABLE VIEW ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl">Student Management</h1>
            <p className="text-gray-600">
              Monitor and manage student progress
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xp">Sort by XP</SelectItem>
                  <SelectItem value="performance">
                    Sort by Performance
                  </SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={downloadExcel}
                className="cursor-pointer"
              >
                Download Excel
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-center py-10">Loading students...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStudents.map((s, index) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-gray-600 font-medium">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p>{s.name}</p>
                            <p className="text-xs text-gray-500">
                              {s.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{s.class}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {s.xp}
                          {s.xp >= 1200 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell>{s.badges.length}</TableCell>

                      <TableCell>
                        <Progress value={s.attendance} className="h-2" />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={getPerformanceColor(s.performance)}>
                            {s.performance}%
                          </span>
                          {getPerformanceBadge(s.performance)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudent(s)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
