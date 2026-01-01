import { Badge } from "../types";

/* =========================================================
   ALL BADGES — TOTAL: 30
   Difficulty: Balanced (No badge spam)
   Types: bronze | silver | gold
========================================================= */

export const ALL_BADGES: Badge[] = [
  /* ================= FOUNDATION (6) ================= */
  {
    id: "quiz_3",
    name: "Getting Serious",
    icon: "🎯",
    type: "bronze",
    description: "Complete 3 quizzes",
    unlocked: false,
  },
  {
    id: "quiz_7",
    name: "On Track",
    icon: "🛤️",
    type: "bronze",
    description: "Complete 7 quizzes",
    unlocked: false,
  },
  {
    id: "xp_150",
    name: "XP Initiate",
    icon: "⚡",
    type: "bronze",
    description: "Earn 150 XP",
    unlocked: false,
  },
  {
    id: "xp_300",
    name: "XP Builder",
    icon: "🔧",
    type: "bronze",
    description: "Earn 300 XP",
    unlocked: false,
  },
  {
    id: "level_2",
    name: "Level Rising",
    icon: "🚀",
    type: "bronze",
    description: "Reach Level 2",
    unlocked: false,
  },
  {
    id: "level_3",
    name: "Steady Growth",
    icon: "📈",
    type: "bronze",
    description: "Reach Level 3",
    unlocked: false,
  },

  /* ================= CONSISTENCY (8) ================= */
  {
    id: "quiz_10",
    name: "Consistent Learner",
    icon: "📘",
    type: "silver",
    description: "Complete 10 quizzes",
    unlocked: false,
  },
  {
    id: "quiz_15",
    name: "Focused Mind",
    icon: "🧩",
    type: "silver",
    description: "Complete 15 quizzes",
    unlocked: false,
  },
  {
    id: "quiz_25",
    name: "Dedicated Scholar",
    icon: "📚",
    type: "gold",
    description: "Complete 25 quizzes",
    unlocked: false,
  },
  {
    id: "xp_500",
    name: "XP Grinder",
    icon: "🔥",
    type: "silver",
    description: "Earn 500 XP",
    unlocked: false,
  },
  {
    id: "xp_1000",
    name: "XP Veteran",
    icon: "💠",
    type: "silver",
    description: "Earn 1000 XP",
    unlocked: false,
  },
  {
    id: "xp_2000",
    name: "XP Master",
    icon: "💎",
    type: "gold",
    description: "Earn 2000 XP",
    unlocked: false,
  },
  {
    id: "level_5",
    name: "Rising Star",
    icon: "🌟",
    type: "silver",
    description: "Reach Level 5",
    unlocked: false,
  },
  {
    id: "level_7",
    name: "Elite Learner",
    icon: "🏆",
    type: "gold",
    description: "Reach Level 7",
    unlocked: false,
  },

  /* ================= PERFORMANCE (6) ================= */
  {
    id: "score_80",
    name: "Strong Performer",
    icon: "🎯",
    type: "silver",
    description: "Score 80% or more in a quiz",
    unlocked: false,
  },
  {
    id: "score_85",
    name: "Sharp Mind",
    icon: "🧠",
    type: "silver",
    description: "Score 85% or more in a quiz",
    unlocked: false,
  },
  {
    id: "perfect_1",
    name: "Perfect Shot",
    icon: "💯",
    type: "silver",
    description: "Score 100% in a quiz",
    unlocked: false,
  },
  {
    id: "perfect_3",
    name: "Precision Pro",
    icon: "🎖️",
    type: "gold",
    description: "Score 100% in 3 quizzes",
    unlocked: false,
  },
  {
    id: "perfect_5",
    name: "Flawless Genius",
    icon: "👑",
    type: "gold",
    description: "Score 100% in 5 quizzes",
    unlocked: false,
  },
  {
    id: "high_avg",
    name: "High Accuracy",
    icon: "📊",
    type: "gold",
    description: "Maintain 85%+ average score",
    unlocked: false,
  },

  /* ================= SUBJECT MASTERY (8) ================= */
  {
    id: "math_300",
    name: "Math Explorer",
    icon: "📐",
    type: "silver",
    description: "Earn 300 XP in Mathematics",
    unlocked: false,
  },
  {
    id: "math_600",
    name: "Mathematics Master",
    icon: "🧮",
    type: "gold",
    description: "Earn 600 XP in Mathematics",
    unlocked: false,
  },
  {
    id: "science_300",
    name: "Science Explorer",
    icon: "🔬",
    type: "silver",
    description: "Earn 300 XP in Science",
    unlocked: false,
  },
  {
    id: "science_600",
    name: "Science Master",
    icon: "⚗️",
    type: "gold",
    description: "Earn 600 XP in Science",
    unlocked: false,
  },
  {
    id: "english_80_5",
    name: "English Achiever",
    icon: "📖",
    type: "silver",
    description: "Score 80%+ in 5 English quizzes",
    unlocked: false,
  },
  {
    id: "english_80_10",
    name: "English Expert",
    icon: "✍️",
    type: "gold",
    description: "Score 80%+ in 10 English quizzes",
    unlocked: false,
  },
  {
    id: "evs_200",
    name: "EVS Protector",
    icon: "🌱",
    type: "silver",
    description: "Earn 200 XP in EVS",
    unlocked: false,
  },
  {
    id: "evs_400",
    name: "EVS Guardian",
    icon: "🌍",
    type: "gold",
    description: "Earn 400 XP in EVS",
    unlocked: false,
  },

  /* ================= LONG TERM (2) ================= */
  {
    id: "streak_7",
    name: "Learning Streak",
    icon: "🔥",
    type: "silver",
    description: "Maintain a 7-day learning streak",
    unlocked: false,
  },
  {
    id: "streak_14",
    name: "Unstoppable",
    icon: "🚀",
    type: "gold",
    description: "Maintain a 14-day learning streak",
    unlocked: false,
  },
];

