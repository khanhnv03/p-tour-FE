import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_FOOTER_DESC, BRAND_NAME } from '../constants';
import UserNavbar from '../components/UserNavbar';
import { getBlogPosts, type BlogPostSummary } from '../api/blogData';
import type { PageResponse } from '../api/tours';

const PAGE_SIZE = 9;
const EMPTY_PAGE: PageResponse<BlogPostSummary> = {
  content: [],
  page: 0,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  last: true,
};

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

export default function Journal() {
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [postsPage, setPostsPage] = useState<PageResponse<BlogPostSummary>>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    setError(null);
    getBlogPosts({ keyword: keyword || undefined, page, size: PAGE_SIZE })
      .then((result) => setPostsPage(result))
      .catch(() => setError('Không thể tải nhật ký'))
      .finally(() => setLoading(false));
  }, [keyword, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const featured = postsPage.content[0];
  const rest = postsPage.content.slice(1);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(0);
  };

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12 flex-grow w-full">
        <section className="relative mb-16">
          {featured ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
              <div className="lg:col-span-7 relative h-[420px] lg:h-[600px] overflow-hidden bg-slate-100">
                {featured.coverImageUrl ? (
                  <img alt={featured.title} className="w-full h-full object-cover" src={featured.coverImageUrl} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300">image</span>
                  </div>
                )}
                <div className="absolute top-8 left-8">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary">Câu chuyện mới nhất</span>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center p-10 lg:p-16 bg-surface-container-lowest">
                <div className="flex items-center gap-3 mb-6 text-on-surface-variant">
                  <span className="text-sm font-semibold tracking-widest uppercase">Nhật ký</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  <span className="text-sm font-semibold">{formatDate(featured.publishedAt)}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mb-6 leading-[1.1]">{featured.title}</h1>
                <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">{featured.excerpt ?? 'Khám phá câu chuyện du lịch mới từ PTIT Tour.'}</p>
                <div className="flex items-center gap-6">
                  <Link to={`/journal/${featured.slug}`} className="inline-block signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold tracking-tight shadow-xl hover:shadow-2xl transition-shadow active:scale-95">Đọc bài viết</Link>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface">{featured.authorName}</span>
                    <span className="text-xs text-on-surface-variant">Biên tập viên</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] bg-surface-container-lowest p-16 text-center">
              <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-3">Nhật ký du lịch</h1>
              <p className="text-on-surface-variant">Chưa có bài viết đã xuất bản.</p>
            </div>
          )}
        </section>

        <section className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-outline-variant/20 pb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-on-surface">Kho lưu trữ Nhật ký</h2>
            <p className="text-on-surface-variant text-sm mt-1">Các bài viết đã xuất bản từ đội biên tập.</p>
          </div>
          <form onSubmit={handleSearch} className="flex items-center bg-surface-container-highest px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-medium w-56 text-on-surface"
              placeholder="Tìm kiếm bài viết..."
              type="text"
            />
            <button className="text-xs font-black uppercase tracking-widest text-primary">Tìm</button>
          </form>
        </section>

        {error && (
          <div className="mb-8 rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-sm font-bold text-on-surface-variant">Đang tải bài viết...</div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rest.map(post => (
              <article key={post.id} className="group">
                <Link to={`/journal/${post.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-surface-container-low shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
                    {post.coverImageUrl ? (
                      <img alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={post.coverImageUrl} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300">image</span>
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-xl rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span className="block text-center w-full py-3 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">Xem bài viết</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Nhật ký</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{formatDate(post.publishedAt)}</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed text-sm line-clamp-2">{post.excerpt ?? 'Khám phá câu chuyện du lịch mới từ PTIT Tour.'}</p>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        )}

        {postsPage.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0 || loading}
              className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant font-bold disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold">{page + 1}/{postsPage.totalPages}</span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= postsPage.totalPages - 1 || loading}
              className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant font-bold disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </main>

      <footer className="bg-slate-50 w-full mt-auto border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-8 py-12 max-w-7xl mx-auto text-sm leading-relaxed">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-blue-900 mb-6">{BRAND_NAME}</div>
            <p className="text-slate-500 mb-6 italic">{BRAND_FOOTER_DESC}</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#!">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#!">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#!">
                <span className="material-symbols-outlined text-lg">camera</span>
              </a>
            </div>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 mb-6 uppercase tracking-wider text-xs">Công ty</h6>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Điều khoản Dịch vụ</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Chính sách Bảo mật</a></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 mb-6 uppercase tracking-wider text-xs">Khám phá</h6>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/tours">Tour du lịch</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/deals">Ưu đãi phút chót</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/journal">Nhật ký hành trình</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Điểm đến nổi bật</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 mb-6 uppercase tracking-wider text-xs">Liên hệ</h6>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm">mail</span>
                contact@ptittour.com
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm">phone</span>
                +84 (0) 123 456 789
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                Lê Lợi, Quận 1, TP. HCM
              </li>
            </ul>
          </div>
        </div>
        <div className="px-8 py-8 max-w-7xl mx-auto border-t border-slate-200 text-center text-slate-400 text-xs">
          © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
        </div>
      </footer>
    </div>
  );
}
