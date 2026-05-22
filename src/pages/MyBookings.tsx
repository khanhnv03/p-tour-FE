import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cancelBooking, getMyBookings, type Booking, type BookingStatus } from '../api/bookings';
import { findOrderByBooking, type Order } from '../api/orders';
import { extractApiErrorMessage, type PageResponse } from '../api/types';

type BookingFilter = 'ALL' | BookingStatus;

const FILTERS: { value: BookingFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const fmtCurrency = (value: number) => `${value.toLocaleString('vi-VN')}₫`;
const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

function getBookingStatusStyle(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-700';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

function getBookingStatusLabel(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'COMPLETED':
      return 'Đã hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return 'Chờ thanh toán';
  }
}

function getPaymentStatusLabel(status: Order['paymentStatus']) {
  switch (status) {
    case 'PAID':
      return 'Đã thanh toán';
    case 'REFUNDED':
      return 'Đã hoàn tiền';
    case 'FAILED':
      return 'Thất bại';
    default:
      return 'Đang chờ';
  }
}

function getPaymentMeta(order: Order | null) {
  if (!order) {
    return {
      className: 'border-slate-200 bg-slate-50 text-slate-600',
      title: 'Chưa tạo đơn thanh toán',
      description: 'Booking mới được giữ chỗ tạm thời. Bạn có thể tiếp tục sang checkout để tạo order.',
    };
  }

  switch (order.paymentStatus) {
    case 'PAID':
      return {
        className: 'border-green-200 bg-green-50 text-green-700',
        title: 'Thanh toán đã được ghi nhận',
        description: order.paidAt
          ? `Đơn hàng ${order.orderCode} đã thanh toán lúc ${new Date(order.paidAt).toLocaleString('vi-VN')}.`
          : `Đơn hàng ${order.orderCode} đã thanh toán thành công.`,
      };
    case 'REFUNDED':
      return {
        className: 'border-amber-200 bg-amber-50 text-amber-800',
        title: 'Đơn hàng đã hoàn tiền',
        description: order.refundedAt
          ? `Khoản thanh toán đã được hoàn lúc ${new Date(order.refundedAt).toLocaleString('vi-VN')}.`
          : 'Khoản thanh toán đã được hoàn về phương thức ban đầu.',
      };
    case 'FAILED':
      return {
        className: 'border-red-200 bg-red-50 text-red-700',
        title: 'Thanh toán chưa thành công',
        description: `Đơn hàng ${order.orderCode} chưa thanh toán được. Bạn có thể quay lại checkout để thử lại.`,
      };
    default:
      return {
        className: 'border-amber-200 bg-amber-50 text-amber-800',
        title: 'Đang chờ thanh toán',
        description: `Đơn hàng ${order.orderCode} đã được tạo nhưng chưa hoàn tất thanh toán.`,
      };
  }
}

export default function MyBookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Math.max(0, Number(searchParams.get('page') ?? 0) || 0);

  const [page, setPage] = useState(initialPage);
  const [filter, setFilter] = useState<BookingFilter>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [result, setResult] = useState<PageResponse<Booking> | null>(null);
  const [ordersByBooking, setOrdersByBooking] = useState<Record<number, Order | null>>({});

  useEffect(() => {
    setSearchParams((current) => {
      current.set('page', String(page));
      return current;
    }, { replace: true });
  }, [page, setSearchParams]);

  useEffect(() => {
    let mounted = true;

    async function loadBookings() {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyBookings({ page, size: 8 });
        const orderPairs = await Promise.all(
          response.content.map(async (booking) => [booking.id, await findOrderByBooking(booking.id)] as const),
        );

        if (!mounted) return;

        setResult(response);
        setOrdersByBooking(Object.fromEntries(orderPairs));
      } catch (loadError: unknown) {
        if (!mounted) return;
        setError(extractApiErrorMessage(loadError, 'Không thể tải danh sách booking.'));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadBookings();
    return () => {
      mounted = false;
    };
  }, [page]);

  const bookings = result?.content ?? [];
  const visibleBookings = useMemo(
    () => (filter === 'ALL' ? bookings : bookings.filter((item) => item.status === filter)),
    [bookings, filter],
  );

  const summary = useMemo(() => {
    const base = { all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const item of bookings) {
      if (item.status === 'PENDING') base.pending += 1;
      if (item.status === 'CONFIRMED') base.confirmed += 1;
      if (item.status === 'COMPLETED') base.completed += 1;
      if (item.status === 'CANCELLED') base.cancelled += 1;
    }
    return base;
  }, [bookings]);

  async function handleCancel(id: number) {
    setCancellingId(id);
    setError(null);
    try {
      const updated = await cancelBooking(id);
      setResult((current) => current ? {
        ...current,
        content: current.content.map((item) => (item.id === id ? updated : item)),
      } : current);
    } catch (cancelError: unknown) {
      setError(extractApiErrorMessage(cancelError, 'Không thể hủy booking này.'));
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-2">User portal</p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-on-surface">Chuyến đi của tôi</h1>
          <p className="text-on-surface-variant text-sm mt-2 max-w-2xl">
            Theo dõi các booking đã tạo, thanh toán đang chờ và lịch khởi hành đã được xác nhận.
          </p>
        </div>
        <Link to="/tours" className="primary-gradient text-white px-5 py-3 rounded-xl font-bold text-sm w-full sm:w-auto text-center">
          Đặt chuyến đi mới
        </Link>
      </header>

      <section className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label="Tổng booking" value={summary.all} />
        <StatCard label="Chờ thanh toán" value={summary.pending} />
        <StatCard label="Đã xác nhận" value={summary.confirmed} />
        <StatCard label="Hoàn thành" value={summary.completed} />
        <StatCard label="Đã hủy" value={summary.cancelled} />
      </section>

      <section className="flex flex-wrap gap-3">
        {FILTERS.map((item) => {
          const active = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${active ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}
            >
              {item.label}
            </button>
          );
        })}
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {visibleBookings.length === 0 ? (
        <section className="rounded-[2rem] bg-surface-container-lowest border border-surface-container-low/60 px-6 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant">luggage</span>
          <h2 className="text-xl font-black mt-4">Chưa có booking phù hợp</h2>
          <p className="text-sm text-on-surface-variant mt-2">
            {bookings.length === 0 ? 'Tài khoản của bạn chưa có booking nào.' : 'Không có booking nào thuộc trạng thái đã chọn.'}
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {visibleBookings.map((booking) => {
            const order = ordersByBooking[booking.id];
            const paymentMeta = getPaymentMeta(order ?? null);
            const canPay = booking.status === 'PENDING' && order?.paymentStatus !== 'PAID' && order?.paymentStatus !== 'REFUNDED';
            const canCancel = booking.status === 'PENDING';

            return (
              <article key={booking.id} className="rounded-[2rem] bg-surface-container-lowest border border-surface-container-low/60 p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-center gap-5 xl:justify-between">
                  <div className="flex gap-4 min-w-0">
                    <img
                      src={booking.tourCoverImage ?? `https://picsum.photos/seed/${booking.id}/400/300`}
                      alt={booking.tourTitle}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                          {booking.bookingCode}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getBookingStatusStyle(booking.status)}`}>
                          {getBookingStatusLabel(booking.status)}
                        </span>
                        {order && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-black tracking-tight text-on-surface">{booking.tourTitle}</h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-surface-variant mt-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">calendar_today</span>
                          {fmtDate(booking.departureDate)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">group</span>
                          {booking.guestCount} khách
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">payments</span>
                          {fmtCurrency(Number(booking.totalAmount))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 xl:items-center">
                    <Link
                      to={`/my-bookings/${booking.id}`}
                      className="px-5 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-sm font-bold text-center"
                    >
                      Chi tiết
                    </Link>
                    {canPay && (
                      <Link
                        to={`/checkout?bookingId=${booking.id}`}
                        className="px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold text-center shadow-sm"
                      >
                        {order ? 'Tiếp tục thanh toán' : 'Thanh toán ngay'}
                      </Link>
                    )}
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => void handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="px-5 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-bold disabled:opacity-60"
                      >
                        {cancellingId === booking.id ? 'Đang hủy...' : 'Hủy booking'}
                      </button>
                    )}
                  </div>
                </div>

                <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${paymentMeta.className}`}>
                  <p className="font-semibold">{paymentMeta.title}</p>
                  <p className="mt-1">{paymentMeta.description}</p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {(result?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-sm text-on-surface-variant">
            Trang {page + 1} / {result?.totalPages}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
              className="px-4 py-2 rounded-xl bg-surface-container-low text-sm font-bold disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min((result?.totalPages ?? 1) - 1, current + 1))}
              disabled={page >= (result?.totalPages ?? 1) - 1}
              className="px-4 py-2 rounded-xl bg-surface-container-low text-sm font-bold disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-low/60 px-4 py-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <p className="text-2xl font-black tracking-tight text-on-surface mt-3">{value}</p>
    </div>
  );
}
