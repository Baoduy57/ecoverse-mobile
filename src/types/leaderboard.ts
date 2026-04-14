export interface ILeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  points: number;
  level?: number;
  grade?: string;
  minDuration?: number;
  isCurrentUser?: boolean;
}

export interface ILeaderboard {
  id: string;
  type: LeaderboardType;
  scope: LeaderboardScope;
  scopeId?: string;
  entries: ILeaderboardEntry[];
  updatedAt: string;
}

export enum LeaderboardType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ALL_TIME = 'ALL_TIME',
}

export enum LeaderboardScope {
  GLOBAL = 'GLOBAL',
  SCHOOL = 'SCHOOL',
  CLASS = 'CLASS',
  FRIENDS = 'FRIENDS',
}

export type StudentLeaderboardScope = 'CLASS' | 'SCHOOL';

export interface IStudentLeaderboardEntry {
  student_id: string;
  student_name: string;
  grade?: string | null;
  points: number;
  min_duration?: number | null;
}
