import apiClient from './client';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  address: string | null;
  role: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get('/users/me');
  return data.data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
  const { data } = await apiClient.put('/users/me', payload);
  return data.data;
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
  return data.data;
}

export async function updateNotificationPreferences(prefs: NotificationPreferences): Promise<NotificationPreferences> {
  const { data } = await apiClient.put('/users/me/notification-preferences', prefs);
  return data.data;
}
