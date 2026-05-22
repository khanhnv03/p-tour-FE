import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportAdminUsers, listAdminUsers, updateAdminUserStatus } from '../api/admin';
import ConfirmDialog from '../components/ConfirmDialog';
import { extractApiErrorMessage } from '../api/types';
import type { UserProfile, UserStatus } from '../api/users';

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  BLOCKED: 'Đã tạm khóa',
};

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { dot: string; bg: string; text: string }> = {
    ACTIVE:  { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    BLOCKED: { dot: 'bg-red-500',     bg: 'bg-red-50',     text: 'text-red-700' },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

export default function ManageCustomers() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<UserStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState({ total: 0, active: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<UserProfile | null>(null);

  const fetchSummary = useCallback(async () => {
    const [all, active, blocked] = await Promise.all([
      listAdminUsers({ role: 'CUSTOMER', page: 0, size: 1 }),
      listAdminUsers({ role: 'CUSTOMER', status: 'ACTIVE', page: 0, size: 1 }),
      listAdminUsers({ role: 'CUSTOMER', status: 'BLOCKED', page: 0, size: 1 }),
    ]);
    setSummary({
      total: all.totalElements,
      active: active.totalElements,
      blocked: blocked.totalElements,
    });
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await listAdminUsers({
        keyword: keyword.trim() || undefined,
        role: 'CUSTOMER',
        status: status === 'ALL' ? undefined : status,
        page,
        size: PAGE_SIZE,
        sort: 'createdAt,desc',
      });
      setCustomers(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch {
      setError('Không thể tải danh sách khách hàng.');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, status]);

  useEffect(() => {
    fetchSummary().catch(() => undefined);
  }, [fetchSummary]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchCustomers();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [fetchCustomers]);

  function changeStatus(nextStatus: UserStatus | 'ALL') {
    setStatus(nextStatus);
    setPage(0);
  }

  async function toggleStatus(user: UserProfile) {
    setUpdatingId(user.id);
    setActionError(null);
    const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const updated = await updateAdminUserStatus(user.id, nextStatus);
      setCustomers(prev => prev.map(item => item.id === updated.id ? updated : item));
      await fetchSummary();
      setStatusTarget(null);
    } catch (err: unknown) {
      setActionError(extractApiErrorMessage(err, 'Cập nhật trạng thái thất bại. Vui lòng thử lại.'));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await exportAdminUsers({
        keyword: keyword.trim() || undefined,
        role: 'CUSTOMER',
        status: status === 'ALL' ? undefined : status,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'customers.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setActionError(extractApiErrorMessage(err, 'Xuất CSV thất bại. Vui lòng thử lại.'));
    } finally {
      setExporting(false);
    }
  }

  const from = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === 'ACTIVE' ? 'Tạm khóa tài khoản' : 'Mở khóa tài khoản'}
        message={statusTarget?.status === 'ACTIVE'
          ? 'Tài khoản sẽ không thể đăng nhập và thực hiện giao dịch cho đến khi được mở khóa.'
          : 'Tài khoản sẽ được kích hoạt lại và có thể đăng nhập bình thường.'}
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
        cancelLabel="Hủy"
        tone={statusTarget?.status === 'ACTIVE' ? 'danger' : 'default'}
        pending={statusTarget != null && updatingId === statusTarget.id}
        onCancel={() => {
          if (updatingId == null) setStatusTarget(null);
        }}
        onConfirm={() => {
          if (statusTarget) void toggleStatus(statusTarget);
        }}
        detail={statusTarget ? (
          <div>
            <p className="font-semibold text-on-surface">{statusTarget.fullName || 'Chưa cập nhật tên'}</p>
            <p className="text-xs mt-1">{statusTarget.email}</p>
          </div>
        ) : undefined}
      />

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-primary">Khách hàng</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Danh bạ khách hàng</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Quản lý tài khoản người dùng, hồ sơ cá nhân và lịch sử tương tác.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 border border-primary/20 text-primary font-bold text-xs px-5 py-3 rounded-xl hover:bg-primary/5 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">{exporting ? 'progress_activity' : 'download'}</span>
          Xuất CSV
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="primary-gradient text-white rounded-2xl shadow-xl shadow-primary/20 p-5 flex flex-col gap-3 relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[72px] text-white/10 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Tổng khách hàng</span>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-black tracking-tight">{summary.total.toLocaleString('vi-VN')}</span>
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Tài khoản</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang hoạt động</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person_check</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary tracking-tight">{summary.active.toLocaleString('vi-VN')}</span>
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Người dùng</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã khóa</span>
            <span className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>block</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600 tracking-tight">{summary.blocked.toLocaleString('vi-VN')}</span>
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest">Tài khoản</span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={keyword}
            onChange={e => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm theo tên, email, số điện thoại hoặc ID..."
            className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {([
            { value: 'ALL' as const, label: 'Tất cả' },
            { value: 'ACTIVE' as const, label: 'Hoạt động' },
            { value: 'BLOCKED' as const, label: 'Đã khóa' },
          ]).map(item => (
            <button
              key={item.value}
              onClick={() => changeStatus(item.value)}
              className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all border ${
                status === item.value
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-slate-50 text-slate-500 border-black/5 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
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
            <button onClick={fetchCustomers} className="text-xs text-primary font-black hover:underline">Thử lại</button>
          </div>
        )}

        {!loading && !error && customers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <span className="material-symbols-outlined text-3xl">group</span>
            <p className="text-sm font-bold">Không tìm thấy khách hàng phù hợp.</p>
          </div>
        )}

        {!loading && !error && customers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Liên hệ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày tham gia</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} className="border-t border-black/5 hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                          {customer.avatarUrl ? (
                            <img src={customer.avatarUrl} alt={customer.fullName || customer.email} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-black text-slate-500">{initials(customer.fullName, customer.email)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm">{customer.fullName || 'Chưa cập nhật tên'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="font-semibold text-on-surface">{customer.email}</p>
                      <p className="text-slate-400 mt-0.5 text-xs">{customer.phone || 'Chưa cập nhật số điện thoại'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {new Date(customer.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-30 group-hover:opacity-100 transition-all">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </Link>
                        <button
                          onClick={() => {
                            setActionError(null);
                            setStatusTarget(customer);
                          }}
                          disabled={updatingId === customer.id}
                          className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all disabled:opacity-40"
                          title={customer.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          <span className="material-symbols-outlined text-base">
                            {updatingId === customer.id ? 'progress_activity' : customer.status === 'ACTIVE' ? 'block' : 'lock_open'}
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

        <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Hiển thị <span className="text-on-surface">{from}-{to}</span> trong <span className="text-on-surface">{totalElements.toLocaleString('vi-VN')}</span> khách hàng
          </p>
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              className="p-2 rounded-lg hover:bg-white text-slate-400 disabled:opacity-30 transition-all border border-black/5"
              disabled={page <= 0 || loading}
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <span className="px-3 py-2 text-xs font-black text-slate-500">
              {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, Math.max(totalPages - 1, 0)))}
              className="p-2 rounded-lg hover:bg-white text-slate-400 disabled:opacity-30 transition-all border border-black/5"
              disabled={page >= totalPages - 1 || loading}
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
