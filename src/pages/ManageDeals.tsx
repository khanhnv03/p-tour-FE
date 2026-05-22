import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAdminDeals, deleteAdminDeal } from '../api/admin';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Deal, DealStatus } from '../api/deals';
import { extractApiErrorMessage, type PageResponse } from '../api/types';

const PAGE_SIZE = 15;

const STATUS_OPTIONS: { value: DealStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',     label: 'Tất cả'         },
  { value: 'ACTIVE',  label: 'Đang hoạt động' },
  { value: 'DRAFT',   label: 'Bản nháp'       },
  { value: 'EXPIRED', label: 'Đã hết hạn'     },
];

function formatBadge(deal: Deal) {
  if (deal.badgeText) return deal.badgeText;
  return deal.discountType === 'PERCENTAGE'
    ? `GIẢM ${deal.discountValue}%`
    : `GIẢM ${deal.discountValue.toLocaleString('vi-VN')}₫`;
}

function StatusBadge({ deal }: { deal: Deal }) {
  const map: Record<DealStatus, { label: string; dot: string; cls: string }> = {
    ACTIVE:  { label: 'Đang hoạt động', dot: 'bg-emerald-500', cls: 'bg-emerald-100 text-emerald-700' },
    DRAFT:   { label: 'Bản nháp',       dot: 'bg-slate-400',   cls: 'bg-slate-100 text-slate-500'     },
    EXPIRED: { label: 'Đã hết hạn',     dot: 'bg-slate-400',   cls: 'bg-slate-100 text-slate-500'     },
  };
  const s = map[deal.status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const EMPTY_PAGE: PageResponse<Deal> = { content: [], page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0, last: true };

export default function ManageDeals() {
  const [keyword,    setKeyword]    = useState('');
  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState<DealStatus | 'ALL'>('ALL');
  const [page,       setPage]       = useState(0);
  const [dealsPage,  setDealsPage]  = useState<PageResponse<Deal>>(EMPTY_PAGE);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Deal | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminDeals({
        keyword: keyword || undefined,
        status:  status === 'ALL' ? undefined : status,
        page,
        size: PAGE_SIZE,
      });
      setDealsPage(result);
    } catch {
      setError('Không thể tải danh sách ưu đãi.');
    } finally {
      setLoading(false);
    }
  }, [keyword, status, page]);

  useEffect(() => { void fetchDeals(); }, [fetchDeals]);

  const handleSearch = () => {
    setKeyword(search.trim());
    setPage(0);
  };

  const handleStatusChange = (next: DealStatus | 'ALL') => {
    setStatus(next);
    setPage(0);
  };

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setDeleteError(null);
    try {
      await deleteAdminDeal(deleteTarget.id);
      setDealsPage(prev => ({
        ...prev,
        content: prev.content.filter(d => d.id !== deleteTarget.id),
        totalElements: prev.totalElements - 1,
      }));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setDeleteError(extractApiErrorMessage(err, 'Xóa thất bại. Vui lòng thử lại.'));
    } finally {
      setDeletingId(null);
    }
  }

  const activeCount  = dealsPage.content.filter(d => d.status === 'ACTIVE').length;
  const totalUsage   = dealsPage.content.reduce((sum, d) => sum + d.usageCount, 0);
  const expiredCount = dealsPage.content.filter(d => d.status === 'EXPIRED').length;

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa ưu đãi"
        message="Ưu đãi sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác."
        confirmLabel="Xóa ưu đãi"
        cancelLabel="Hủy"
        tone="danger"
        pending={deleteTarget != null && deletingId === deleteTarget.id}
        onCancel={() => {
          if (deletingId == null) setDeleteTarget(null);
        }}
        onConfirm={() => void handleDelete()}
        detail={deleteTarget ? (
          <div>
            <p className="font-semibold text-on-surface">{deleteTarget.title}</p>
            <p className="text-xs mt-1">Mã promo: {deleteTarget.promoCode ?? 'Không có'}</p>
          </div>
        ) : undefined}
      />

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-secondary">Ưu đãi</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Ưu đãi & Khuyến mãi</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Cấu hình các chiến dịch giảm giá, tặng kèm quà và kích cầu.</p>
        </div>
        <Link
          to="/admin/deals/new"
          className="inline-flex items-center gap-2 bg-secondary text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
          Tạo ưu đãi mới
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang hoạt động</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary tracking-tight">{loading ? '—' : activeCount}</span>
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Chiến dịch</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mã đã sử dụng</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tight">{loading ? '—' : totalUsage}</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Lượt</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã hết hạn</span>
            <span className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-500 tracking-tight">{loading ? '—' : expiredCount}</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Chiến dịch</span>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-3 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm tên chiến dịch, mã promo..."
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

      {/* Campaign Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-base font-black tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            Danh sách chiến dịch
          </h2>
          {!loading && (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {dealsPage.totalElements} chiến dịch
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
            <button onClick={fetchDeals} className="text-xs text-primary font-black hover:underline">Thử lại</button>
          </div>
        )}

        {!loading && !error && dealsPage.content.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <span className="material-symbols-outlined text-3xl">sell</span>
            <p className="text-sm font-bold">Không tìm thấy chiến dịch nào.</p>
          </div>
        )}

        {!loading && !error && dealsPage.content.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Chiến dịch</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mã / Kiểu</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hết hạn</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Lượt dùng</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {dealsPage.content.map((deal) => (
                  <tr
                    key={deal.id}
                    className={`border-t border-black/5 hover:bg-slate-50/60 transition-colors ${deal.status === 'EXPIRED' ? 'opacity-55' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {deal.campaignImageUrl ? (
                          <img
                            src={deal.campaignImageUrl}
                            alt={deal.title}
                            className={`w-11 h-11 rounded-xl object-cover flex-shrink-0 ${deal.status === 'EXPIRED' ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-slate-400 text-base">image</span>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-on-surface text-sm">{deal.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                            {deal.category && <>{deal.category} · </>}
                            <span className="font-black text-secondary">{formatBadge(deal)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {deal.promoCode ? (
                        <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-on-surface">{deal.promoCode}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Không có mã</span>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                        {deal.displayMode === 'COPY_CODE' ? 'Copy mã' : 'Tự động áp dụng'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {deal.validTo
                        ? new Date(deal.validTo).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : <span className="italic text-slate-400">Không giới hạn</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge deal={deal} />
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-500 text-sm">
                      {deal.usageCount}
                      {deal.usageLimit != null && (
                        <span className="text-slate-300 font-normal"> / {deal.usageLimit}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/deals/edit/${deal.id}`}
                          className="inline-flex p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(deal)}
                          disabled={deletingId === deal.id}
                          className="inline-flex p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {deletingId === deal.id ? 'progress_activity' : 'delete'}
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
            Trang <span className="text-on-surface">{dealsPage.totalPages === 0 ? 0 : page + 1}</span> / <span className="text-on-surface">{dealsPage.totalPages}</span>
            {' · '}<span className="text-on-surface">{dealsPage.totalElements}</span> chiến dịch
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
              {dealsPage.totalPages === 0 ? 0 : page + 1}/{dealsPage.totalPages}
            </span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= dealsPage.totalPages - 1 || loading}
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
