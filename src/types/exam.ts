export enum ExamStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export interface ScheduledExam {
  id: string;
  title: string;
  description: string;
  subject: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  questionCount: number;
  duration: number; // minutes
  status: ExamStatus;
  createdBy: string; // school / teacher name
  totalPoints: number;
}
