import apiClient from './client';
import type { Booking, BookingStatus } from './bookings';
import type { Deal } from './deals';
import type { Destination, SaveDestinationRequest } from './destinations';
import type { Order, PaymentStatus } from './orders';
import type { InclusionType, PageResponse, TourDetail, TourDifficulty, TourStatus, TourSummary } from './tours';
import type { UserProfile } from './users';

export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface DashboardSummary {
  revenue: number;
  customerCount: number;
  activeTours: number;
  averageRating: number;
  monthlyBookings: number;
  revenueGrowthPercent: number;
  customerGrowthPercent: number;
  pendingBookings: number;
  newContacts: number;
  newsletterSubscribers: number;
}

export interface TopTour {
  id: number;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  destinationName: string;
  bookingCount: number;
  rating: number;
  reviewCount: number;
  fillRatePercent: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface BookingAnalytics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  dailyBookings: TimeSeriesPoint[];
}

export interface ConversionAnalytics {
  totalBookings: number;
  paidOrders: number;
  pendingOrders: number;
  refundedOrders: number;
  paymentConversionRate: number;
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

export interface DestinationSummary {
  totalDestinations: number;
  featuredDestinations: number;
  destinationsWithTours: number;
  emptyDestinations: number;
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

export async function getBookingAnalytics(params: { from?: string; to?: string } = {}): Promise<BookingAnalytics> {
  const { data } = await apiClient.get('/admin/analytics/bookings', { params });
  return data.data;
}

export async function getConversionAnalytics(): Promise<ConversionAnalytics> {
  const { data } = await apiClient.get('/admin/analytics/conversion');
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

export interface SaveTourRequest {
  destinationId: number;
  title: string;
  description?: string | null;
  durationDays: number;
  durationNights: number;
  maxGuests: number;
  difficulty: TourDifficulty;
  pricePerPerson: number;
  coverImageUrl?: string | null;
  status: TourStatus;
  galleryImages?: { imageUrl: string; sortOrder: number }[];
  highlights?: { icon: string; label: string; sortOrder: number }[];
  inclusions?: { type: InclusionType; description: string; sortOrder: number }[];
  itineraryDays?: {
    dayNumber: number;
    title: string;
    summary?: string | null;
    coverImageUrl?: string | null;
    activities?: { activityTime: string; title?: string | null; description: string; sortOrder: number }[];
  }[];
}

export async function createAdminTour(payload: SaveTourRequest): Promise<TourDetail> {
  const { data } = await apiClient.post('/admin/tours', payload);
  return data.data;
}

export async function updateAdminTour(id: number, payload: SaveTourRequest): Promise<TourDetail> {
  const { data } = await apiClient.put(`/admin/tours/${id}`, payload);
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

export async function listAdminDestinations(params: {
  keyword?: string;
  featured?: boolean;
  country?: string;
  region?: string;
  sort?: string;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<Destination>> {
  const { data } = await apiClient.get('/admin/destinations', { params });
  return data.data;
}

export async function getAdminDestinationSummary(): Promise<DestinationSummary> {
  const { data } = await apiClient.get('/admin/destinations/summary');
  return data.data;
}

export async function getAdminDestination(id: number): Promise<Destination> {
  const { data } = await apiClient.get(`/admin/destinations/${id}`);
  return data.data;
}

export async function createAdminDestination(payload: SaveDestinationRequest): Promise<Destination> {
  const { data } = await apiClient.post('/admin/destinations', payload);
  return data.data;
}

export async function updateAdminDestination(id: number, payload: SaveDestinationRequest): Promise<Destination> {
  const { data } = await apiClient.put(`/admin/destinations/${id}`, payload);
  return data.data;
}

export async function deleteAdminDestination(id: number): Promise<void> {
  await apiClient.delete(`/admin/destinations/${id}`);
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
