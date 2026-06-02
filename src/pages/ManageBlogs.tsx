import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listAdminBlogPosts,
  deleteAdminBlogPost,
  type AdminBlogPost,
  type BlogPostStatus,
} from '../api/admin';
import ConfirmDialog from '../components/ConfirmDialog';
import { extractApiErrorMessage, type PageResponse } from '../api/types';

const PAGE_SIZE = 15;

const STATUS_OPTIONS: { value: BlogPostStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',       label: 'Tất cả'      },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'DRAFT',     label: 'Bản nháp'    },
  { value: 'SCHEDULED', label: 'Lên lịch'    },
];

const STATUS_STYLE: Record<BlogPostStatus, { label: string; dot: string; cls: string }> = {
  PUBLISHED: { label: 'Đã xuất bản', dot: 'bg-emerald-500', cls: 'bg-emerald-100 text-emerald-700' },
  DRAFT:     { label: 'Bản nháp',    dot: 'bg-slate-400',   cls: 'bg-slate-100 text-slate-500'     },
  SCHEDULED: { label: 'Lên lịch',    dot: 'bg-blue-400',    cls: 'bg-blue-100 text-blue-600'       },
};

function StatusBadge({ status }: { status: BlogPostStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const EMPTY_PAGE: PageResponse<AdminBlogPost> = {
  content: [], page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0, last: true,
};

export default function ManageBlogs() {
  const [keyword,      setKeyword]      = useState('');
  const [search,       setSearch]       = useState('');
  const [status,       setStatus]       = useState<BlogPostStatus | 'ALL'>('ALL');
  const [page,         setPage]         = useState(0);
  const [blogsPage,    setBlogsPage]    = useState<PageResponse<AdminBlogPost>>(EMPTY_PAGE);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [deletingId,   setDeletingId]   = useState<number | null>(null);
  const [deleteError,  setDeleteError]  = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminBlogPosts({
        keyword: keyword || undefined,
        status:  status === 'ALL' ? undefined : status,
        page,
        size: PAGE_SIZE,
      });
      setBlogsPage(result);
    } catch {
      setError('Không thể tải danh sách bài viết.');
    } finally {
      setLoading(false);
    }
  }, [keyword, status, page]);

  useEffect(() => { void fetchBlogs(); }, [fetchBlogs]);

  const handleSearch = () => {
    setKeyword(search.trim());
    setPage(0);
  };

  const handleStatusChange = (next: BlogPostStatus | 'ALL') => {
    setStatus(next);
    setPage(0);
  };

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setDeleteError(null);
    try {
      await deleteAdminBlogPost(deleteTarget.id);
      setBlogsPage(prev => ({
        ...prev,
        content: prev.content.filter(b => b.id !== deleteTarget.id),
        totalElements: prev.totalElements - 1,
      }));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setDeleteError(extractApiErrorMessage(err, 'Xóa thất bại. Vui lòng thử lại.'));
    } finally {
      setDeletingId(null);
    }
  }

  const publishedCount  = blogsPage.content.filter(b => b.status === 'PUBLISHED').length;
  const draftCount      = blogsPage.content.filter(b => b.status === 'DRAFT').length;
  const scheduledCount  = blogsPage.content.filter(b => b.status === 'SCHEDULED').length;

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa bài viết"
        message="Bài viết sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."
        confirmLabel="Xóa bài viết"
        cancelLabel="Hủy"
        tone="danger"
        pending={deleteTarget != null && deletingId === deleteTarget.id}
        onCancel={() => { if (deletingId == null) setDeleteTarget(null); }}
        onConfirm={() => void handleDelete()}
        detail={deleteTarget ? (
          <p className="font-semibold text-on-surface">{deleteTarget.title}</p>
        ) : undefined}
      />

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-secondary">Blog</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Quản lý Blog</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Tạo, chỉnh sửa và xuất bản các bài viết hành trình.</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-secondary text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
          Viết bài mới
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã xuất bản</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>article</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary tracking-tight">{loading ? '—' : publishedCount}</span>
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Bài viết</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bản nháp</span>
            <span className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>draft</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tight">{loading ? '—' : draftCount}</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Bài viết</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lên lịch</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-500 tracking-tight">{loading ? '—' : scheduledCount}</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Bài viết</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-3 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm tên bài viết..."
            className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all active:scale-95"
        >
          Tìm
        </button>
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all ${
                status === opt.value
                  ? 'bg-secondary text-white border-secondary shadow-sm'
                  : 'bg-slate-50 text-slate-500 border-black/5 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {deleteError && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
          {deleteError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-base font-black tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            Danh sách bài viết
          </h2>
          {!loading && (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {blogsPage.totalElements} bài viết
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            <span className="text-sm font-bold">Đang tải...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined text-3xl text-red-400">error</span>
            <p className="text-sm text-red-500 font-bold">{error}</p>
            <button onClick={fetchBlogs} className="text-xs text-primary font-black hover:underline">Thử lại</button>
          </div>
        )}

        {!loading && !error && blogsPage.content.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <span className="material-symbols-outlined text-3xl">article</span>
            <p className="text-sm font-bold">Không tìm thấy bài viết nào.</p>
          </div>
        )}

        {!loading && !error && blogsPage.content.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Bài viết</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tác giả</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày xuất bản</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {blogsPage.content.map(blog => (
                  <tr
                    key={blog.id}
                    className={`border-t border-black/5 hover:bg-slate-50/60 transition-colors ${blog.status === 'DRAFT' ? 'opacity-60' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {blog.coverImageUrl ? (
                          <img
                            src={blog.coverImageUrl}
                            alt={blog.title}
                            className="w-14 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-slate-400 text-base">image</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-on-surface text-sm truncate max-w-xs">{blog.title}</div>
                          {blog.excerpt && (
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{blog.excerpt}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                      {blog.authorName ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : <span className="italic text-slate-400">Chưa xuất bản</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/journal/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                          title="Xem trước"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                        <Link
                          to={`/admin/blogs/edit/${blog.id}`}
                          className="inline-flex p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(blog)}
                          disabled={deletingId === blog.id}
                          className="inline-flex p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {deletingId === blog.id ? 'progress_activity' : 'delete'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Trang <span className="text-on-surface">{blogsPage.totalPages === 0 ? 0 : page + 1}</span> / <span className="text-on-surface">{blogsPage.totalPages}</span>
            {' · '}<span className="text-on-surface">{blogsPage.totalElements}</span> bài viết
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0 || loading}
              className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-on-surface shadow-sm">
              {blogsPage.totalPages === 0 ? 0 : page + 1}/{blogsPage.totalPages}
            </span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= blogsPage.totalPages - 1 || loading}
              className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
