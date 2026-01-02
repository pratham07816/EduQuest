import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Clock, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { Quiz } from "../../types";
import api from "../../services/api";
import { unlockBadges } from "../../utils/badges";
import { useAuth } from "../../context/AuthContext";

interface QuizPageProps {
  quizData?: {
    subjects?: any[];
    subject?: any;
    preselectedChapter?: any;
    directStart?: boolean;
  };
  onBack: () => void;
}

export function QuizPage({ quizData, onBack }: QuizPageProps) {
  const { user, setUser } = useAuth();

  const isDirectStart =
    quizData?.directStart && quizData?.preselectedChapter;

  const backLabel = isDirectStart
    ? "← Back to Dashboard"
    : "← Back to Chapters";

  const subjects = Array.isArray(quizData?.subjects)
    ? quizData.subjects
    : [];

  const [selectedSubject, setSelectedSubject] = useState<any | null>(
    isDirectStart ? quizData?.subject ?? null : null
  );
  const [selectedChapter, setSelectedChapter] = useState<any | null>(
    isDirectStart ? quizData?.preselectedChapter : null
  );

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<any[]>([]);

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    if (!selectedChapter?.quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoadingQuiz(true);
        setQuiz(null);

        const res = await api.get(
          `/api/quizzes/${selectedChapter.quizId}`
        );

        setQuiz(res.data);
        setTimeLeft(res.data.timePerQuestion);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTotalXP(0);
        setShowResult(false);
        setNewlyUnlockedBadges([]);
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuiz();
  }, [selectedChapter]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!quiz || isAnswered || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsAnswered(true);
          setTimeout(moveNext, 1200);
          return quiz.timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, currentQuestionIndex, isAnswered, showResult]);

  /* ================= QUIZ FLOW ================= */
  const moveNext = () => {
    if (!quiz || !user) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(quiz.timePerQuestion);
    } else {
      const percent = Math.round(
        (score / quiz.questions.length) * 100
      );

      if (percent >= 60) {
        confetti({
          particleCount: percent >= 90 ? 150 : 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      const newXp = user.progress.xp + totalXP;
      const newQuizzes = user.progress.quizzesCompleted + 1;
      const newLevel = Math.floor(newXp / 500) + 1;

      const updatedBadges = unlockBadges({
        xp: newXp,
        level: newLevel,
        score: percent,
        quizzesCompleted: newQuizzes,
        currentBadges: user.badges,
      });

      const freshBadges = updatedBadges.filter(
        (b) =>
          b.unlocked &&
          !user.badges.some((old) => old.id === b.id)
      );

      setNewlyUnlockedBadges(freshBadges);
      setShowResult(true);
    }
  };

  const handleAnswer = (index: number) => {
    if (!quiz || isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore((s) => s + 1);
      setTotalXP(
        (xp) => xp + (quiz.questions[currentQuestionIndex].xpReward ?? 0)
      );
    }

    setTimeout(moveNext, 1200);
  };

  /* ================= RESULT SUBMIT ================= */
  const handleResultBack = async () => {
    if (!quiz || !user) return;

    const percent = Math.round(
      (score / quiz.questions.length) * 100
    );

    try {
      const res = await api.post("/api/progress", {
        xpGained: totalXP,
        score: percent,
        unlockedBadges: newlyUnlockedBadges.map((b) => b.id),
      });

      setUser((prev: any) => ({
        ...prev,
        progress: res.data.progress,
        badges: res.data.badges,
      }));
    } catch (err) {
      console.error("Progress update failed", err);
    }

    setQuiz(null);
    setSelectedChapter(null);
    setShowResult(false);
    onBack();
  };

  /* ================= RESULT UI ================= */
  if (showResult && quiz) {
    const percent = Math.round(
      (score / quiz.questions.length) * 100
    );

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <Trophy className="mx-auto w-10 h-10 text-yellow-500" />
            <CardTitle>Quiz Completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Score: {score}/{quiz.questions.length} ({percent}%)
            </p>
            <p>XP Earned: +{totalXP}</p>

            {newlyUnlockedBadges.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold text-green-600 mb-2">
                  🎉 New Badges Unlocked
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {newlyUnlockedBadges.map((b) => (
                    <div key={b.id} className="flex flex-col items-center">
                      <div className="text-3xl">{b.icon}</div>
                      <p className="text-xs">{b.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleResultBack}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ================= LOADING ================= */
  if (loadingQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  /* ================= QUIZ UI ================= */
  if (quiz) {
    const question = quiz.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>

          <div className="flex justify-between items-center">
            <Progress value={progress} />
            <Badge>
              <Clock className="w-3 h-3 mr-1" /> {timeLeft}s
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((opt, i) => {
                const isCorrect =
                  isAnswered && i === question.correctAnswer;
                const isWrong =
                  isAnswered &&
                  i === selectedAnswer &&
                  i !== question.correctAnswer;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-lg border transition ${
                      isCorrect
                        ? "bg-green-100 border-green-500"
                        : isWrong
                        ? "bg-red-100 border-red-500"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ================= SUBJECT SELECTION ================= */
  if (!selectedSubject) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>

          <h1 className="text-2xl font-bold">Choose a Subject</h1>

          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((sub) => (
              <Card
                key={sub._id}
                className="cursor-pointer hover:shadow"
                onClick={() => setSelectedSubject(sub)}
              >
                <CardHeader className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">{sub.icon}</span>
                  <CardTitle>{sub.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= CHAPTER SELECTION ================= */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setSelectedSubject(null)}>
          ← Back to Subjects
        </Button>

        <h1 className="text-2xl font-bold">{selectedSubject.name}</h1>

        {selectedSubject.chapters.map((chapter: any) => (
          <Card
            key={chapter.quizId}
            className="cursor-pointer hover:shadow"
            onClick={() => setSelectedChapter(chapter)}
          >
            <CardHeader className="mb-8">
              <CardTitle>{chapter.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
