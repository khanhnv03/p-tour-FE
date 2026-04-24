import apiClient from './client';

export type DiscountType = 'FIXED' | 'PERCENTAGE';
export type DisplayMode = 'COPY_CODE' | 'AUTO_APPLY';

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
}

export interface ApplyDealResult {
  dealId: number;
  discountAmount: number;
  finalAmount: number;
}

export async function getPublicDeals(): Promise<Deal[]> {
  const { data } = await apiClient.get('/deals/public');
  return data.data;
}

export async function applyPromoCode(promoCode: string, subtotal: number): Promise<ApplyDealResult> {
  const { data } = await apiClient.get('/deals/apply', { params: { promoCode, subtotal } });
  return data.data;
}

export async function findBestAutoApply(subtotal: number): Promise<ApplyDealResult | null> {
  const { data } = await apiClient.get('/deals/auto-apply', { params: { subtotal } });
  return data.data ?? null;
}
