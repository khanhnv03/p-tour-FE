import apiClient from './client';
import { unwrapApiResponse, type PageResponse } from './types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: number;
  bookingCode: string;
  userId: number;
  userName: string;
  tourId: number;
  tourTitle: string;
  tourCoverImage: string | null;
  departureId: number;
  departureDate: string;
  dealId: number | null;
  guestCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateBookingPayload {
  tourId: number;
  departureId: number;
  dealId?: number;
  guestCount: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  promoCode?: string;
  notes?: string;
}

export interface Ticket {
  bookingCode: string;
  tourTitle: string;
  tourCoverImage: string | null;
  destinationName: string;
  departureDate: string;
  durationDays: number;
  durationNights: number;
  guestCount: number;
  totalAmount: number;
  status: BookingStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  downloadUrl: string;
  qrCodeData: string;
  issuedAt: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await apiClient.post('/bookings', payload);
  return unwrapApiResponse(data);
}

export async function getMyBookings(params: { page?: number; size?: number } = {}): Promise<PageResponse<Booking>> {
  const { data } = await apiClient.get('/bookings/my', { params });
  return unwrapApiResponse(data);
}

export async function getBooking(id: number): Promise<Booking> {
  const { data } = await apiClient.get(`/bookings/${id}`);
  return unwrapApiResponse(data);
}

export async function cancelBooking(id: number): Promise<Booking> {
  const { data } = await apiClient.patch(`/bookings/${id}/cancel`);
  return unwrapApiResponse(data);
}

export async function getTicket(id: number): Promise<Ticket> {
  const { data } = await apiClient.get(`/bookings/${id}/ticket`);
  return unwrapApiResponse(data);
}
