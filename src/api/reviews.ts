import apiClient from './client';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN';

export interface Review {
  id: number;
  tourId: number;
  userId: number;
  userFullName: string;
  userAvatarUrl: string | null;
  bookingId: number;
  rating: number;
  comment: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export async function getTourReviews(tourId: number, page = 0, size = 10): Promise<PageResponse<Review>> {
  const { data } = await apiClient.get(`/tours/${tourId}/reviews`, { params: { page, size } });
  return data.data;
}

export async function createReview(payload: { bookingId: number; rating: number; comment: string }): Promise<Review> {
  const { data } = await apiClient.post('/reviews', payload);
  return data.data;
}
