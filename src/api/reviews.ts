import apiClient from './client';
import { unwrapApiResponse } from './types';

export interface Review {
  id: number;
  userId: number;
  tourId: number;
  bookingId: number;
  rating: number;
  comment?: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'HIDDEN';
  userFullName: string;
  userAvatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitReviewPayload {
  bookingId: number;
  rating: number;
  comment?: string;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<Review> {
  const { data } = await apiClient.post('/reviews', payload);
  return unwrapApiResponse(data);
}

export async function getReviewByBooking(bookingId: number): Promise<Review | null> {
  const { data } = await apiClient.get(`/reviews/booking/${bookingId}`);
  return unwrapApiResponse(data) ?? null;
}
