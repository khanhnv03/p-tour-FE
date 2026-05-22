import apiClient from './client';
import { unwrapApiResponse } from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/login', payload);
  return unwrapApiResponse(data);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/register', payload);
  return unwrapApiResponse(data);
}

export async function getMe(): Promise<UserInfo> {
  const { data } = await apiClient.get('/auth/me');
  return unwrapApiResponse(data);
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiClient.post('/auth/reset-password', { token, newPassword });
}
