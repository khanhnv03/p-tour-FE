import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import { BRAND_NAME } from '../constants';
import { getBlogPostBySlug, type BlogPostDetail } from '../api/blogData';

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

function readMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export default function BlogPost() {
  const { slug } = useParams();
  const currentSlug = slug ?? '';
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSlug]);

  useEffect(() => {
    if (!currentSlug) {
      setError('Đường dẫn bài viết không hợp lệ');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    let cancelled = false;
    getBlogPostBySlug(currentSlug)
      .then((data) => { if (!cancelled) setPost(data); })
      .catch(() => { if (!cancelled) setError('Không tìm thấy bài viết'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [currentSlug]);

  const minutes = useMemo(() => (post ? readMinutes(post.content) : 1), [post]);

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="max-w-4xl mx-auto px-8 py-12 flex-grow w-full">
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại Nhật ký
        </Link>

        {loading ? (
          <div className="py-24 text-center text-sm font-bold text-on-surface-variant">Đang tải bài viết...</div>
        ) : error || !post ? (
          <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {error ?? 'Không tìm thấy bài viết'}
          </div>
        ) : (
          <>
            <header className="mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-6 text-on-surface-variant flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Nhật ký</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="text-sm font-bold">{formatDate(post.publishedAt)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="text-sm font-bold">{minutes} phút đọc</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-8 leading-[1.1]">{post.title}</h1>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full shadow-md bg-primary/10 text-primary flex items-center justify-center font-black">
                  {post.authorName.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-bold text-on-surface">{post.authorName}</div>
                  <div className="text-xs text-on-surface-variant">Biên tập viên</div>
                </div>
              </div>
            </header>

            {post.coverImageUrl && (
              <figure className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl h-[360px] md:h-[560px] relative">
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
              </figure>
            )}

            {post.excerpt && (
              <p className="text-xl font-medium text-on-surface leading-loose mb-8 italic">
                {post.excerpt}
              </p>
            )}

            <article className="prose prose-lg prose-indigo max-w-none space-y-6 text-on-surface-variant leading-relaxed text-lg pb-20 border-b border-outline-variant/20 whitespace-pre-wrap">
              {post.content}
            </article>
          </>
        )}
      </main>

      <footer className="bg-slate-50 w-full mt-auto">
        <div className="border-t border-slate-200 py-8 px-8 text-center">
          <p className="text-slate-400 text-xs font-medium">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
        </div>
      </footer>
    </div>
  );
}
