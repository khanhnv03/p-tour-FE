import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { getBooking, type Booking } from '../api/bookings';
import { getOrder, type Order } from '../api/orders';
import { extractApiErrorMessage } from '../api/types';
import { BRAND_NAME } from '../constants';
import UserNavbar from '../components/UserNavbar';

const fmtCurrency = (value: number) => `${value.toLocaleString('vi-VN')}₫`;
const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

function parsePositiveInt(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const bookingId = parsePositiveInt(searchParams.get('bookingId'));
  const orderId = parsePositiveInt(searchParams.get('orderId'));
  const payment = searchParams.get('payment');

  const [loading, setLoading] = useState(Boolean(bookingId || orderId));
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadResult() {
      if (!bookingId && !orderId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [bookingData, orderData] = await Promise.all([
          bookingId ? getBooking(bookingId) : Promise.resolve(null),
          orderId ? getOrder(orderId) : Promise.resolve(null),
        ]);

        if (!mounted) return;
        setBooking(bookingData);
        setOrder(orderData);
      } catch (loadError: unknown) {
        if (!mounted) return;
        setError(extractApiErrorMessage(loadError, 'Không thể tải kết quả thanh toán.'));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadResult();
    return () => {
      mounted = false;
    };
  }, [bookingId, orderId]);

  const resolvedStatus = order?.paymentStatus
    ?? (payment === 'paid' ? 'PAID' : payment === 'refunded' ? 'REFUNDED' : payment === 'pending' ? 'PENDING' : null);

  const statusMeta = (() => {
    switch (resolvedStatus) {
      case 'PAID':
        return {
          eyebrow: 'Đặt chỗ thành công',
          title: 'Thanh toán thành công',
          subtitle: 'Chỗ của bạn đã được xác nhận. Hệ thống đã tạo booking và đơn hàng thành công.',
          icon: 'verified',
          iconClass: 'bg-green-100 text-green-600',
          iconBgGlow: 'shadow-green-200',
          noteClass: 'bg-green-50 border border-green-100 text-green-800',
          note: 'Bạn có thể tải e-ticket và theo dõi booking trong khu vực "Chuyến đi của tôi".',
        };
      case 'REFUNDED':
        return {
          eyebrow: 'Đã hoàn tiền',
          title: 'Khoản thanh toán đã hoàn',
          subtitle: 'Đơn hàng đã được hoàn tiền. Booking liên quan có thể đã bị hủy hoặc đóng lại theo xử lý từ hệ thống.',
          icon: 'undo',
          iconClass: 'bg-amber-100 text-amber-600',
          iconBgGlow: 'shadow-amber-200',
          noteClass: 'bg-amber-50 border border-amber-100 text-amber-800',
          note: 'Nếu cần đặt lại, hãy quay lại trang tour hoặc kiểm tra trạng thái booking trước khi thanh toán tiếp.',
        };
      case 'PENDING':
      default:
        return {
          eyebrow: 'Chờ thanh toán',
          title: 'Đã tạo booking',
          subtitle: 'Booking và đơn hàng đã được tạo. Bạn có thể tiếp tục thanh toán khi sẵn sàng.',
          icon: 'hourglass_top',
          iconClass: 'bg-blue-100 text-blue-600',
          iconBgGlow: 'shadow-blue-200',
          noteClass: 'bg-surface-container-low border border-surface-container text-on-surface-variant',
          note: 'Chỗ chỉ được xác nhận sau khi đơn hàng chuyển sang trạng thái thanh toán thành công.',
        };
    }
  })();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <UserNavbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-14 flex items-start">
        <section className="w-full space-y-6">

          {/* Header */}
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${statusMeta.iconClass} ${statusMeta.iconBgGlow}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {statusMeta.icon}
              </span>
            </motion.div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary mb-1.5">
                {statusMeta.eyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{statusMeta.title}</h1>
              <p className="text-sm text-on-surface-variant mt-1.5 max-w-xl">{statusMeta.subtitle}</p>
            </div>
          </motion.div>

          {/* Main card */}
          {loading ? (
            <motion.div
              className="bg-surface-container-lowest rounded-2xl border border-surface-container-low/60 p-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm font-semibold text-red-600"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              className="bg-surface-container-lowest rounded-2xl border border-surface-container-low/60 p-6 md:p-8 shadow-sm space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              {/* Info blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: 'Booking',
                    value: booking?.bookingCode ?? '--',
                    description: booking
                      ? `Khởi hành ${fmtDate(booking.departureDate)}`
                      : 'Đang cập nhật thông tin booking',
                    delay: 0.25,
                  },
                  {
                    label: 'Đơn hàng',
                    value: order?.orderCode ?? '--',
                    description: order
                      ? `${order.paymentMethod} · ${order.paymentStatus}`
                      : 'Chưa có thông tin đơn hàng',
                    delay: 0.32,
                  },
                  {
                    label: 'Tour',
                    value: booking?.tourTitle ?? order?.tourTitle ?? '--',
                    description: booking ? `${booking.guestCount} khách` : 'Đang cập nhật',
                    delay: 0.39,
                  },
                  {
                    label: 'Tổng thanh toán',
                    value: order
                      ? fmtCurrency(Number(order.amount))
                      : booking
                      ? fmtCurrency(Number(booking.totalAmount))
                      : '--',
                    description:
                      resolvedStatus === 'PAID'
                        ? 'Đã được ghi nhận thanh toán'
                        : resolvedStatus === 'REFUNDED'
                        ? 'Khoản thanh toán đã được hoàn'
                        : 'Bạn có thể tiếp tục thanh toán sau',
                    delay: 0.46,
                  },
                ].map(({ label, value, description, delay }) => (
                  <motion.div
                    key={label}
                    className="rounded-xl bg-surface-container-low px-5 py-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay }}
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
                    <p className="text-xl font-black tracking-tight text-on-surface mt-2">{value}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Note */}
              <motion.div
                className={`rounded-xl px-5 py-4 text-sm ${statusMeta.noteClass}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              >
                <p className="font-semibold">Xác nhận đã được lưu trong hệ thống.</p>
                <p className="mt-1">
                  {booking ? (
                    <>Booking <strong>{booking.bookingCode}</strong> hiện có thể được theo dõi trong khu vực "Chuyến đi của tôi".</>
                  ) : (
                    statusMeta.note
                  )}
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.62 }}
              >
                {booking && (
                  <Link
                    to={`/my-bookings/${booking.id}`}
                    className="primary-gradient text-white px-6 py-3.5 rounded-xl font-bold text-center text-sm hover:shadow-lg transition-shadow active:scale-95"
                  >
                    Xem chi tiết booking
                  </Link>
                )}
                {resolvedStatus !== 'PAID' && resolvedStatus !== 'REFUNDED' && booking && (
                  <Link
                    to={`/checkout?bookingId=${booking.id}`}
                    className="px-6 py-3.5 rounded-xl bg-surface-container-high text-on-surface font-bold text-center text-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                  >
                    Tiếp tục thanh toán
                  </Link>
                )}
                <Link
                  to="/my-bookings"
                  className="px-6 py-3.5 rounded-xl bg-surface-container-high text-on-surface font-bold text-center text-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                >
                  Về danh sách booking
                </Link>
              </motion.div>
            </motion.div>
          )}
        </section>
      </main>

      <footer className="py-8 border-t border-surface-container text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
        </p>
      </footer>
    </div>
  );
}
