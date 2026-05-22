import apiClient from './client';
import axios from 'axios';
import { unwrapApiResponse, type PageResponse } from './types';

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

export interface OrderSummary {
  totalRevenue: number;
  pendingAmount: number;
  averageOrderValue: number;
  refundedAmount: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
}

export interface CreateOrderPayload {
  bookingId: number;
  paymentMethod: PaymentMethod;
  cardLastFour?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post('/orders', payload);
  return unwrapApiResponse(data);
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await apiClient.get(`/orders/${id}`);
  return unwrapApiResponse(data);
}

export async function getOrderByBooking(bookingId: number): Promise<Order> {
  const { data } = await apiClient.get(`/orders/booking/${bookingId}`);
  return unwrapApiResponse(data);
}

export async function findOrderByBooking(bookingId: number): Promise<Order | null> {
  try {
    return await getOrderByBooking(bookingId);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function mockPay(orderId: number, idempotencyKey = crypto.randomUUID()): Promise<Order> {
  const { data } = await apiClient.post(`/orders/${orderId}/mock-pay`, null, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });
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

export async function getAdminOrderSummary(): Promise<OrderSummary> {
  const { data } = await apiClient.get('/admin/orders/summary');
  return unwrapApiResponse(data);
}

export async function getAdminOrder(id: number): Promise<Order> {
  const { data } = await apiClient.get(`/admin/orders/${id}`);
  return unwrapApiResponse(data);
}

export async function exportAdminOrders(params: {
  userId?: number;
  status?: PaymentStatus;
} = {}): Promise<Blob> {
  const { data } = await apiClient.get('/admin/orders/export', { params, responseType: 'blob' });
  return data;
}

export async function refundOrder(id: number): Promise<Order> {
  const { data } = await apiClient.post(`/admin/orders/${id}/refund`);
  return unwrapApiResponse(data);
}
