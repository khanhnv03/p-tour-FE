import apiClient from './client';
import { unwrapApiResponse } from './types';

export type DiscountType = 'FIXED' | 'PERCENTAGE';
export type DisplayMode = 'COPY_CODE' | 'AUTO_APPLY';
export type DealStatus = 'ACTIVE' | 'EXPIRED' | 'DRAFT';

export interface Deal {
  id: number;
  title: string;
  description: string | null;
  campaignImageUrl: string | null;
  badgeText: string | null;
  category: string | null;
  discountType: DiscountType;
  discountValue: number;
  promoCode: string | null;
  displayMode: DisplayMode;
  minOrderValue: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  validFrom: string | null;
  validTo: string | null;
  status: DealStatus;
}

export interface ApplyDealResult {
  dealId: number;
  promoCode: string | null;
  discountAmount: number;
  message: string;
}

export async function getPublicDeals(): Promise<Deal[]> {
  const { data } = await apiClient.get('/deals/public');
  return unwrapApiResponse(data);
}

export async function applyPromoCode(promoCode: string, subtotal: number): Promise<ApplyDealResult> {
  const { data } = await apiClient.get('/deals/apply', { params: { promoCode, subtotal } });
  return unwrapApiResponse(data);
}

export async function findBestAutoApply(subtotal: number): Promise<ApplyDealResult | null> {
  const { data } = await apiClient.get('/deals/auto-apply', { params: { subtotal } });
  return unwrapApiResponse(data) ?? null;
}
