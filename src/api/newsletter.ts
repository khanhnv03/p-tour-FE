import apiClient from './client';

export async function subscribeNewsletter(email: string): Promise<void> {
  await apiClient.post('/newsletter/subscriptions', { email });
}
