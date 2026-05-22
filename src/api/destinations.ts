import apiClient from './client';
import type { PageResponse } from './types';
import { unwrapApiResponse } from './types';

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
  return unwrapApiResponse(data);
}

export async function listDestinations(params: { keyword?: string; page?: number; size?: number } = {}): Promise<PageResponse<Destination>> {
  const { data } = await apiClient.get('/destinations', { params });
  return unwrapApiResponse(data);
}
