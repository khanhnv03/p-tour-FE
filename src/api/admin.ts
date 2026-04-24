import apiClient from './client';
import type { Booking, BookingStatus } from './bookings';
import type { Deal } from './deals';
import type { Destination } from './destinations';
import type { Order, PaymentStatus } from './orders';
import type { PageResponse, TourDetail, TourSummary, TourStatus } from './tours';
import type { UserProfile } from './users';

export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface DashboardSummary {
  revenue: number;
  customerCount: number;
  activeTours: number;
  avgRating: number;
  revenueGrowthPercent: number;
  customerGrowthPercent: number;
  pendingContacts: number;
  newsletterSubscribers: number;
}

export interface TopTour {
  tourId: number;
  title: string;
  coverImageUrl: string | null;
  bookingCount: number;
  revenue: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  assigneeName: string | null;
  internalNote: string | null;
  createdAt: string;
}

export interface MediaAsset {
  id: number;
  url: string;
  alt: string | null;
  contentType: string;
  size: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get('/admin/dashboard/summary');
  return data.data;
}

export async function getRecentBookings(params: { page?: number; size?: number } = {}): Promise<PageResponse<Booking>> {
  const { data } = await apiClient.get('/admin/dashboard/recent-bookings', { params });
  return data.data;
}

export async function getTopTours(limit = 5): Promise<TopTour[]> {
  const { data } = await apiClient.get('/admin/dashboard/top-tours', { params: { limit } });
  return data.data;
}

export async function getRevenueAnalytics(params: { from?: string; to?: string } = {}): Promise<TimeSeriesPoint[]> {
  const { data } = await apiClient.get('/admin/analytics/revenue', { params });
  return data.data;
}

export async function listAdminTours(params: {
  keyword?: string;
  destinationId?: number;
  status?: TourStatus;
  departureDate?: string;
  availableSlots?: number;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<TourSummary>> {
  const { data } = await apiClient.get('/admin/tours', { params });
  return data.data;
}

export async function getAdminTour(id: number): Promise<TourDetail> {
  const { data } = await apiClient.get(`/admin/tours/${id}`);
  return data.data;
}

export async function listAdminBookings(params: {
  userId?: number;
  status?: BookingStatus;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<Booking>> {
  const { data } = await apiClient.get('/admin/bookings', { params });
  return data.data;
}

export async function updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
  const { data } = await apiClient.patch(`/admin/bookings/${id}/status`, null, { params: { status } });
  return data.data;
}

export async function listAdminOrders(params: {
  userId?: number;
  status?: PaymentStatus;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<Order>> {
  const { data } = await apiClient.get('/admin/orders', { params });
  return data.data;
}

export async function listAdminUsers(params: { keyword?: string; page?: number; size?: number } = {}): Promise<PageResponse<UserProfile>> {
  const { data } = await apiClient.get('/admin/users', { params });
  return data.data;
}

export async function listAdminDeals(params: { keyword?: string; status?: string; dateState?: string; page?: number; size?: number } = {}): Promise<PageResponse<Deal>> {
  const { data } = await apiClient.get('/admin/deals', { params });
  return data.data;
}

export async function listAdminDestinations(params: { keyword?: string; page?: number; size?: number } = {}): Promise<PageResponse<Destination>> {
  const { data } = await apiClient.get('/admin/destinations', { params });
  return data.data;
}

export async function listContacts(params: { status?: ContactStatus; page?: number; size?: number } = {}): Promise<PageResponse<ContactMessage>> {
  const { data } = await apiClient.get('/admin/contacts', { params });
  return data.data;
}

export async function updateContactStatus(id: number, payload: {
  status: ContactStatus;
  assigneeId?: number;
  internalNote?: string;
}): Promise<ContactMessage> {
  const { data } = await apiClient.patch(`/admin/contacts/${id}/status`, payload);
  return data.data;
}

export async function uploadMedia(file: File, alt?: string): Promise<MediaAsset> {
  const form = new FormData();
  form.append('file', file);
  if (alt) form.append('alt', alt);
  const { data } = await apiClient.post('/admin/media', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}
