import axios from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  code: string | null;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type ValidationErrors = Record<string, string>;

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  return response.data;
}

export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;
  return typeof message === 'string' && message.trim() ? message : fallback;
}

export function extractValidationErrors(error: unknown): ValidationErrors | null {
  if (!axios.isAxiosError<ApiResponse<ValidationErrors>>(error)) {
    return null;
  }

  const data = error.response?.data?.data;
  return data && typeof data === 'object' ? data : null;
}
