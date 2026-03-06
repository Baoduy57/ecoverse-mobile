export enum QuizDifficulty {
  STARTER = 'STARTER',
  AI_GENERATED = 'AI_GENERATED',
  MANUAL = 'MANUAL',
  HARD = 'HARD',
}

export enum QuizStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface QuizMission {
  id: string;
  title: string;
  difficulty: QuizDifficulty;
  icon: string;
  iconColor: string;
  bgColor: string;
  xpReward: number;
  questionsCount: number;
  status: QuizStatus;
  completedCount?: number;
  imageUrl?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  icon?: string;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  imageUrl?: string;
  options: QuizOption[];
  correctOptionId: string;
  points: number;
  explanation?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalPoints: number;
  answers: QuizAnswer[];
  completedAt: Date;
}

export interface QuizAnswerDetail {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}
