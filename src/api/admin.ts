import apiClient from './client';
import type { Booking, BookingStatus } from './bookings';
import type { Deal, DealStatus, DiscountType, DisplayMode } from './deals';
import type { Destination, SaveDestinationRequest } from './destinations';
import type { Order, PaymentStatus } from './orders';
import type { InclusionType, TourDetail, TourDifficulty, TourStatus, TourSummary } from './tours';
import { unwrapApiResponse, type PageResponse } from './types';
import type { UpdateProfileRequest, UserProfile, UserRole, UserStatus } from './users';

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
  return unwrapApiResponse(data);
}

export async function getRecentBookings(params: { page?: number; size?: number } = {}): Promise<PageResponse<Booking>> {
  const { data } = await apiClient.get('/admin/dashboard/recent-bookings', { params });
  return unwrapApiResponse(data);
}

export async function getTopTours(limit = 5): Promise<TopTour[]> {
  const { data } = await apiClient.get('/admin/dashboard/top-tours', { params: { limit } });
  return unwrapApiResponse(data);
}

export async function getRevenueAnalytics(params: { from?: string; to?: string } = {}): Promise<TimeSeriesPoint[]> {
  const { data } = await apiClient.get('/admin/analytics/revenue', { params });
  return unwrapApiResponse(data);
}

export async function getBookingAnalytics(params: { from?: string; to?: string } = {}): Promise<BookingAnalytics> {
  const { data } = await apiClient.get('/admin/analytics/bookings', { params });
  return unwrapApiResponse(data);
}

export async function getConversionAnalytics(params: { from?: string; to?: string } = {}): Promise<ConversionAnalytics> {
  const { data } = await apiClient.get('/admin/analytics/conversion', { params });
  return unwrapApiResponse(data);
}

export async function exportAnalytics(params: { from?: string; to?: string } = {}): Promise<Blob> {
  const { data } = await apiClient.get('/admin/analytics/export', { params, responseType: 'blob' });
  return data;
}

