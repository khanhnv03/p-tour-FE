import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  exportAdminOrders,
  getAdminOrderSummary,
  listAdminOrders,
  refundOrder,
  type Order,
  type OrderSummary,
  type PaymentStatus,
} from '../api/orders';
import {
  listAdminBookings,
  updateBookingStatus,
} from '../api/admin';
import type { Booking, BookingStatus } from '../api/bookings';
import { extractApiErrorMessage, type PageResponse } from '../api/types';

const PAGE_SIZE = 10;

type Tab = 'orders' | 'bookings';

/* ─── Orders ─── */

const ORDER_STATUS_OPTIONS: { value: PaymentStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',      label: 'Tất cả'          },
  { value: 'PENDING',  label: 'Chờ thanh toán'  },
  { value: 'PAID',     label: 'Đã thanh toán'   },
  { value: 'FAILED',   label: 'Thất bại'         },
  { value: 'REFUNDED', label: 'Đã hoàn tiền'    },
];

const BOOKING_STATUS_OPTIONS: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',       label: 'Tất cả'    },
  { value: 'PENDING',   label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Hoàn tất'    },
  { value: 'CANCELLED', label: 'Đã hủy'      },
];

const BOOKING_STATUS_CLASS: Record<BookingStatus, string> = {
  PENDING:   'bg-amber-50 text-amber-700 border border-amber-100',
  CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  CANCELLED: 'bg-slate-100 text-slate-500 border border-slate-200',
};

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING:   'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

const EMPTY_ORDERS: PageResponse<Order> = { content: [], page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0, last: true };
const EMPTY_BOOKINGS: PageResponse<Booking> = { content: [], page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0, last: true };

