import apiClient from './client';
import { unwrapApiResponse } from './types';

export type UserRole = 'CUSTOMER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  address: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get('/users/me');
  return unwrapApiResponse(data);
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
  const { data } = await apiClient.put('/users/me', payload);
  return unwrapApiResponse(data);
}

export interface NotificationPreferences {
  bookingAlerts: boolean;
  editorialComments: boolean;
  systemStatus: boolean;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.put('/users/me/password', { currentPassword, newPassword });
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const { data } = await apiClient.get('/users/me/notification-preferences');
  return unwrapApiResponse(data);
}

export async function updateNotificationPreferences(prefs: NotificationPreferences): Promise<NotificationPreferences> {
  const { data } = await apiClient.put('/users/me/notification-preferences', prefs);
  return unwrapApiResponse(data);
}
