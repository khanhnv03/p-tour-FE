import apiClient from './client';

export interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  country: string | null;
  region: string | null;
  featured: boolean;
  tourCount: number;
}

export interface SaveDestinationRequest {
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  country?: string | null;
  region?: string | null;
  featured: boolean;
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const { data } = await apiClient.get('/destinations/featured');
  return data.data;
}

export async function listDestinations(params: { keyword?: string; page?: number; size?: number } = {}): Promise<{ content: Destination[]; totalElements: number; totalPages: number }> {
  const { data } = await apiClient.get('/destinations', { params });
  return data.data;
}
