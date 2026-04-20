// ─── Competition Types ──────────────────────────────────────────────────────

export type CompetitionStatus = 'DRAFT' | 'ACTIVE' | 'FINISHED' | 'CANCELED';
export type CompetitionScope = 'SCHOOL' | 'CLASS';
export type CompetitionType = 'QUIZ' | 'GAME';

/** Nested quiz template inside competition response */
export interface ICompetitionQuizTemplate {
  id: string;
  title: string;
  description: string | null;
  question_count: number;
  active: boolean;
  partner_id: string | null;
  partner_name: string | null;
  is_competition: boolean;
  questions: unknown[] | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Nested game round item inside competition response */
export interface ICompetitionGameRoundItem {
  order_index: number;
  waste_item_id: string | null;
}

/** Nested game round inside competition response */
export interface ICompetitionGameRound {
  id: string;
  title: string;
  description: string | null;
  shared: boolean;
  created_by: string;
  item_count: number;
  is_competition: boolean;
  active: boolean;
  partner_id: string | null;
  game_round_items: ICompetitionGameRoundItem[];
}

/** Main Competition object returned by GET /students/{student_id}/competitions */
export interface ICompetition {
  competition_id: string;
  title: string;
  description: string | null;
  /** Backend returns [year, month, day, hour, minute] */
  start_time: number[];
  /** Backend returns [year, month, day, hour, minute] */
  end_time: number[];
  status: CompetitionStatus;
  scope: CompetitionScope;
  target_class: string;
  score: number;
  game_round: ICompetitionGameRound | null;
  quiz_template: ICompetitionQuizTemplate | null;
}

/** Participant student info in competition leaderboard */
export interface ICompetitionParticipantStudent {
  student_id: string;
  full_name: string;
  avatar_url?: string | null;
  grade?: string | null;
  points?: number;
}

/** Participant entry in competition leaderboard */
export interface ICompetitionParticipant {
  competition_participant_id: string;
  student: ICompetitionParticipantStudent;
  total_score: number;
  joined_at: string;
}

/** Request body for registering a participant */
export interface IRegisterParticipantPayload {
  joinedAt: string; // Format YYYY-MM-DDTHH:mm:ss
  totalScore: number;
}

/** Response data from participant registration */
export interface IRegisterParticipantResponse {
  competition_participant_id: string;
  student: ICompetitionParticipantStudent;
  total_score: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parse backend datetime array [year, month, day, hour, minute] to a JS Date.
 * Month in the array is 1-indexed (January = 1).
 */
export function parseCompetitionDateTime(arr: number[]): Date {
  if (!Array.isArray(arr) || arr.length < 5) {
    return new Date();
  }
  // arr = [year, month, day, hour, minute]
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
}

/**
 * Determine the type of competition by checking which nested object is non-null.
 */
export function getCompetitionType(competition: ICompetition): CompetitionType {
  return competition.quiz_template ? 'QUIZ' : 'GAME';
}

/**
 * Extract the relevant activity ID (quiz_template.id or game_round.id) from a competition.
 */
export function getCompetitionActivityId(competition: ICompetition): string {
  if (competition.quiz_template) {
    return competition.quiz_template.id;
  }
  if (competition.game_round) {
    return competition.game_round.id;
  }
  return '';
}
