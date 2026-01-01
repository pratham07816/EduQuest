import { Student, Badge, Subject, Quiz, LeaderboardEntry, Teacher } from '../types';

export const mockBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Math Whiz',
    description: 'Earn 200 XP in Mathematics',
    icon: '🧮',
    type: 'gold',
    unlocked: true,
    unlockedAt: new Date('2025-10-15'),
  },
  {
    id: 'b2',
    name: 'Science Explorer',
    description: 'Complete 10 Physics quizzes',
    icon: '🔬',
    type: 'silver',
    unlocked: true,
    unlockedAt: new Date('2025-10-20'),
  },
  {
    id: 'b3',
    name: 'Quick Thinker',
    description: 'Answer 5 questions in under 10 seconds',
    icon: '⚡',
    type: 'bronze',
    unlocked: true,
    unlockedAt: new Date('2025-10-25'),
  },
  {
    id: 'b4',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💯',
    type: 'gold',
    unlocked: false,
  },
  {
    id: 'b5',
    name: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    type: 'silver',
    unlocked: false,
  },
  {
    id: 'b6',
    name: 'Chemistry Champion',
    description: 'Earn 150 XP in Chemistry',
    icon: '⚗️',
    type: 'bronze',
    unlocked: false,
  },
];

export const mockSubjects: Subject[] = [
  {
    id: 's1',
    name: 'Mathematics',
    icon: '📐',
    color: 'bg-blue-500',
    chapters: [
      {
        id: 'c1',
        name: 'Algebra Basics',
        content: 'Learn the fundamentals of algebra including variables, expressions, and equations.',
        quizId: 'q1',
      },
      {
        id: 'c2',
        name: 'Geometry',
        content: 'Understanding shapes, angles, and spatial relationships.',
        quizId: 'q2',
      },
    ],
  },
  {
    id: 's2',
    name: 'Physics',
    icon: '⚛️',
    color: 'bg-purple-500',
    chapters: [
      {
        id: 'c3',
        name: 'Motion & Forces',
        content: "Newton's laws and principles of motion.",
        quizId: 'q3',
      },
      {
        id: 'c4',
        name: 'Energy',
        content: 'Kinetic, potential, and conservation of energy.',
        quizId: 'q4',
      },
    ],
  },
  {
    id: 's3',
    name: 'Chemistry',
    icon: '🧪',
    color: 'bg-green-500',
    chapters: [
      {
        id: 'c5',
        name: 'Atomic Structure',
        content: 'Understanding atoms, electrons, protons, and neutrons.',
        quizId: 'q5',
      },
    ],
  },
  {
    id: 's4',
    name: 'Biology',
    icon: '🧬',
    color: 'bg-orange-500',
    chapters: [
      {
        id: 'c6',
        name: 'Cell Biology',
        content: 'The basic unit of life and its components.',
        quizId: 'q6',
      },
    ],
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    subjectId: 's1',
    chapterId: 'c1',
    difficulty: 'easy',
    timePerQuestion: 30,
    questions: [
      {
        id: 'q1-1',
        text: 'What is 5 + 7?',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2,
        xpReward: 10,
      },
      {
        id: 'q1-2',
        text: 'Solve for x: 2x + 4 = 10',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
        xpReward: 15,
      },
      {
        id: 'q1-3',
        text: 'What is the value of x² when x = 3?',
        options: ['6', '9', '12', '15'],
        correctAnswer: 1,
        xpReward: 10,
      },
      {
        id: 'q1-4',
        text: 'If y = 2x + 1, what is y when x = 4?',
        options: ['7', '8', '9', '10'],
        correctAnswer: 2,
        xpReward: 15,
      },
      {
        id: 'q1-5',
        text: 'What is 15 - 8?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        xpReward: 10,
      },
    ],
  },
  {
    id: 'q3',
    subjectId: 's2',
    chapterId: 'c3',
    difficulty: 'medium',
    timePerQuestion: 30,
    questions: [
      {
        id: 'q3-1',
        text: "What is Newton's First Law of Motion?",
        options: [
          'F = ma',
          'An object in motion stays in motion',
          'Every action has a reaction',
          'Energy cannot be created',
        ],
        correctAnswer: 1,
        xpReward: 15,
      },
      {
        id: 'q3-2',
        text: 'What is the SI unit of force?',
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 1,
        xpReward: 10,
      },
      {
        id: 'q3-3',
        text: 'If mass = 5kg and acceleration = 2m/s², what is the force?',
        options: ['7 N', '10 N', '3 N', '2.5 N'],
        correctAnswer: 1,
        xpReward: 20,
      },
    ],
  },
];

export const mockCurrentStudent: Student = {
  id: 'st1',
  name: 'Pratham Kumar',
  email: 'pratham@eduquest.com',
  class: '8th Grade',
  xp: 1250,
  level: 3,
  badges: mockBadges.filter(b => b.unlocked),
  streak: 5,
  favoriteSubjects: ['Mathematics', 'Physics'],
  attendance: 92,
  performance: 85,
};

export const mockStudents: Student[] = [
  mockCurrentStudent,
  {
    id: 'st2',
    name: 'Ananya Sharma',
    email: 'ananya@eduquest.com',
    class: '8th Grade',
    xp: 1580,
    level: 4,
    badges: [],
    streak: 7,
    favoriteSubjects: ['Chemistry', 'Biology'],
    attendance: 95,
    performance: 92,
  },
  {
    id: 'st3',
    name: 'Rohan Patel',
    email: 'rohan@eduquest.com',
    class: '8th Grade',
    xp: 980,
    level: 2,
    badges: [],
    streak: 3,
    favoriteSubjects: ['Mathematics'],
    attendance: 88,
    performance: 78,
  },
  {
    id: 'st4',
    name: 'Priya Singh',
    email: 'priya@eduquest.com',
    class: '8th Grade',
    xp: 1420,
    level: 3,
    badges: [],
    streak: 6,
    favoriteSubjects: ['Physics', 'Chemistry'],
    attendance: 94,
    performance: 88,
  },
  {
    id: 'st5',
    name: 'Arjun Verma',
    email: 'arjun@eduquest.com',
    class: '8th Grade',
    xp: 750,
    level: 2,
    badges: [],
    streak: 2,
    favoriteSubjects: ['Biology'],
    attendance: 82,
    performance: 72,
  },
];

export const mockLeaderboard: LeaderboardEntry[] = mockStudents
  .map((student, index) => ({
    rank: index + 1,
    studentId: student.id,
    name: student.name,
    xp: student.xp,
    level: student.level,
    badges: student.badges.length,
  }))
  .sort((a, b) => b.xp - a.xp)
  .map((entry, index) => ({ ...entry, rank: index + 1 }));

export const mockTeacher: Teacher = {
  id: 't1',
  name: 'Mrs. Kavita Deshmukh',
  email: 'kavita@eduquest.com',
  school: 'Gandhi Rural High School',
  specialization: 'Physics & Mathematics',
};

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
];
