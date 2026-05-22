import apiClient from './client';
import type { PageResponse } from './types';
import { unwrapApiResponse } from './types';
export type { PageResponse } from './types';

export type TourDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type TourStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type InclusionType = 'INCLUDE' | 'EXCLUDE';
export type DepartureStatus = 'OPEN' | 'FULL' | 'CANCELLED';

export interface TourSummary {
  id: number;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  destinationName: string;
  durationDays: number;
  durationNights: number;
  difficulty: TourDifficulty;
  pricePerPerson: number;
  status: TourStatus;
  rating: number;
  reviewCount: number;
  bookingCount: number;
}

export interface TourDetail extends TourSummary {
  description: string;
  maxGuests: number;
  destination: { id: number; name: string; slug: string; country: string; coverImageUrl: string | null };
  galleryImages: { id: number; imageUrl: string; sortOrder: number }[];
  highlights: { id: number; icon: string; label: string; sortOrder: number }[];
  inclusions: { id: number; type: InclusionType; description: string; sortOrder: number }[];
  itineraryDays: {
    id: number;
    dayNumber: number;
    title: string;
    summary: string;
    coverImageUrl: string | null;
    activities: { id: number; activityTime: string; title: string | null; description: string; sortOrder: number }[];
  }[];
  departures: {
    id: number;
    departureDate: string;
    availableSlots: number;
    bookedSlots: number;
    priceOverride: number | null;
    status: DepartureStatus;
  }[];
}

export interface SearchParams {
  keyword?: string;
  destinationId?: number;
  date?: string;
  guests?: number;
  difficulty?: TourDifficulty;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export async function searchTours(params: SearchParams = {}): Promise<PageResponse<TourSummary>> {
  const { data } = await apiClient.get('/tours', { params });
  return unwrapApiResponse(data);
}

export async function getTourById(id: number): Promise<TourDetail> {
  const { data } = await apiClient.get(`/tours/${id}`);
  return unwrapApiResponse(data);
}

export async function getTourBySlug(slug: string): Promise<TourDetail> {
  const { data } = await apiClient.get(`/tours/slug/${slug}`);
  return unwrapApiResponse(data);
}

export async function getFeaturedTours(limit = 6): Promise<TourSummary[]> {
  const { data } = await apiClient.get('/tours/featured', { params: { limit } });
  return unwrapApiResponse(data);
}

export async function getPopularTours(limit = 6): Promise<TourSummary[]> {
  const { data } = await apiClient.get('/tours/popular', { params: { limit } });
  return unwrapApiResponse(data);
}
