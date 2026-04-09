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

export interface StudentQuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct_answer: string | null;
  explanation: string | null;
}

export interface StudentQuizTemplate {
  id: string;
  title: string;
  description: string | null;
  question_count: number;
  active: boolean;
  partner_id: string | null;
  partner_name: string | null;
  questions: StudentQuizQuestion[] | null;
}

export interface StudentQuizPageMeta {
  number: number;
  size: number;
  total_elements: number;
  total_pages: number;
  first: boolean;
  last: boolean;
}

export interface StudentQuizPage<T> extends StudentQuizPageMeta {
  content: T[];
}

export interface StudentQuizAvailableParams {
  partnerId?: string | null;
  title?: string | null;
  page?: number;
  size?: number;
}

export interface StudentQuizPlacement {
  question_id: string;
  question_text: string;
  selected_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean;
}

export interface StudentQuizSubmitPayloadAnswer {
  question_id: string;
  selected_answer: string | null;
}

export interface StudentQuizSubmitPayload {
  quiz_template_id: string;
  duration: number;
  answers: StudentQuizSubmitPayloadAnswer[];
}

export interface StudentQuizSubmitResult {
  attempt_id: string;
  quiz_template_id: string;
  quiz_title: string;
  student_id: string;
  student_name: string | null;
  score: number;
  correct_amount: number;
  wrong_amount: number;
  total_questions: number;
  duration: number;
  attempt_number: number;
  completed: boolean;
  placements: StudentQuizPlacement[];
  created_at: string;
}