export async function listAdminTours(params: {
  keyword?: string;
  destinationId?: number;
  status?: TourStatus;
  departureDate?: string;
  availableSlots?: number;
  sort?: string;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<TourSummary>> {
  const { data } = await apiClient.get('/admin/tours', { params });
  return unwrapApiResponse(data);
}

export async function getAdminTour(id: number): Promise<TourDetail> {
  const { data } = await apiClient.get(`/admin/tours/${id}`);
  return unwrapApiResponse(data);
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
  return unwrapApiResponse(data);
}

export async function updateAdminTour(id: number, payload: SaveTourRequest): Promise<TourDetail> {
  const { data } = await apiClient.put(`/admin/tours/${id}`, payload);
  return unwrapApiResponse(data);
}

export async function deleteAdminTour(id: number): Promise<void> {
  await apiClient.delete(`/admin/tours/${id}`);
}

export async function listAdminBookings(params: {
  userId?: number;
  status?: BookingStatus;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<Booking>> {
  const { data } = await apiClient.get('/admin/bookings', { params });
  return unwrapApiResponse(data);
}

export async function updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
  const { data } = await apiClient.patch(`/admin/bookings/${id}/status`, null, { params: { status } });
  return unwrapApiResponse(data);
}

export async function listAdminOrders(params: {
  userId?: number;
  status?: PaymentStatus;
  page?: number;
  size?: number;
  sort?: string;
} = {}): Promise<PageResponse<Order>> {
  const { data } = await apiClient.get('/admin/orders', { params });
  return unwrapApiResponse(data);
}

export async function exportAdminOrders(params: {
  userId?: number;
  status?: PaymentStatus;
} = {}): Promise<Blob> {
  const { data } = await apiClient.get('/admin/orders/export', { params, responseType: 'blob' });
  return data;
}

export interface AdminCustomerDetail {
  user: UserProfile;
  bookingCount: number;
  totalSpent: number | null;
  lastBookingAt: string | null;
  recentBookings: Booking[];
}

export async function listAdminUsers(params: {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  size?: number;
  sort?: string;
} = {}): Promise<PageResponse<UserProfile>> {
  const { data } = await apiClient.get('/admin/users', { params });
  return unwrapApiResponse(data);
}

export async function getAdminUser(id: number): Promise<UserProfile> {
  const { data } = await apiClient.get(`/admin/users/${id}`);
  return unwrapApiResponse(data);
}

export async function getAdminCustomerDetail(id: number): Promise<AdminCustomerDetail> {
  const { data } = await apiClient.get(`/admin/users/${id}/detail`);
  return unwrapApiResponse(data);
}

export async function updateAdminUser(id: number, payload: UpdateProfileRequest): Promise<UserProfile> {
  const { data } = await apiClient.put(`/admin/users/${id}`, payload);
  return unwrapApiResponse(data);
}

export async function updateAdminUserStatus(id: number, status: UserStatus): Promise<UserProfile> {
  const { data } = await apiClient.patch(`/admin/users/${id}/status`, null, { params: { status } });
  return unwrapApiResponse(data);
}

export async function exportAdminUsers(params: {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
} = {}): Promise<Blob> {
  const { data } = await apiClient.get('/admin/users/export', { params, responseType: 'blob' });
  return data;
}

export async function listAdminDeals(params: { keyword?: string; status?: string; dateState?: string; page?: number; size?: number } = {}): Promise<PageResponse<Deal>> {
  const { data } = await apiClient.get('/admin/deals', { params });
  return unwrapApiResponse(data);
}

export async function getAdminDeal(id: number): Promise<Deal> {
  const { data } = await apiClient.get(`/admin/deals/${id}`);
  return unwrapApiResponse(data);
}

export interface SaveDealRequest {
  title: string;
  description?: string | null;
  campaignImageUrl?: string | null;
  badgeText?: string | null;
  category?: string | null;
  discountType: DiscountType;
  discountValue: number;
  promoCode?: string | null;
  displayMode: DisplayMode;
  minOrderValue?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  validFrom?: string | null;
  validTo?: string | null;
  status: DealStatus;
}

export async function createAdminDeal(payload: SaveDealRequest): Promise<Deal> {
  const { data } = await apiClient.post('/admin/deals', payload);
  return unwrapApiResponse(data);
}

export async function updateAdminDeal(id: number, payload: SaveDealRequest): Promise<Deal> {
  const { data } = await apiClient.put(`/admin/deals/${id}`, payload);
  return unwrapApiResponse(data);
}

export async function deleteAdminDeal(id: number): Promise<void> {
  await apiClient.delete(`/admin/deals/${id}`);
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
  return unwrapApiResponse(data);
}

export async function getAdminDestinationSummary(): Promise<DestinationSummary> {
  const { data } = await apiClient.get('/admin/destinations/summary');
  return unwrapApiResponse(data);
}

export async function getAdminDestination(id: number): Promise<Destination> {
  const { data } = await apiClient.get(`/admin/destinations/${id}`);
  return unwrapApiResponse(data);
}

export async function createAdminDestination(payload: SaveDestinationRequest): Promise<Destination> {
  const { data } = await apiClient.post('/admin/destinations', payload);
  return unwrapApiResponse(data);
}

export async function updateAdminDestination(id: number, payload: SaveDestinationRequest): Promise<Destination> {
  const { data } = await apiClient.put(`/admin/destinations/${id}`, payload);
  return unwrapApiResponse(data);
}

export async function deleteAdminDestination(id: number): Promise<void> {
  await apiClient.delete(`/admin/destinations/${id}`);
}

export async function listContacts(params: { keyword?: string; status?: ContactStatus; page?: number; size?: number } = {}): Promise<PageResponse<ContactMessage>> {
  const { data } = await apiClient.get('/admin/contacts', { params });
  return unwrapApiResponse(data);
}

export async function updateContactStatus(id: number, payload: {
  status: ContactStatus;
  assigneeId?: number;
  internalNote?: string;
}): Promise<ContactMessage> {
  const { data } = await apiClient.patch(`/admin/contacts/${id}/status`, payload);
  return unwrapApiResponse(data);
}

export type DepartureStatus = 'OPEN' | 'FULL' | 'CANCELLED';

export interface TourDeparture {
  id: number;
  departureDate: string;
  availableSlots: number;
  bookedSlots: number;
  priceOverride: number | null;
  status: DepartureStatus;
}

export interface SaveDepartureRequest {
  departureDate: string;
  availableSlots: number;
  priceOverride?: number | null;
  status: DepartureStatus;
}

export async function createAdminDeparture(tourId: number, payload: SaveDepartureRequest): Promise<TourDeparture> {
  const { data } = await apiClient.post(`/admin/tours/${tourId}/departures`, payload);
  return unwrapApiResponse(data);
}

export async function updateAdminDeparture(tourId: number, departureId: number, payload: SaveDepartureRequest): Promise<TourDeparture> {
  const { data } = await apiClient.put(`/admin/tours/${tourId}/departures/${departureId}`, payload);
  return unwrapApiResponse(data);
}

export async function deleteAdminDeparture(tourId: number, departureId: number): Promise<void> {
  await apiClient.delete(`/admin/tours/${tourId}/departures/${departureId}`);
}

// ── Blog Admin ────────────────────────────────────────────────────────────

export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
export type BlockType = 'PARAGRAPH' | 'HEADING' | 'QUOTE' | 'IMAGE' | 'GALLERY';

export interface BlockImage {
  id?: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
}

export interface Block {
  id?: number;
  blockType: BlockType;
  content?: string;
  imageUrl?: string;
  sortOrder: number;
  images?: BlockImage[];
}

export interface AdminBlogPost {
  id: number;
  slug: string;
  title: string;
  coverImageUrl?: string;
  excerpt?: string;
  publishedAt?: string;
  authorName?: string;
  status: BlogPostStatus;
}

export interface AdminBlogPostDetail extends AdminBlogPost {
  content?: string;
  scheduledAt?: string;
  blocks?: Block[];
}

export interface SaveBlogPostRequest {
  title: string;
  slug?: string;
  coverImageUrl?: string;
  excerpt?: string;
  status: BlogPostStatus;
  scheduledAt?: string;
  blocks: {
    blockType: BlockType;
    content?: string;
    imageUrl?: string;
    sortOrder: number;
    images?: { imageUrl: string; altText?: string; sortOrder: number }[];
  }[];
}

export async function listAdminBlogPosts(params: {
  keyword?: string;
  status?: BlogPostStatus;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<AdminBlogPost>> {
  const { data } = await apiClient.get('/admin/blog/posts', { params });
  return unwrapApiResponse(data);
}

export async function getAdminBlogPost(id: number): Promise<AdminBlogPostDetail> {
  const { data } = await apiClient.get(`/admin/blog/posts/${id}`);
  return unwrapApiResponse(data);
}

export async function createAdminBlogPost(payload: SaveBlogPostRequest): Promise<AdminBlogPostDetail> {
  const { data } = await apiClient.post('/admin/blog/posts', payload);
  return unwrapApiResponse(data);
}

export async function updateAdminBlogPost(id: number, payload: SaveBlogPostRequest): Promise<AdminBlogPostDetail> {
  const { data } = await apiClient.put(`/admin/blog/posts/${id}`, payload);
  return unwrapApiResponse(data);
}

export async function deleteAdminBlogPost(id: number): Promise<void> {
  await apiClient.delete(`/admin/blog/posts/${id}`);
}

export async function uploadMedia(file: File, alt?: string): Promise<MediaAsset> {
  const form = new FormData();
  form.append('file', file);
  if (alt) form.append('alt', alt);
  const { data } = await apiClient.post('/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiResponse(data);
}