const EMPTY_SUMMARY: OrderSummary = {
  totalRevenue: 0,
  pendingAmount: 0,
  averageOrderValue: 0,
  refundedAmount: 0,
  paidCount: 0,
  pendingCount: 0,
  failedCount: 0,
  refundedCount: 0,
};

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value ?? 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatDateShort(value: string | null | undefined) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; className: string }> = {
    PAID:     { label: 'Đã thanh toán', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    PENDING:  { label: 'Chờ thanh toán', className: 'bg-amber-50 text-amber-700 border border-amber-100' },
    FAILED:   { label: 'Thất bại',       className: 'bg-slate-100 text-slate-600 border border-slate-200' },
    REFUNDED: { label: 'Đã hoàn tiền',  className: 'bg-red-50 text-red-700 border border-red-100' },
  };
  const option = map[status];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${option.className}`}>
      {option.label}
    </span>
  );
}

/* ─── Component ─── */

export default function ManageOrders() {
  const [tab, setTab] = useState<Tab>('orders');

  /* orders state */
  const [orderSearch,  setOrderSearch]  = useState('');
  const [orderStatus,  setOrderStatus]  = useState<PaymentStatus | 'ALL'>('ALL');
  const [orderPage,    setOrderPage]    = useState(0);
  const [ordersPage,   setOrdersPage]   = useState<PageResponse<Order>>(EMPTY_ORDERS);
  const [summary,      setSummary]      = useState<OrderSummary>(EMPTY_SUMMARY);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError,   setOrderError]   = useState<string | null>(null);
  const [exporting,    setExporting]    = useState(false);
  const [refundingId,  setRefundingId]  = useState<number | null>(null);
  const [refundTarget, setRefundTarget] = useState<Order | null>(null);

  /* bookings state */
  const [bookingStatus,  setBookingStatus]  = useState<BookingStatus | 'ALL'>('ALL');
  const [bookingPage,    setBookingPage]    = useState(0);
  const [bookingsPage,   setBookingsPage]   = useState<PageResponse<Booking>>(EMPTY_BOOKINGS);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError,   setBookingError]   = useState<string | null>(null);
  const [updatingId,     setUpdatingId]     = useState<number | null>(null);

  /* ── fetch orders ── */
  const fetchOrders = useCallback(async () => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const [orders, nextSummary] = await Promise.all([
        listAdminOrders({ status: orderStatus === 'ALL' ? undefined : orderStatus, page: orderPage, size: PAGE_SIZE, sort: 'createdAt,desc' }),
        getAdminOrderSummary(),
      ]);
      setOrdersPage(orders);
      setSummary(nextSummary);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Không thể tải đơn hàng');
    } finally {
      setOrderLoading(false);
    }
  }, [orderPage, orderStatus]);

  /* ── fetch bookings ── */
  const fetchBookings = useCallback(async () => {
    setBookingLoading(true);
    setBookingError(null);
    try {
      const result = await listAdminBookings({
        status: bookingStatus === 'ALL' ? undefined : bookingStatus,
        page:   bookingPage,
        size:   PAGE_SIZE,
      });
      setBookingsPage(result);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Không thể tải đặt chỗ');
    } finally {
      setBookingLoading(false);
    }
  }, [bookingPage, bookingStatus]);

  useEffect(() => { void fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (tab === 'bookings') void fetchBookings();
  }, [tab, fetchBookings]);

  /* ── filtered orders (client-side search within page) ── */
  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase();
    if (!keyword) return ordersPage.content;
    return ordersPage.content.filter(o =>
      o.orderCode.toLowerCase().includes(keyword) ||
      o.bookingCode.toLowerCase().includes(keyword) ||
      o.userName.toLowerCase().includes(keyword) ||
      o.tourTitle.toLowerCase().includes(keyword)
    );
  }, [ordersPage.content, orderSearch]);

  const stats = [
    { label: 'Tổng doanh thu',   value: formatCurrency(summary.totalRevenue),       icon: 'account_balance_wallet', featured: true },
    { label: 'Chờ thanh toán',   value: formatCurrency(summary.pendingAmount),       icon: 'pending',   count: summary.pendingCount },
    { label: 'Đơn hàng TB',      value: formatCurrency(summary.averageOrderValue),   icon: 'bar_chart', count: summary.paidCount    },
    { label: 'Đã hoàn tiền',     value: formatCurrency(summary.refundedAmount),      icon: 'undo',      count: summary.refundedCount },
  ];

  const handleOrderStatusChange = (s: PaymentStatus | 'ALL') => { setOrderStatus(s); setOrderPage(0); };
  const handleBookingStatusChange = (s: BookingStatus | 'ALL') => { setBookingStatus(s); setBookingPage(0); };

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await exportAdminOrders({ status: orderStatus === 'ALL' ? undefined : orderStatus });
      downloadBlob(blob, 'orders.csv');
    } catch (err: unknown) {
      setOrderError(extractApiErrorMessage(err, 'Xuất CSV thất bại'));
    } finally {
      setExporting(false);
    }
  }

  async function handleRefund() {
    if (!refundTarget) return;
    setRefundingId(refundTarget.id);
    setOrderError(null);
    try {
      const refunded = await refundOrder(refundTarget.id);
      setOrdersPage(prev => ({ ...prev, content: prev.content.map(item => item.id === refunded.id ? refunded : item) }));
      const nextSummary = await getAdminOrderSummary();
      setSummary(nextSummary);
      setRefundTarget(null);
    } catch (err: unknown) {
      setOrderError(extractApiErrorMessage(err, 'Hoàn tiền thất bại'));
    } finally {
      setRefundingId(null);
    }
  }

  async function handleUpdateBookingStatus(booking: Booking, newStatus: BookingStatus) {
    setUpdatingId(booking.id);
    setBookingError(null);
    try {
      const updated = await updateBookingStatus(booking.id, newStatus);
      setBookingsPage(prev => ({ ...prev, content: prev.content.map(b => b.id === updated.id ? updated : b) }));
    } catch {
      setBookingError('Cập nhật trạng thái thất bại');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      <ConfirmDialog
        open={Boolean(refundTarget)}
        title="Hoàn tiền đơn hàng"
        message="Hệ thống sẽ chuyển trạng thái đơn hàng sang REFUNDED và hủy booking liên quan nếu hợp lệ."
        confirmLabel="Xác nhận hoàn tiền"
        cancelLabel="Hủy"
        tone="danger"
        pending={refundTarget != null && refundingId === refundTarget.id}
        onCancel={() => {
          if (refundingId == null) setRefundTarget(null);
        }}
        onConfirm={() => void handleRefund()}
        detail={refundTarget ? (
          <div>
            <p className="font-semibold text-on-surface">{refundTarget.orderCode}</p>
            <p className="text-xs mt-1">{refundTarget.userName} · {formatCurrency(refundTarget.amount)}</p>
          </div>
        ) : undefined}
      />

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-primary">Đơn hàng</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Quản lý Đơn hàng</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Theo dõi giao dịch, đặt chỗ, trạng thái thanh toán và hoàn tiền.</p>
        </div>
        {tab === 'orders' && (
          <button
            onClick={() => void handleExport()}
            disabled={exporting}
            className="inline-flex items-center gap-2 border border-primary/20 text-primary font-bold text-xs px-5 py-3 rounded-xl hover:bg-primary/5 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {exporting ? 'Đang xuất...' : 'Xuất CSV'}
          </button>
        )}
      </header>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('orders')}
          className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            tab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Đơn hàng
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            tab === 'bookings' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Đặt chỗ
        </button>
      </div>

      {/* ─── ORDERS TAB ─── */}
      {tab === 'orders' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-5 flex flex-col gap-3 ${stat.featured ? 'primary-gradient text-white shadow-xl shadow-primary/20 relative overflow-hidden' : 'bg-white border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]'}`}
              >
                {stat.featured && (
                  <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[72px] text-white/10 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    account_balance_wallet
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${stat.featured ? 'text-white/70' : 'text-slate-400'}`}>{stat.label}</span>
                  {!stat.featured && (
                    <span className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between mt-auto gap-3">
                  <span className={`text-2xl font-black tracking-tight ${index === 2 ? 'text-xl' : ''} ${stat.featured ? '' : 'text-on-surface'}`}>{stat.value}</span>
                  {'count' in stat && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 whitespace-nowrap">{stat.count} đơn</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-3 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                type="text"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Lọc trong trang: mã đơn, mã booking, khách, tour..."
                className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 lg:ml-auto">
              {ORDER_STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOrderStatusChange(option.value)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all ${
                    orderStatus === option.value
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-slate-50 text-slate-500 border-black/5 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {orderError && (
            <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">{orderError}</div>
          )}

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn hàng</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tour</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orderLoading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">Đang tải đơn hàng...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">Không có đơn hàng phù hợp.</td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="border-t border-black/5 hover:bg-slate-50/60 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-black font-mono text-sm text-on-surface tracking-tight">{order.orderCode}</span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{formatDate(order.createdAt)}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Booking {order.bookingCode}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm text-on-surface">{order.userName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID {order.userId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500 font-medium max-w-[280px] truncate">{order.tourTitle}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{formatDate(order.departureDate)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-sm text-on-surface tracking-tight">{formatCurrency(order.amount)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {order.paymentStatus === 'PAID' && (
                              <button
                                onClick={() => setRefundTarget(order)}
                                disabled={refundingId === order.id}
                                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
                              >
                                {refundingId === order.id ? 'Đang xử lý' : 'Hoàn tiền'}
                              </button>
                            )}
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 hover:bg-primary hover:text-white text-slate-600 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Chi tiết
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Hiển thị <span className="text-on-surface">{filteredOrders.length}</span> trong <span className="text-on-surface">{ordersPage.totalElements}</span> giao dịch
              </p>
              <div className="flex gap-2">
                <button onClick={() => setOrderPage(p => Math.max(0, p - 1))} disabled={orderPage === 0 || orderLoading} className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">Trước</button>
                <span className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-on-surface shadow-sm">{ordersPage.totalPages === 0 ? 0 : orderPage + 1}/{ordersPage.totalPages}</span>
                <button onClick={() => setOrderPage(p => p + 1)} disabled={orderPage >= ordersPage.totalPages - 1 || orderLoading} className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">Sau</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── BOOKINGS TAB ─── */}
      {tab === 'bookings' && (
        <>
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-3 flex flex-wrap gap-2">
            {BOOKING_STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleBookingStatusChange(opt.value)}
                className={`px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all ${
                  bookingStatus === opt.value
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-black/5 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {bookingError && (
            <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">{bookingError}</div>
          )}

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mã đặt chỗ</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tour</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày đi</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingLoading ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">Đang tải đặt chỗ...</td></tr>
                  ) : bookingsPage.content.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">Không có đặt chỗ phù hợp.</td></tr>
                  ) : (
                    bookingsPage.content.map(booking => (
                      <tr key={booking.id} className="border-t border-black/5 hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-black font-mono text-sm text-on-surface tracking-tight">{booking.bookingCode}</span>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{formatDate(booking.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm text-on-surface">{booking.contactName}</p>
                          <p className="text-[10px] text-slate-400">{booking.contactEmail}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500 font-medium max-w-[240px] truncate">{booking.tourTitle}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {formatDateShort(booking.departureDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm">{booking.guestCount}</span>
                          <span className="text-[10px] text-slate-400 ml-1">khách</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${BOOKING_STATUS_CLASS[booking.status]}`}>
                            {BOOKING_STATUS_LABEL[booking.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            {booking.status === 'PENDING' && (
                              <button
                                onClick={() => void handleUpdateBookingStatus(booking, 'CONFIRMED')}
                                disabled={updatingId === booking.id}
                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 whitespace-nowrap"
                              >
                                {updatingId === booking.id ? '...' : 'Xác nhận'}
                              </button>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => void handleUpdateBookingStatus(booking, 'COMPLETED')}
                                disabled={updatingId === booking.id}
                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 whitespace-nowrap"
                              >
                                {updatingId === booking.id ? '...' : 'Hoàn tất'}
                              </button>
                            )}
                            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                              <button
                                onClick={() => void handleUpdateBookingStatus(booking, 'CANCELLED')}
                                disabled={updatingId === booking.id}
                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 whitespace-nowrap"
                              >
                                {updatingId === booking.id ? '...' : 'Hủy'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                <span className="text-on-surface">{bookingsPage.totalElements}</span> đặt chỗ
              </p>
              <div className="flex gap-2">
                <button onClick={() => setBookingPage(p => Math.max(0, p - 1))} disabled={bookingPage === 0 || bookingLoading} className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">Trước</button>
                <span className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-on-surface shadow-sm">{bookingsPage.totalPages === 0 ? 0 : bookingPage + 1}/{bookingsPage.totalPages}</span>
                <button onClick={() => setBookingPage(p => p + 1)} disabled={bookingPage >= bookingsPage.totalPages - 1 || bookingLoading} className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">Sau</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
