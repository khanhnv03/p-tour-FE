import apiClient from './client';
import { unwrapApiResponse, type PageResponse } from './types';

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  coverImageUrl?: string;
  excerpt?: string;
  publishedAt: string;
  authorName: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

export async function getBlogPosts(params?: {
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<BlogPostSummary>> {
  const { data } = await apiClient.get('/blog/posts', { params });
  return unwrapApiResponse(data);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail> {
  const { data } = await apiClient.get(`/blog/posts/${slug}`);
  return unwrapApiResponse(data);
}
