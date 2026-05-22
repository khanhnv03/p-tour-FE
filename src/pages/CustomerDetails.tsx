import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAdminCustomerDetail, updateAdminUser, updateAdminUserStatus } from '../api/admin';
import type { AdminCustomerDetail } from '../api/admin';
import type { BookingStatus } from '../api/bookings';
import ConfirmDialog from '../components/ConfirmDialog';
import { extractApiErrorMessage } from '../api/types';
import type { UpdateProfileRequest, UserStatus } from '../api/users';

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  BLOCKED: 'Đã tạm khóa',
};

const BOOKING_STATUS: Record<BookingStatus, { label: string; cls: string }> = {
  PENDING:   { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700' },
  CONFIRMED: { label: 'Đã xác nhận',  cls: 'bg-blue-50 text-blue-700' },
  CANCELLED: { label: 'Đã hủy',       cls: 'bg-red-50 text-red-700' },
  COMPLETED: { label: 'Hoàn tất',     cls: 'bg-emerald-50 text-emerald-700' },
};

interface FormState {
  fullName: string;
  phone: string;
  avatarUrl: string;
  address: string;
}

function formatCurrency(value: number | null | undefined) {
  return (value ?? 0).toLocaleString('vi-VN') + 'đ';
}

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

export default function CustomerDetails() {
  const { id } = useParams();
  const customerId = Number(id);
  const invalidId = !id || Number.isNaN(customerId);

  const [detail, setDetail] = useState<AdminCustomerDetail | null>(null);
  const [form, setForm] = useState<FormState>({ fullName: '', phone: '', avatarUrl: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(!invalidId);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(invalidId ? 'Mã khách hàng không hợp lệ.' : null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);

  useEffect(() => {
    if (invalidId) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminCustomerDetail(customerId);
        setDetail(data);
        setForm({
          fullName: data.user.fullName ?? '',
          phone: data.user.phone ?? '',
          avatarUrl: data.user.avatarUrl ?? '',
          address: data.user.address ?? '',
        });
      } catch {
        setError('Không thể tải dữ liệu khách hàng.');
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId, invalidId]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function cancelEdit() {
    if (!detail) return;
    setFormError(null);
    setForm({
      fullName: detail.user.fullName ?? '',
      phone: detail.user.phone ?? '',
      avatarUrl: detail.user.avatarUrl ?? '',
      address: detail.user.address ?? '',
    });
    setIsEditing(false);
  }

  async function saveProfile() {
    if (!detail) return;
    if (!form.fullName.trim()) {
      setFormError('Vui lòng nhập họ tên khách hàng.');
      return;
    }

    const payload: UpdateProfileRequest = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      avatarUrl: form.avatarUrl.trim(),
      address: form.address.trim(),
    };

    setSaving(true);
    setFormError(null);
    try {
      const updated = await updateAdminUser(detail.user.id, payload);
      setDetail(prev => prev ? { ...prev, user: updated } : prev);
      setIsEditing(false);
    } catch (saveError: unknown) {
      setFormError(extractApiErrorMessage(saveError, 'Lưu thông tin thất bại. Vui lòng thử lại.'));
    } finally {
      setSaving(false);
    }
  }

  async function confirmToggleStatus() {
    if (!detail) return;
    const nextStatus: UserStatus = detail.user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

    setUpdatingStatus(true);
    setStatusError(null);
    try {
      const updated = await updateAdminUserStatus(detail.user.id, nextStatus);
      setDetail(prev => prev ? { ...prev, user: updated } : prev);
      setConfirmStatusOpen(false);
    } catch (statusUpdateError: unknown) {
      setStatusError(extractApiErrorMessage(statusUpdateError, 'Cập nhật trạng thái thất bại. Vui lòng thử lại.'));
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 py-32 gap-3 text-slate-400">
        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
        <span className="text-sm font-bold">Đang tải...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-32 gap-3">
        <span className="material-symbols-outlined text-3xl text-red-400">error</span>
        <p className="text-sm text-red-500 font-bold">{error || 'Không tìm thấy khách hàng.'}</p>
        <Link to="/admin/customers" className="text-xs text-primary font-black hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const user = detail.user;
  const statusClass = user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700';
  const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
  const statusAction = nextStatus === 'BLOCKED' ? 'Khóa' : 'Mở khóa';

  return (
    <>
      <ConfirmDialog
        open={confirmStatusOpen}
        title={`${statusAction} tài khoản`}
        message={`Tài khoản sẽ được chuyển sang trạng thái ${nextStatus === 'BLOCKED' ? 'tạm khóa' : 'hoạt động'}.`}
        confirmLabel={statusAction}
        cancelLabel="Hủy"
        tone={nextStatus === 'BLOCKED' ? 'danger' : 'default'}
        pending={updatingStatus}
        onCancel={() => {
          if (!updatingStatus) setConfirmStatusOpen(false);
        }}
        onConfirm={() => void confirmToggleStatus()}
        detail={
          <div>
            <p className="font-semibold text-on-surface">{user.fullName || user.email}</p>
            <p className="text-xs mt-1">Trạng thái hiện tại: {STATUS_LABEL[user.status]}</p>
          </div>
        }
      />

      <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-5 border-b border-black/5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Khách hàng
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full shadow-sm object-cover border-2 border-white bg-slate-100 overflow-hidden flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName || user.email} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-black text-slate-500">{initials(user.fullName, user.email)}</span>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  className="text-xl font-black text-on-surface bg-slate-50 border-none rounded-xl px-3 py-1 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              ) : (
                <h1 className="text-xl font-black text-on-surface leading-tight">{user.fullName || 'Chưa cập nhật tên'}</h1>
              )}
              <p className="text-sm text-slate-400 font-medium">
                {user.email} · {user.phone || 'Chưa cập nhật số điện thoại'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setStatusError(null);
              setConfirmStatusOpen(true);
            }}
            disabled={updatingStatus}
            className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-colors border disabled:opacity-60 ${
              user.status === 'ACTIVE'
                ? 'text-red-500 hover:bg-red-50 border-red-100'
                : 'text-emerald-600 hover:bg-emerald-50 border-emerald-100'
            }`}
          >
            {updatingStatus ? 'Đang xử lý...' : user.status === 'ACTIVE' ? 'Đình chỉ' : 'Mở khóa'}
          </button>
          {isEditing ? (
            <>
              <button onClick={cancelEdit} disabled={saving} className="px-5 py-2.5 font-bold text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-black/10 disabled:opacity-60">
                Hủy
              </button>
              <button onClick={saveProfile} disabled={saving} className="px-6 py-2.5 font-bold text-sm bg-primary text-white rounded-xl shadow-sm shadow-primary/20 hover:shadow-md transition-all disabled:opacity-60">
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 font-bold text-sm bg-primary text-white rounded-xl shadow-sm shadow-primary/20 hover:shadow-md transition-all">
              Sửa thông tin
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h3 className="font-black text-base text-on-surface mb-4">Thống kê</h3>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Tổng chi tiêu</span>
                <span className="text-lg text-primary font-black">{formatCurrency(detail.totalSpent)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Tour đã đặt</span>
                <span className="text-lg font-black text-on-surface">{detail.bookingCount} Chuyến</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Trạng thái</span>
                <span className={`${statusClass} font-bold px-2.5 py-1 rounded-lg text-xs`}>{STATUS_LABEL[user.status]}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Lần đặt gần nhất</span>
                <span className="text-sm font-bold text-on-surface">
                  {detail.lastBookingAt
                    ? new Date(detail.lastBookingAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Chưa có'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin hồ sơ</h4>
            {formError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {formError}
              </div>
            )}
            {statusError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {statusError}
              </div>
            )}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Số điện thoại</label>
              <input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface disabled:text-slate-500"
                placeholder="Chưa cập nhật"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Địa chỉ</label>
              <textarea
                value={form.address}
                onChange={e => set('address', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none disabled:text-slate-500"
                placeholder="Chưa cập nhật"
              />
            </div>
            {isEditing && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Avatar URL</label>
                <input
                  value={form.avatarUrl}
                  onChange={e => set('avatarUrl', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface"
                  placeholder="https://..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h3 className="font-black text-base text-on-surface mb-5">Lịch sử đặt tour gần đây</h3>
            {detail.recentBookings.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-bold text-sm">Khách hàng chưa có booking.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[640px]">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-black/5">
                      <th className="pb-3 font-black">Mã ĐC</th>
                      <th className="pb-3 font-black">Tour</th>
                      <th className="pb-3 font-black">Ngày xuất phát</th>
                      <th className="pb-3 font-black">Tổng tiền</th>
                      <th className="pb-3 font-black">Trạng thái</th>
                      <th className="pb-3 font-black text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {detail.recentBookings.map(row => {
                      const status = BOOKING_STATUS[row.status];
                      return (
                        <tr key={row.id} className="border-b border-black/5 hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 font-mono font-bold text-slate-500 text-xs">{row.bookingCode}</td>
                          <td className="py-4 font-bold text-on-surface">{row.tourTitle}</td>
                          <td className="py-4 text-slate-400 text-xs">
                            {new Date(row.departureDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 font-bold text-slate-600 text-xs">{formatCurrency(row.totalAmount)}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${status.cls}`}>{status.label}</span>
                          </td>
                          <td className="py-4 text-right">
                            <Link to="/admin/orders" className="text-primary text-xs font-bold hover:underline">Xem đơn hàng</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
