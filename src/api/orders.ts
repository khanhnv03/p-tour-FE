import apiClient from './client';
import type { PageResponse } from './tours';

export type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: number;
  orderCode: string;
  bookingId: number;
  bookingCode: string;
  userId: number;
  userName: string;
  tourTitle: string;
  tourCoverImage: string | null;
  departureDate: string;
  guestCount: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef: string | null;
  cardLastFour: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
}

export interface CreateOrderPayload {
  bookingId: number;
  paymentMethod: PaymentMethod;
  cardLastFour?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post('/orders', payload);
  return data.data;
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data.data;
}

export async function getOrderByBooking(bookingId: number): Promise<Order> {
  const { data } = await apiClient.get(`/orders/booking/${bookingId}`);
  return data.data;
}

export async function mockPay(orderId: number, idempotencyKey = crypto.randomUUID()): Promise<Order> {
  const { data } = await apiClient.post(`/orders/${orderId}/mock-pay`, null, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });
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

export async function getAdminOrder(id: number): Promise<Order> {
  const { data } = await apiClient.get(`/admin/orders/${id}`);
  return data.data;
}

export async function refundOrder(id: number): Promise<Order> {
  const { data } = await apiClient.post(`/admin/orders/${id}/refund`);
  return data.data;
}
