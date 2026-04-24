import apiClient from './client';
import type { PageResponse } from './tours';

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
  departureDate: string;
  guestCount: number;
  contactName: string;
  contactEmail: string;
  downloadUrl: string;
  qrCodeData: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await apiClient.post('/bookings', payload);
  return data.data;
}

export async function getMyBookings(params: { page?: number; size?: number } = {}): Promise<PageResponse<Booking>> {
  const { data } = await apiClient.get('/bookings/my', { params });
  return data.data;
}

export async function getBooking(id: number): Promise<Booking> {
  const { data } = await apiClient.get(`/bookings/${id}`);
  return data.data;
}

export async function cancelBooking(id: number): Promise<Booking> {
  const { data } = await apiClient.patch(`/bookings/${id}/cancel`);
  return data.data;
}

export async function getTicket(id: number): Promise<Ticket> {
  const { data } = await apiClient.get(`/bookings/${id}/ticket`);
  return data.data;
}