/* =========================================================
   BADGE UNLOCK LOGIC
========================================================= */

export function unlockBadges(params: {
  xp: number;
  level: number;
  score: number;
  avgScore?: number;
  quizzesCompleted: number;
  perfectScores?: number;
  subjectXp?: {
    mathematics?: number;
    science?: number;
    english?: number;
    evs?: number;
  };
  subjectHighScores?: {
    english80Plus?: number;
  };
  currentBadges: Badge[];
}): Badge[] {
  return ALL_BADGES.map((badge) => {
    const existing = params.currentBadges.find(
      (b) => b.id === badge.id && b.unlocked
    );
    if (existing) return existing;

    let unlock = false;

    switch (badge.id) {
      case "quiz_3":
        unlock = params.quizzesCompleted >= 3;
        break;
      case "quiz_7":
        unlock = params.quizzesCompleted >= 7;
        break;
      case "quiz_10":
        unlock = params.quizzesCompleted >= 10;
        break;
      case "quiz_15":
        unlock = params.quizzesCompleted >= 15;
        break;
      case "quiz_25":
        unlock = params.quizzesCompleted >= 25;
        break;

      case "xp_150":
        unlock = params.xp >= 150;
        break;
      case "xp_300":
        unlock = params.xp >= 300;
        break;
      case "xp_500":
        unlock = params.xp >= 500;
        break;
      case "xp_1000":
        unlock = params.xp >= 1000;
        break;
      case "xp_2000":
        unlock = params.xp >= 2000;
        break;

      case "level_2":
        unlock = params.level >= 2;
        break;
      case "level_3":
        unlock = params.level >= 3;
        break;
      case "level_5":
        unlock = params.level >= 5;
        break;
      case "level_7":
        unlock = params.level >= 7;
        break;

      case "score_80":
        unlock = params.score >= 80;
        break;
      case "score_85":
        unlock = params.score >= 85;
        break;

      case "perfect_1":
        unlock = (params.perfectScores ?? 0) >= 1;
        break;
      case "perfect_3":
        unlock = (params.perfectScores ?? 0) >= 3;
        break;
      case "perfect_5":
        unlock = (params.perfectScores ?? 0) >= 5;
        break;

      case "high_avg":
        unlock = (params.avgScore ?? 0) >= 85;
        break;

      case "math_300":
        unlock = (params.subjectXp?.mathematics ?? 0) >= 300;
        break;
      case "math_600":
        unlock = (params.subjectXp?.mathematics ?? 0) >= 600;
        break;

      case "science_300":
        unlock = (params.subjectXp?.science ?? 0) >= 300;
        break;
      case "science_600":
        unlock = (params.subjectXp?.science ?? 0) >= 600;
        break;

      case "english_80_5":
        unlock = (params.subjectHighScores?.english80Plus ?? 0) >= 5;
        break;
      case "english_80_10":
        unlock = (params.subjectHighScores?.english80Plus ?? 0) >= 10;
        break;

      case "evs_200":
        unlock = (params.subjectXp?.evs ?? 0) >= 200;
        break;
      case "evs_400":
        unlock = (params.subjectXp?.evs ?? 0) >= 400;
        break;

      case "streak_7":
      case "streak_14":
        unlock = false; // hook streak logic later
        break;
    }

    return unlock
      ? { ...badge, unlocked: true, unlockedAt: new Date() }
      : badge;
  });
}
