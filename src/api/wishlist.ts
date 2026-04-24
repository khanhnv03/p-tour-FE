import apiClient from './client';
import type { TourSummary } from './tours';

export interface WishlistItem {
  wishlistId: number;
  tour: TourSummary;
  savedAt: string;
}

export async function getMyWishlist(page = 0, size = 12): Promise<{ content: WishlistItem[]; totalElements: number; totalPages: number }> {
  const { data } = await apiClient.get('/wishlist', { params: { page, size } });
  return data.data;
}

export async function checkWishlist(tourId: number): Promise<boolean> {
  const { data } = await apiClient.get(`/wishlist/check/${tourId}`);
  return data.data;
}

export async function addToWishlist(tourId: number): Promise<WishlistItem> {
  const { data } = await apiClient.post(`/wishlist/${tourId}`);
  return data.data;
}

export async function removeFromWishlist(tourId: number): Promise<void> {
  await apiClient.delete(`/wishlist/${tourId}`);
}
