import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_ORIGIN } from '../api/client';
import { cancelBooking, getBooking, getTicket, type Booking, type Ticket } from '../api/bookings';
import { extractApiErrorMessage } from '../api/types';
export interface Review {
  id: number;
  userId: number;
  tourId: number;
  bookingId: number;
  rating: number;
  comment?: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'HIDDEN';
  userFullName: string;
  userAvatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
import { findOrderByBooking, type Order } from '../api/orders';
import { getTourById, type TourDetail } from '../api/tours';

const fmtCurrency = (value: number) => `${value.toLocaleString('vi-VN')}₫`;
const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildTicketDownloadUrl(ticket: Ticket): string {
  if (ticket.downloadUrl.startsWith('http://') || ticket.downloadUrl.startsWith('https://')) {
    return ticket.downloadUrl;
  }
  return `${API_ORIGIN}${ticket.downloadUrl}`;
}

function getBookingStatusMeta(status: Booking['status']) {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Đã xác nhận', className: 'bg-green-100 text-green-700', icon: 'verified' };
    case 'COMPLETED':
      return { label: 'Đã hoàn thành', className: 'bg-blue-100 text-blue-700', icon: 'check_circle' };
    case 'CANCELLED':
      return { label: 'Đã hủy', className: 'bg-red-100 text-red-700', icon: 'cancel' };
    default:
      return { label: 'Chờ thanh toán', className: 'bg-amber-100 text-amber-700', icon: 'schedule' };
  }
}

function getOrderNotice(order: Order | null) {
  if (!order) {
    return {
      className: 'border-slate-200 bg-slate-50 text-slate-600',
      title: 'Chưa có order thanh toán',
      description: 'Booking đang chờ bạn quay lại checkout để tạo order và hoàn tất thanh toán.',
    };
  }

  switch (order.paymentStatus) {
    case 'PAID':
      return {
        className: 'border-green-200 bg-green-50 text-green-700',
        title: 'Thanh toán thành công',
        description: order.paidAt
          ? `Đơn hàng ${order.orderCode} đã thanh toán lúc ${new Date(order.paidAt).toLocaleString('vi-VN')}.`
          : `Đơn hàng ${order.orderCode} đã thanh toán thành công.`,
      };
    case 'REFUNDED':
      return {
        className: 'border-amber-200 bg-amber-50 text-amber-800',
        title: 'Khoản thanh toán đã hoàn',
        description: order.refundedAt
          ? `Hệ thống đã hoàn tiền lúc ${new Date(order.refundedAt).toLocaleString('vi-VN')}.`
          : 'Hệ thống đã hoàn tiền cho order này.',
      };
    case 'FAILED':
      return {
        className: 'border-red-200 bg-red-50 text-red-700',
        title: 'Thanh toán chưa thành công',
        description: `Bạn có thể quay lại checkout để thử thanh toán lại cho order ${order.orderCode}.`,
      };
    default:
      return {
        className: 'border-amber-200 bg-amber-50 text-amber-800',
        title: 'Đang chờ thanh toán',
        description: `Order ${order.orderCode} đã được tạo nhưng chưa hoàn tất thanh toán.`,
      };
  }
}

