// User types
export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  xp: number;
  level: number;
  badges: Badge[];
  streak: number;
  favoriteSubjects: string[];
  profilePicture?: string;
  attendance: number;
  performance: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  specialization: string;
  profilePicture?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'gold' | 'silver' | 'bronze';
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export interface Chapter {
  name: string;

  description: {
    en: string;
    hi: string;
    mr: string;
  };

  keyConcepts: {
    en: string;
    hi: string;
    mr: string;
  };

  videoUrl: string;
  pdfUrl: string;
}


export interface Quiz {
  id: string;
  subjectId: string;
  chapterId: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  timePerQuestion: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  xp: number;
  level: number;
  badges: number;
}

export type UserRole = 'student' | 'teacher';
export type Language = 'en' | 'hi' | 'mr';
