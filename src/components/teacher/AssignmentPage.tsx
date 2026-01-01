import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Trash2, X } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";


/* ================= TYPES ================= */

interface Chapter {
  name: string;
  quizId: string;
}

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
}

interface QuestionForm {
  text: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
}

/* ================= COMPONENT ================= */

export function AssignmentPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState<QuestionForm>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    xpReward: 50,
  });

  /* ================= AUTH ================= */

  if (user?.role !== "teacher") {
    return <p className="p-6">Unauthorized</p>;
  }

  /* ================= DATA ================= */

  useEffect(() => {
    api.get("/subjects").then((res) => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    setChapters(selectedSubject.chapters || []);
  }, [selectedSubject]);

  useEffect(() => {
    if (!selectedChapter) return;

    setLoading(true);
    setQuestions([]);

    api
      .get(`/quizzes/${selectedChapter.quizId}`)
      .then((res) => setQuestions(res.data.questions || []))
      .finally(() => setLoading(false));
  }, [selectedChapter]);

  /* ================= ACTIONS ================= */

  const handleAddQuestion = async () => {
    try {
      await api.post(
        `/quizzes/${selectedChapter?.quizId}/questions`,
        form
      );

      setShowAdd(false);
      setForm({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        xpReward: 50,
      });

      const res = await api.get(
        `/quizzes/${selectedChapter?.quizId}`
      );
      setQuestions(res.data.questions || []);

      toast.success("Question added successfully", {
        duration: 2500,
      });
    } catch {
      toast.error("Failed to add question", {
        duration: 2500,
      });
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await api.delete(
        `/quizzes/${selectedChapter?.quizId}/questions/${index}`
      );

      setQuestions((prev) => prev.filter((_, i) => i !== index));
      toast.success("Question deleted successfully", {
        duration: 2500,
      });
    } catch {
      toast.error("Failed to delete question", {
        duration: 2500,
      });
    }
  };

  /* ================= SUBJECT ================= */

  if (!selectedSubject) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <h1 className="text-2xl font-bold">Choose a Subject</h1>

          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((sub) => (
              <Card
                key={sub._id}
                className="rounded-xl bg-gray-50 hover:shadow cursor-pointer"
                onClick={() => setSelectedSubject(sub)}
              >
                <CardHeader>
                  <CardTitle className="mb-4">{sub.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= CHAPTER ================= */

  if (!selectedChapter) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => setSelectedSubject(null)}>
            ← Back to Subjects
          </Button>

          <h1 className="text-2xl font-bold">{selectedSubject.name}</h1>

          {chapters.map((ch) => (
            <Card
              key={ch.quizId}
              className="rounded-xl bg-gray-50 hover:shadow cursor-pointer mb-4"
              onClick={() => setSelectedChapter(ch)}
            >
              <CardHeader>
                <CardTitle className="mb-4">{ch.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ================= MAIN ================= */

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">

      {/* ================= MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl p-4 space-y-3 shadow-xl relative">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold">Add Question</h2>

            <Textarea
              autoFocus
              placeholder="Question text"
              className="min-h-[70px]"
              value={form.text}
              onChange={(e) =>
                setForm({ ...form, text: e.target.value })
              }
            />

            {form.options.map((opt, i) => (
              <Input
                key={i}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...form.options];
                  updated[i] = e.target.value;
                  setForm({ ...form, options: updated });
                }}
              />
            ))}

            <Select
              value={form.correctAnswer.toString()}
              onValueChange={(v) =>
                setForm({ ...form, correctAnswer: Number(v) })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Correct Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Option A</SelectItem>
                <SelectItem value="1">Option B</SelectItem>
                <SelectItem value="2">Option C</SelectItem>
                <SelectItem value="3">Option D</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              className="h-9"
              placeholder="Score"
              value={form.xpReward}
              onChange={(e) =>
                setForm({ ...form, xpReward: Number(e.target.value) })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddQuestion}>
                Save Question
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAGE ================= */}
      <div
        className={`max-w-4xl mx-auto space-y-6 transition-all ${
          showAdd ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        <Button variant="ghost" onClick={() => setSelectedChapter(null)}>
          ← Back to Chapters
        </Button>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {selectedChapter.name} – Question Bank
          </h1>

          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {loading && <p>Loading questions...</p>}

        {questions.map((q, index) => (
          <Card
            key={index}
            className="rounded-xl bg-gray-50 border border-gray-200 mb-4"
          >
            <CardHeader>
              <CardTitle>Question {index + 1}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-1">
              <p><b>Question –</b> {q.text}</p>
              <p><b>Option A –</b> {q.options[0]}</p>
              <p><b>Option B –</b> {q.options[1]}</p>
              <p><b>Option C –</b> {q.options[2]}</p>
              <p><b>Option D –</b> {q.options[3]}</p>
              <p className="text-green-600 font-semibold">
                Correct Option – {String.fromCharCode(65 + q.correctAnswer)}
              </p>
              <p className="text-blue-600 font-semibold">
                Score – {q.xpReward} XP
              </p>

              <Button
                variant="destructive"
                size="sm"
                className="mt-3"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
