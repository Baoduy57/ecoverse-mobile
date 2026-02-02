// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common Types
export interface IOption {
  label: string;
  value: string;
}

// Error Types
export interface IApiError {
  code: string;
  message: string;
  details?: any;
}

// Types index - Export all types
export * from './user';
export * from './game';
export * from './reward';
export * from './student';

// Re-export enums and types từ constants
export { GameType, Difficulty, WasteType } from '../constants/game';
