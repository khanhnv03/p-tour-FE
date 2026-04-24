import apiClient from './client';
import type { PageResponse } from './tours';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
export type BlockType = 'PARAGRAPH' | 'HEADING' | 'QUOTE' | 'IMAGE' | 'GALLERY';

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  excerpt: string | null;
  authorName: string;
  status: BlogStatus;
  publishedAt: string | null;
}

export interface BlogPost extends BlogPostSummary {
  authorId: number;
  scheduledAt: string | null;
  blocks: BlogBlock[];
}

export interface BlogBlock {
  id?: number;
  blockType: BlockType;
  content?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  images?: BlogBlockImage[];
}

export interface BlogBlockImage {
  id?: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
}

export interface SaveBlogPostPayload {
  title: string;
  slug?: string;
  coverImageUrl?: string;
  excerpt?: string;
  status: BlogStatus;
  publishedAt?: string;
  scheduledAt?: string;
  blocks: BlogBlock[];
}

export async function listBlog(params: { keyword?: string; page?: number; size?: number } = {}): Promise<PageResponse<BlogPostSummary>> {
  const { data } = await apiClient.get('/blog', { params });
  return data.data;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost> {
  const { data } = await apiClient.get(`/blog/${slug}`);
  return data.data;
}

export async function listAdminBlog(params: {
  status?: BlogStatus;
  keyword?: string;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<BlogPostSummary>> {
  const { data } = await apiClient.get('/admin/blog', { params });
  return data.data;
}

export async function getAdminBlogPost(id: number): Promise<BlogPost> {
  const { data } = await apiClient.get(`/admin/blog/${id}`);
  return data.data;
}

export async function createBlogPost(payload: SaveBlogPostPayload): Promise<BlogPost> {
  const { data } = await apiClient.post('/admin/blog', payload);
  return data.data;
}

export async function updateBlogPost(id: number, payload: SaveBlogPostPayload): Promise<BlogPost> {
  const { data } = await apiClient.put(`/admin/blog/${id}`, payload);
  return data.data;
}

export async function deleteBlogPost(id: number): Promise<void> {
  await apiClient.delete(`/admin/blog/${id}`);
}
