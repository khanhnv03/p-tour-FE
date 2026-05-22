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

export const MOCK_BLOG_POSTS: BlogPostDetail[] = [
  {
    id: 1,
    slug: 'hanh-trinh-langbiang-mua-he',
    title: 'Hành trình Langbiang mùa hè',
    coverImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    excerpt: 'Bài viết public seed cho trang journal.',
    publishedAt: '2026-04-18T02:00:00Z',
    authorName: 'Content Admin',
    content: 'Đây là nội dung chi tiết của bài viết Hành trình Langbiang mùa hè. Một trải nghiệm khó quên trên đỉnh núi, đón bình minh rực rỡ và tận hưởng không khí trong lành của Đà Lạt.'
  },
  {
    id: 2,
    slug: 'cam-nang-du-thuyen-ha-long',
    title: 'Cẩm nang du thuyền Hạ Long',
    coverImageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2',
    excerpt: 'Bài viết draft seed cho admin blog editor.',
    publishedAt: '2026-04-10T10:00:00Z',
    authorName: 'Content Admin',
    content: 'Cẩm nang chi tiết cho chuyến đi du thuyền Hạ Long hoàn hảo. Từ cách chọn tàu, chuẩn bị hành lý đến các hoạt động không thể bỏ qua trên vịnh.'
  },
  {
    id: 3,
    slug: 'checklist-lan-ngam-san-ho',
    title: 'Checklist lặn ngắm san hô',
    coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    excerpt: 'Bài viết scheduled seed cho admin scheduler.',
    publishedAt: '2026-03-25T15:30:00Z',
    authorName: 'Content Admin',
    content: 'Danh sách những món đồ cần thiết khi tham gia tour lặn ngắm san hô tại Phú Quốc. Đừng quên mang theo kem chống nắng thân thiện với đại dương!'
  }
];