export default function BookingDetails() {
  const bookingId = parseId(useParams<{ id: string }>().id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let m = true;

    async function loadDetails() {
      if (!bookingId) {
        setError('Mã booking không hợp lệ.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setMounted(false);
      setError(null);

      try {
        const bookingData = await getBooking(bookingId);
        const [orderData, tourData] = await Promise.all([
          findOrderByBooking(bookingData.id),
          getTourById(bookingData.tourId).catch(() => null),
        ]);

        if (!m) return;

        setBooking(bookingData);
        setOrder(orderData);
        setTour(tourData);

        if (bookingData.status === 'CONFIRMED' || bookingData.status === 'COMPLETED') {
          try {
            const ticketData = await getTicket(bookingData.id);
            if (m) setTicket(ticketData);
          } catch {
            if (m) setTicket(null);
          }
        }

        if (bookingData.status === 'COMPLETED') {
          // Simulate fetching existing review (none exists)
          if (m) setExistingReview(null);
        }

        if (m) setTimeout(() => setMounted(true), 60);
      } catch (loadError: unknown) {
        if (!m) return;
        setError(extractApiErrorMessage(loadError, 'Không thể tải chi tiết booking.'));
      } finally {
        if (m) setLoading(false);
      }
    }

    void loadDetails();
    return () => { m = false; };
  }, [bookingId]);

  const statusMeta = useMemo(
    () => (booking ? getBookingStatusMeta(booking.status) : null),
    [booking],
  );
  const orderNotice = useMemo(() => getOrderNotice(order), [order]);

  async function handleCancel() {
    if (!booking || booking.status !== 'PENDING') return;
    setCancelling(true);
    setError(null);
    try {
      const updated = await cancelBooking(booking.id);
      setBooking(updated);
    } catch (cancelError: unknown) {
      setError(extractApiErrorMessage(cancelError, 'Không thể hủy booking này.'));
    } finally {
      setCancelling(false);
    }
  }

  async function handleSubmitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!booking) return;
    setReviewSubmitting(true);
    setReviewMessage(null);
    try {
      await new Promise(r => setTimeout(r, 1000));
      const submitted: Review = {
        id: Math.floor(Math.random() * 10000),
        userId: 1,
        tourId: booking.tourId,
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
        reviewStatus: 'PENDING',
        userFullName: 'Khách hàng',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setExistingReview(submitted);
      setComment('');
    } catch (reviewError: unknown) {
      setReviewMessage({ ok: false, text: 'Không thể gửi đánh giá.' });
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-on-surface-variant font-medium animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-6xl">receipt_long</span>
        <p className="text-lg font-semibold">{error ?? 'Không tìm thấy booking.'}</p>
        <Link to="/my-bookings" className="primary-gradient text-white px-6 py-3 rounded-xl font-bold text-sm">
          Quay lại danh sách booking
        </Link>
      </div>
    );
  }

  const show = (delay: number) =>
    `transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  return (
    <div className="pb-20">

      {/* Back link */}
      <div
        className={`px-6 lg:px-8 pt-4 pb-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-1">arrow_back</span>
          Danh sách chuyến đi
        </Link>
      </div>

      {/* Hero banner */}
      <div
        className={`px-6 lg:px-8 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}
      >
        <div className="relative rounded-[2.5rem] overflow-hidden h-60 lg:h-80 shadow-2xl">
          <img
            src={booking.tourCoverImage ?? `https://picsum.photos/seed/${booking.id}/1200/500`}
            alt={booking.tourTitle}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Status top-right */}
          {statusMeta && (
            <div className={`absolute top-5 right-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm ${statusMeta.className}`}>
              <span className="material-symbols-outlined text-base">{statusMeta.icon}</span>
              {statusMeta.label}
            </div>
          )}

          {/* Title bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-1.5">
              {tour ? `${tour.durationDays} ngày ${tour.durationNights} đêm` : 'Booking detail'}
            </p>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight max-w-2xl">
              {booking.tourTitle}
            </h1>
            <p className="text-sm text-white/60 mt-1.5">
              Mã booking <span className="font-bold text-white/90">{booking.bookingCode}</span>
              {tour && (
                <span className="ml-3">· {tour.destination.name} · {fmtDate(booking.departureDate)}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 lg:mx-8 mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Stats row */}
      <div
        className={`px-6 lg:px-8 mb-6 ${show(100)}`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon="group" label="Số khách" value={`${booking.guestCount} khách`} />
          <StatCard icon="payments" label="Tổng tiền" value={fmtCurrency(Number(booking.totalAmount))} highlight />
          <StatCard icon="event_available" label="Ngày đặt" value={new Date(booking.createdAt).toLocaleDateString('vi-VN')} />
        </div>
      </div>

      {/* Main grid */}
      <div className="px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Contact + Payment */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-5 ${show(150)}`}
            style={{ transitionDelay: '150ms' }}
          >
            <Card>
              <CardHeader icon="person" iconBg="bg-primary/10" iconColor="text-primary" title="Thông tin liên hệ" />
              <div className="space-y-2.5">
                <InfoRow label="Người liên hệ" value={booking.contactName} />
                <InfoRow label="Email" value={booking.contactEmail} />
                <InfoRow label="Điện thoại" value={booking.contactPhone || '--'} />
                {booking.notes && <InfoRow label="Ghi chú" value={booking.notes} />}
              </div>
            </Card>

            <Card>
              <CardHeader icon="receipt_long" iconBg="bg-secondary/10" iconColor="text-secondary" title="Thanh toán" />
              <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${orderNotice.className}`}>
                <p className="font-bold">{orderNotice.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed">{orderNotice.description}</p>
              </div>
              <div className="space-y-2">
                <InfoRow label="Tạm tính" value={fmtCurrency(Number(booking.subtotal))} />
                <InfoRow label="Thuế & phí" value={fmtCurrency(Number(booking.taxAmount))} />
                {Number(booking.discountAmount) > 0 && (
                  <InfoRow label="Giảm giá" value={`-${fmtCurrency(Number(booking.discountAmount))}`} green />
                )}
                <div className="pt-2 border-t border-surface-container-high">
                  <InfoRow label="Tổng cộng" value={fmtCurrency(Number(booking.totalAmount))} strong />
                </div>
                {order && <InfoRow label="Mã đơn hàng" value={order.orderCode} />}
              </div>
            </Card>
          </div>

          {/* Itinerary */}
          {tour && tour.itineraryDays.length > 0 && (
            <Card
              className={`${show(200)}`}
              style={{ transitionDelay: '200ms' }}
            >
              <CardHeader icon="route" iconBg="bg-amber-500/10" iconColor="text-amber-600" title="Tóm tắt lịch trình" />
              <div className="relative">
                <div className="absolute left-[1.1rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/40 via-primary/15 to-transparent rounded-full" />
                <div className="space-y-5">
                  {tour.itineraryDays.slice(0, 4).map((day, idx) => (
                    <div
                      key={day.id}
                      className={`flex gap-4 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${260 + idx * 80}ms` }}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-white shadow-sm text-primary shrink-0 flex items-center justify-center text-sm font-black z-10">
                        {day.dayNumber}
                      </div>
                      <div className="pt-1.5 pb-1">
                        <p className="font-bold text-sm text-on-surface">{day.title}</p>
                        <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">{day.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Review */}
          {booking.status === 'COMPLETED' && (
            <Card
              className={`${show(300)}`}
              style={{ transitionDelay: '300ms' }}
            >
              <CardHeader icon="star" iconBg="bg-yellow-400/15" iconColor="text-yellow-500" title="Đánh giá chuyến đi" fill />

              {existingReview ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <span
                          key={v}
                          className="material-symbols-outlined text-[1.6rem]"
                          style={{
                            fontVariationSettings: existingReview.rating >= v ? "'FILL' 1" : "'FILL' 0",
                            color: existingReview.rating >= v ? '#eab308' : '#cbd5e1',
                          }}
                        >star</span>
                      ))}
                    </div>
                    <span className="font-bold text-sm text-on-surface-variant">{existingReview.rating}/5</span>
                  </div>

                  {existingReview.comment && (
                    <div className="relative bg-surface-container-low rounded-2xl px-5 py-4">
                      <span className="absolute -top-2 left-4 text-5xl leading-none text-primary/20 font-serif select-none">"</span>
                      <p className="text-sm text-on-surface leading-relaxed pt-2">{existingReview.comment}</p>
                    </div>
                  )}

                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    existingReview.reviewStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    existingReview.reviewStatus === 'HIDDEN' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {existingReview.reviewStatus === 'APPROVED' ? 'check_circle' :
                       existingReview.reviewStatus === 'HIDDEN' ? 'visibility_off' : 'schedule'}
                    </span>
                    {existingReview.reviewStatus === 'APPROVED' ? 'Đã duyệt · hiển thị công khai' :
                     existingReview.reviewStatus === 'HIDDEN' ? 'Đã bị ẩn bởi quản trị viên' :
                     'Đang chờ duyệt'}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-on-surface-variant mb-5">Chia sẻ trải nghiệm của bạn về chuyến đi này.</p>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRating(v)}
                          className="p-1 transition-all hover:scale-125 active:scale-95"
                        >
                          <span
                            className="material-symbols-outlined text-[2rem] transition-all duration-150"
                            style={{
                              fontVariationSettings: rating >= v ? "'FILL' 1" : "'FILL' 0",
                              color: rating >= v ? '#eab308' : '#cbd5e1',
                            }}
                          >star</span>
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-bold text-on-surface-variant">{rating}/5</span>
                    </div>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-2xl border border-surface-container-high bg-surface-container-low/50 px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                    />
                    {reviewMessage && (
                      <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl ${reviewMessage.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                        <span className="material-symbols-outlined text-base">{reviewMessage.ok ? 'check_circle' : 'error'}</span>
                        {reviewMessage.text}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="primary-gradient text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60 inline-flex items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {reviewSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">send</span>
                          Gửi đánh giá
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </Card>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <aside
          className={`space-y-5 xl:sticky xl:top-24 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
          style={{ transitionDelay: '180ms' }}
        >
          {/* Actions */}
          <Card>
            <h3 className="text-base font-black tracking-tight mb-4">Hành động</h3>
            <div className="space-y-3">
              {booking.status === 'PENDING' && (
                <>
                  <Link
                    to={`/checkout?bookingId=${booking.id}`}
                    className="flex items-center justify-center gap-2 w-full primary-gradient text-white px-5 py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="material-symbols-outlined text-base">credit_card</span>
                    {order ? 'Tiếp tục thanh toán' : 'Thanh toán booking'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleCancel()}
                    disabled={cancelling}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl border border-red-200 text-red-600 font-bold disabled:opacity-60 hover:bg-red-50 transition-all"
                  >
                    {cancelling
                      ? <><div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />Đang hủy...</>
                      : <><span className="material-symbols-outlined text-base">cancel</span>Hủy booking</>
                    }
                  </button>
                </>
              )}
              {ticket && (
                <a
                  href={buildTicketDownloadUrl(ticket)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high font-bold transition-all hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Tải e-ticket PDF
                </a>
              )}
              {booking.status === 'COMPLETED' && !ticket && (
                <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant font-medium py-2">
                  <span className="material-symbols-outlined text-base text-blue-500">check_circle</span>
                  Chuyến đi đã hoàn thành
                </div>
              )}
              {booking.status === 'CANCELLED' && (
                <div className="flex items-center justify-center gap-2 text-sm text-red-500 font-semibold py-2">
                  <span className="material-symbols-outlined text-base">cancel</span>
                  Booking đã bị hủy
                </div>
              )}
            </div>
          </Card>

          {/* E-ticket */}
          {ticket && (
            <Card>
              <CardHeader icon="confirmation_number" iconBg="bg-primary/10" iconColor="text-primary" title="E-Ticket" />
              <div className="rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 flex flex-col items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-7xl text-primary">qr_code_2</span>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Xuất trình khi check-in</p>
              </div>
              <div className="space-y-2.5">
                <InfoRow label="Người dùng" value={ticket.customerName} />
                <InfoRow label="Email" value={ticket.customerEmail} />
                <InfoRow label="Phát hành" value={new Date(ticket.issuedAt).toLocaleString('vi-VN')} />
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function Card({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-[2rem] border border-surface-container-low/60 p-6 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon, iconBg, iconColor, title, fill = false,
}: {
  icon: string; iconBg: string; iconColor: string; title: string; fill?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <span
          className={`material-symbols-outlined text-xl ${iconColor}`}
          style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >{icon}</span>
      </div>
      <h3 className="text-base font-black tracking-tight">{title}</h3>
    </div>
  );
}

function InfoRow({
  label, value, strong = false, green = false,
}: {
  label: string; value: string; strong?: boolean; green?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-on-surface-variant shrink-0">{label}</span>
      <span className={`text-right text-xs break-all ${
        strong ? 'font-black text-on-surface text-sm' :
        green ? 'font-semibold text-green-600' :
        'font-semibold text-on-surface'
      }`}>{value}</span>
    </div>
  );
}

function StatCard({
  icon, label, value, highlight = false,
}: {
  icon: string; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-3.5 lg:p-4 transition-all hover:-translate-y-0.5 ${highlight ? 'primary-gradient text-white shadow-lg' : 'bg-surface-container-low'}`}>
      <span className={`material-symbols-outlined text-xl mb-2 block ${highlight ? 'text-white' : 'text-primary'}`}>{icon}</span>
      <p className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-wide leading-none mb-1 ${highlight ? 'text-white/70' : 'text-on-surface-variant'}`}>
        {label}
      </p>
      <p className={`font-black text-xs lg:text-sm leading-tight ${highlight ? 'text-white' : 'text-on-surface'}`}>{value}</p>
    </div>
  );
}
