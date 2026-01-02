import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Trophy, Award } from "lucide-react";
import api from "../../services/api";

/* ================= TYPES ================= */
interface LeaderboardEntry {
  studentId: string;
  name: string;
  xp: number;
  level: number;
  badges: number;
  rank: number;
}

interface LeaderboardResponse {
  currentUser: {
    id: string;
    xp: number;
    rank: number;
  };
  leaderboard: LeaderboardEntry[];
}

interface LeaderboardPageProps {
  onBack: () => void;
}

/* ================= COMPONENT ================= */
export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= MEDAL ICON ================= */
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-gray-400">{rank}</span>;
  };

  /* ================= FETCH LEADERBOARD ================= */
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get<LeaderboardResponse>(
          `/api/leaderboard?period=${period}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period]);

  /* ================= LOADING ================= */
  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  const { leaderboard, currentUser } = data;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl">Leaderboard</h1>
            <p className="text-gray-600">Compete with students</p>
          </div>
        </div>

        {/* Your Rank Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Your Rank</p>
                  <p className="text-2xl">#{currentUser.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">XP</p>
                <p className="text-2xl">{currentUser.xp}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period Toggle */}
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant={period === "weekly" ? "default" : "outline"}
            onClick={() => setPeriod("weekly")}
          >
            Weekly
          </Button>
          <Button
            size="sm"
            variant={period === "monthly" ? "default" : "outline"}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </Button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.studentId === currentUser.id;

            return (
              <Card
                key={entry.studentId}
                className={isCurrentUser ? "bg-blue-50 border-blue-300" : ""}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center">
                      {getMedalIcon(entry.rank)}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                      {entry.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <p className={isCurrentUser ? "font-semibold" : ""}>
                        {entry.name}
                        {isCurrentUser && (
                          <Badge className="ml-2" variant="secondary">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Level {entry.level}
                      </p>
                    </div>

                    <div className="text-right">
                      <p>{entry.xp.toLocaleString()} XP</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 justify-end">
                        <Award className="w-3 h-3" />
                        <span>{entry.badges}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
